// Save data lives in one localStorage key. Every access is guarded so the game still runs
// (without persistence) in private windows or when storage is blocked.

const KEY = 'typinggame.v1';
const HISTORY_CAP = 300;

function defaults() {
  return {
    version: 1,
    playerName: '',
    introSeen: false,
    complete: false,
    flags: {},
    bests: { net: 0, acc: 0, sentenceNet: 0 },
    history: [],
    keyStats: {},
    settings: { difficulty: 'normal', muted: false },
  };
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaults();
    const data = JSON.parse(raw);
    const d = defaults();
    if (!data || typeof data !== 'object' || data.version !== 1) return d;
    return {
      ...d,
      ...data,
      flags: { ...d.flags, ...(data.flags || {}) },
      bests: { ...d.bests, ...(data.bests || {}) },
      settings: { ...d.settings, ...(data.settings || {}) },
      history: Array.isArray(data.history) ? data.history : [],
      keyStats: data.keyStats && typeof data.keyStats === 'object' ? data.keyStats : {},
    };
  } catch {
    return defaults();
  }
}

export const save = typeof window !== 'undefined' ? load() : defaults();

export function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* storage unavailable: keep playing without saving */
  }
}

/** Start a new story but keep typing history, bests and settings. */
export function resetStory(name) {
  save.playerName = name;
  save.introSeen = false;
  save.complete = false;
  save.flags = {};
  persist();
}

/** Wipe everything. */
export function resetAll() {
  const d = defaults();
  for (const k of Object.keys(save)) delete save[k];
  Object.assign(save, d);
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Record a finished round.
 * round: { net, gross, acc } ; sentences: [{ net }] ; keyHits: { ch: { miss, total } }
 * Returns which personal bests were beaten.
 */
export function recordRound(npcId, round, sentences, keyHits) {
  const beat = { net: false, acc: false, sentenceNet: false };
  save.history.push({
    t: Date.now(),
    npc: npcId,
    net: round.net,
    gross: round.gross,
    acc: round.acc,
    n: sentences.length,
  });
  if (save.history.length > HISTORY_CAP) save.history.splice(0, save.history.length - HISTORY_CAP);
  if (round.net > save.bests.net) {
    beat.net = save.bests.net > 0;
    save.bests.net = round.net;
  }
  if (round.acc > save.bests.acc) {
    beat.acc = save.bests.acc > 0;
    save.bests.acc = round.acc;
  }
  for (const s of sentences) {
    if (s.net > save.bests.sentenceNet) {
      beat.sentenceNet = save.bests.sentenceNet > 0;
      save.bests.sentenceNet = s.net;
    }
  }
  for (const [ch, v] of Object.entries(keyHits)) {
    const cur = save.keyStats[ch] || { miss: 0, total: 0 };
    cur.miss += v.miss;
    cur.total += v.total;
    save.keyStats[ch] = cur;
  }
  persist();
  return beat;
}
