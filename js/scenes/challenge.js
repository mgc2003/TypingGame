import { drawText, drawChar, wrap, normalizeChar, ADVANCE } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, W, H, box, bar, heart } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { SENTENCES } from '../data/sentences.js';
import { scoreSentence, scoreRound, liveStats, showWpm, showAcc } from '../core/scoring.js';
import { ResultsScene } from './results.js';

const SCALE = 2;
const CW = ADVANCE * SCALE; // char cell width
const LH = 24; // line height
const MAX_CHARS = 47;
const TARGET_BOX = { x: 16, y: 58, w: W - 32, h: 144 };
const TYPED_BOX = { x: 16, y: 218, w: W - 32, h: 144 };
const PAD_X = 20;
const PAD_Y = 18;
const EXTRA = 12; // how far past the target length the player may type

function pick(list, n) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

export class ChallengeScene {
  constructor(game, npc, goal, practice, onFinish) {
    this.game = game;
    this.npc = npc;
    this.goal = goal;
    this.practice = practice;
    this.onFinish = onFinish;
    this.sentences = pick(SENTENCES[npc.id], npc.roundSize);
    this.index = 0;
    this.results = [];
    this.t = 0;
    this.review = 0; // frames left showing the last sentence's result
    this.loadSentence();
  }

  loadSentence() {
    this.target = this.sentences[this.index];
    this.layout = wrap(this.target, MAX_CHARS);
    this.typed = '';
    this.start = null;
  }

  /** Grid position (line, col) for character index i, including overflow past the target. */
  cell(i) {
    const pos = this.layout.pos;
    if (i < pos.length) return pos[i];
    const last = pos[pos.length - 1];
    let col = last.col + 1 + (i - pos.length);
    let line = last.line;
    if (col > MAX_CHARS) {
      line += 1;
      col -= MAX_CHARS + 1;
    }
    return { line, col };
  }

  submit(time) {
    const ms = this.start === null ? 0 : time - this.start;
    const r = scoreSentence(this.target, this.typed, ms);
    this.results.push(r);
    this.lastResult = r;
    sfx.sent();
    this.review = 80;
  }

  advance() {
    this.review = 0;
    this.index++;
    if (this.index >= this.sentences.length) {
      const round = scoreRound(this.results);
      const game = this.game;
      game.transition(() => {
        game.swap(new ResultsScene(game, this.npc, this.goal, this.practice, round, this.results, this.onFinish));
      }, 20);
      return false;
    }
    this.loadSentence();
    return true;
  }

  leave() {
    sfx.back();
    const game = this.game;
    game.transition(() => {
      game.pop();
      this.onFinish(null);
    });
  }

  update() {
    this.t++;
    if (this.game.busy) return;

    if (this.review > 0) {
      this.review--;
      const evs = input.events;
      // Typing a letter ends the review immediately (so no keystrokes are lost);
      // Enter only skips after a short guard so a double-tap doesn't skip by accident.
      const skip = evs.find((ev) => (ev.key === 'Enter' && this.review < 70) || (ev.key.length === 1 && !ev.ctrl && !ev.alt));
      if (this.review === 0 || skip) {
        if (!this.advance()) return;
        // a printable key that ended the review becomes the first key of the next sentence
        if (skip && skip.key !== 'Enter') this.handleEvents(evs.slice(evs.indexOf(skip)));
      }
      return;
    }
    this.handleEvents(input.events);
  }

  handleEvents(events) {
    for (const ev of events) {
      if (ev.key === 'Escape') return this.leave();
      if (ev.key === 'Enter') {
        if (this.typed.length === 0) {
          sfx.error();
          continue;
        }
        this.submit(ev.time);
        return;
      }
      if (ev.key === 'Backspace') {
        if (!this.typed.length) continue;
        if (ev.ctrl || ev.alt) {
          // delete the previous word
          this.typed = this.typed.replace(/\S*\s*$/, '');
        } else {
          this.typed = this.typed.slice(0, -1);
        }
        sfx.key();
        continue;
      }
      if (ev.ctrl || ev.alt) continue;
      if (ev.key.length !== 1) continue;
      const ch = normalizeChar(ev.key);
      if (this.typed.length >= this.target.length + EXTRA) {
        sfx.error();
        continue;
      }
      if (this.start === null) this.start = ev.time;
      const i = this.typed.length;
      this.typed += ch;
      sfx.key(this.target[i] !== ch);
    }
  }

  // ---------- render ----------

  render(ctx) {
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);

    // header
    drawSprite(ctx, 'envelope', 'idle', 18, 16, 3);
    drawText(ctx, `Letters from the ${this.npc.name}`, 60, 20, { color: C.white });
    drawText(ctx, `${Math.min(this.index + 1, this.sentences.length)}/${this.sentences.length}`, W - 20, 20, {
      color: C.yellow,
      align: 'right',
    });

    // target sentence
    box(ctx, TARGET_BOX.x, TARGET_BOX.y, TARGET_BOX.w, TARGET_BOX.h, { border: C.gray });
    const n = this.typed.length;
    for (let i = 0; i < this.target.length; i++) {
      const { line, col } = this.layout.pos[i];
      const x = TARGET_BOX.x + PAD_X + col * CW;
      const y = TARGET_BOX.y + PAD_Y + line * LH;
      let color = C.white;
      if (i < n) color = C.dim;
      else if (i === n && this.review === 0) {
        color = C.yellow;
        ctx.fillStyle = C.yellow;
        ctx.fillRect(x, y + 18, 10, 2);
      }
      drawChar(ctx, this.target[i], x, y, SCALE, color);
    }

    // typed text, laid out on the same grid as the target
    box(ctx, TYPED_BOX.x, TYPED_BOX.y, TYPED_BOX.w, TYPED_BOX.h);
    for (let i = 0; i < n; i++) {
      const { line, col } = this.cell(i);
      const x = TYPED_BOX.x + PAD_X + col * CW;
      const y = TYPED_BOX.y + PAD_Y + line * LH;
      const ok = this.typed[i] === this.target[i];
      if (!ok && this.typed[i] === ' ') {
        ctx.fillStyle = C.red;
        ctx.fillRect(x, y + 6, 10, 6);
      }
      drawChar(ctx, this.typed[i], x, y, SCALE, ok ? C.white : C.red);
    }
    if (this.review === 0) {
      const { line, col } = this.cell(n);
      if (Math.floor(this.t / 18) % 2 === 0 || this.start === null) {
        heart(ctx, TYPED_BOX.x + PAD_X + col * CW - 1, TYPED_BOX.y + PAD_Y + line * LH + 2, 2);
      }
      if (n === 0) drawText(ctx, 'Start typing...', TYPED_BOX.x + PAD_X + 20, TYPED_BOX.y + PAD_Y, { color: C.dim });
    } else {
      this.renderReview(ctx);
    }

    // live stats
    const ms = this.start === null ? 0 : performance.now() - this.start;
    const live = this.review ? this.lastResult : liveStats(this.target, this.typed, ms);
    const shownMs = this.review ? this.lastResult.ms : ms;
    const secs = Math.floor(shownMs / 1000);
    const y = 378;
    drawText(ctx, `WPM ${showWpm(live.net)}`, 24, y, { color: C.white });
    drawText(ctx, `ACC ${showAcc(live.acc)}%`, W / 2, y, { color: C.white, align: 'center' });
    drawText(ctx, `TIME ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, W - 24, y, {
      color: C.white,
      align: 'right',
    });

    // goal meter (based on finished sentences this round)
    const gy = 408;
    if (this.practice) {
      drawText(ctx, 'PRACTICE ROUND', 24, gy, { color: C.cyan });
    } else {
      drawText(ctx, `GOAL ${this.goal.wpm} WPM / ${this.goal.acc}%`, 24, gy, { color: C.yellow });
    }
    if (this.results.length) {
      const round = scoreRound(this.results);
      const fw = Math.min(1, round.net / this.goal.wpm);
      const fa = showAcc(round.acc) >= this.goal.acc ? 1 : Math.max(0, (round.acc * 100 - 50) / (this.goal.acc - 50));
      drawText(ctx, 'SPD', 330, gy, { color: C.gray });
      bar(ctx, 372, gy, 90, 16, fw, fw >= 1 ? C.green : C.yellow, C.dim);
      drawText(ctx, 'ACC', 478, gy, { color: C.gray });
      bar(ctx, 520, gy, 90, 16, fa, fa >= 1 ? C.green : C.yellow, C.dim);
    }

    drawText(ctx, 'ENTER: send   BACKSPACE: fix   ESC: leave', W / 2, 450, { color: C.dim, align: 'center' });
  }

  renderReview(ctx) {
    const r = this.lastResult;
    const bx = TYPED_BOX.x + 60;
    // sits below the 4th text line so even the longest letters stay readable
    const by = TYPED_BOX.y + TYPED_BOX.h - 38;
    box(ctx, bx, by, TYPED_BOX.w - 120, 34, { border: C.yellow, bw: 3 });
    const txt = `Sent!   ${showWpm(r.net)} WPM   ${showAcc(r.acc)}%`;
    drawText(ctx, txt, W / 2 + 12, by + 9, { color: C.yellow, align: 'center' });
    drawSprite(ctx, 'envelope', 'idle', W / 2 - 12 - txt.length * 6 - 14, by + 10, 2);
  }
}
