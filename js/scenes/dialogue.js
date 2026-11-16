import { drawText, wrap, LINE_H } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, Menu, W, box } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';

const BOX = { x: 16, y: 316, w: W - 32, h: 148 };
const SCALE = 2;
const MAX_LINES = 4;
const LINE_PX = LINE_H * SCALE + 6;

/**
 * Typewriter dialogue overlay.
 * pages: [{ text, speaker?: { sprite, voice } }]
 * opts.choices: options shown after the last page; onDone(choiceIndex | null)
 */
export class DialogueScene {
  constructor(game, pages, { choices = null, prompt = null, onDone = null } = {}) {
    this.game = game;
    this.opaque = false;
    this.choices = choices;
    this.onDone = onDone;
    this.pages = [];
    for (const p of pages) this.addPage(p);
    if (choices && prompt) this.addPage({ text: prompt, speaker: null });
    this.page = 0;
    this.shown = 0;
    this.wait = 0;
    this.blipCount = 0;
    this.menu = choices ? new Menu(choices, { horizontal: true, cancelIndex: choices.length - 1 }) : null;
    this.t = 0;
  }

  /** Split long text across several pages so nothing overflows the box. */
  addPage({ text, speaker = null }) {
    const maxChars = speaker ? 38 : 46;
    const { lines } = wrap(text, maxChars);
    for (let i = 0; i < lines.length; i += MAX_LINES) {
      this.pages.push({ lines: lines.slice(i, i + MAX_LINES), speaker });
    }
  }

  get current() {
    return this.pages[this.page];
  }

  get total() {
    return this.current.lines.reduce((n, l) => n + l.length, 0);
  }

  get isLast() {
    return this.page === this.pages.length - 1;
  }

  update() {
    this.t++;
    const total = this.total;
    if (this.shown < total) {
      if (input.pressed('confirm') || input.pressed('cancel')) {
        this.shown = total;
        return;
      }
      if (this.wait > 0) {
        this.wait--;
        return;
      }
      this.shown += 0.5;
      const flat = this.current.lines.join('');
      const ch = flat[Math.floor(this.shown) - 1];
      if (ch && ch !== ' ' && Number.isInteger(this.shown)) {
        if (this.blipCount++ % 2 === 0) sfx.blip(this.current.speaker?.voice ?? 360);
        if ('.!?'.includes(ch)) this.wait = 8;
        else if (ch === ',') this.wait = 4;
      }
      return;
    }

    if (this.isLast && this.menu) {
      const i = this.menu.update();
      if (i >= 0) this.finish(i);
      return;
    }
    if (input.pressed('confirm')) {
      if (this.isLast) {
        this.finish(null);
      } else {
        this.page++;
        this.shown = 0;
        this.blipCount = 0;
      }
    }
  }

  finish(choice) {
    this.game.pop();
    this.onDone?.(choice);
  }

  render(ctx) {
    box(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    const sp = this.current.speaker;
    let tx = BOX.x + 24;
    if (sp) {
      const bob = Math.floor(this.t / 16) % 2;
      drawSprite(ctx, sp.sprite, 'idle', BOX.x + 20, BOX.y + 28 - (sp.sprite === 'ghost' ? bob * 2 : 0), 5);
      tx = BOX.x + 120;
    }
    let remaining = Math.floor(this.shown);
    this.current.lines.forEach((line, i) => {
      const part = line.slice(0, Math.max(0, remaining));
      remaining -= line.length;
      drawText(ctx, part, tx, BOX.y + 22 + i * LINE_PX, { scale: SCALE, color: C.white });
    });

    const done = this.shown >= this.total;
    if (done && this.isLast && this.menu) {
      this.menu.render(ctx, tx, BOX.y + BOX.h - 34, { spacing: Math.min(220, (BOX.x + BOX.w - tx - 20) / this.choices.length) });
    } else if (done && Math.floor(this.t / 20) % 2 === 0) {
      drawText(ctx, '▶', BOX.x + BOX.w - 30, BOX.y + BOX.h - 30, { scale: SCALE, color: C.yellow });
    }
  }
}

/** Helper: speaker info for an NPC definition. */
export function speakerOf(npc) {
  return npc ? { sprite: npc.sprite, voice: npc.voice } : null;
}
