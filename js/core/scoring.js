// Typing scores. Typing is free (no forced corrections), so a sentence is scored by aligning
// the final input against the target with an edit distance. That way one dropped or extra
// character costs one error instead of shifting every later character out of place.

const MIN_MS = 500;

/**
 * Levenshtein alignment of typed vs target.
 * Returns { distance, status } where status[i] is 'ok' | 'sub' | 'del' for each target character
 * ('del' = the player skipped it), plus the number of inserted (extra) characters.
 */
export function align(target, typed) {
  const n = target.length;
  const m = typed.length;
  const d = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = target[i - 1] === typed[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j - 1] + cost, d[i - 1][j] + 1, d[i][j - 1] + 1);
    }
  }
  const status = new Array(n);
  let insertions = 0;
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (target[i - 1] === typed[j - 1] ? 0 : 1)) {
      status[i - 1] = target[i - 1] === typed[j - 1] ? 'ok' : 'sub';
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      status[i - 1] = 'del';
      i--;
    } else {
      insertions++;
      j--;
    }
  }
  return { distance: d[n][m], status, insertions };
}

/** Score one sentence. ms = time from first keystroke to submit. */
export function scoreSentence(target, typed, ms) {
  const { distance, status } = align(target, typed);
  const denom = Math.max(target.length, typed.length) || 1;
  const acc = Math.max(0, 1 - distance / denom);
  const minutes = Math.max(ms, MIN_MS) / 60000;
  const gross = typed.length / 5 / minutes;
  const keyHits = {};
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    const k = keyHits[ch] || (keyHits[ch] = { miss: 0, total: 0 });
    k.total++;
    if (status[i] !== 'ok') k.miss++;
  }
  return {
    target,
    typed,
    ms: Math.max(ms, MIN_MS),
    chars: typed.length,
    distance,
    denom,
    acc,
    gross,
    net: gross * acc,
    keyHits,
  };
}

/** Combine sentence results into round totals (weighted by characters and time). */
export function scoreRound(results) {
  let chars = 0;
  let ms = 0;
  let distance = 0;
  let denom = 0;
  const keyHits = {};
  for (const r of results) {
    chars += r.chars;
    ms += r.ms;
    distance += r.distance;
    denom += r.denom;
    for (const [ch, v] of Object.entries(r.keyHits)) {
      const k = keyHits[ch] || (keyHits[ch] = { miss: 0, total: 0 });
      k.miss += v.miss;
      k.total += v.total;
    }
  }
  const acc = denom ? Math.max(0, 1 - distance / denom) : 0;
  const gross = ms ? chars / 5 / (ms / 60000) : 0;
  return { chars, ms, acc, gross, net: gross * acc, keyHits };
}

/** Whole-number display values; floored so the shown number always agrees with pass/fail. */
export const showWpm = (v) => Math.floor(v + 1e-9);
export const showAcc = (v) => Math.floor(v * 100 + 1e-9);

export function meetsGoal(round, goal) {
  return showWpm(round.net) >= goal.wpm && showAcc(round.acc) >= goal.acc;
}

/** Live (in-progress) numbers while typing: positional accuracy is good enough for a HUD. */
export function liveStats(target, typed, ms) {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
  const acc = typed.length ? correct / typed.length : 1;
  const gross = ms > 0 ? typed.length / 5 / (Math.max(ms, 1000) / 60000) : 0;
  return { acc, gross, net: gross * acc };
}
