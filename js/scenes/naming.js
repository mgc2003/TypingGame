import { drawText, measure } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, W, H } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { resetStory } from '../core/storage.js';
import { OverworldScene } from './overworld.js';
import { TitleScene } from './title.js';

const MAX = 10;
const ALLOWED = /^[A-Za-z0-9 '\-]$/;

export class NamingScene {
  constructor(game) {
    this.game = game;
    this.name = '';
    this.t = 0;
    this.shake = 0;
  }

  update() {
    this.t++;
    if (this.shake > 0) this.shake--;
    for (const ev of input.events) {
      if (ev.ctrl || ev.alt) continue;
      if (ev.key === 'Enter') {
        const n = this.name.trim();
        if (!n) {
          sfx.error();
          this.shake = 10;
        } else {
          sfx.confirm();
          resetStory(n);
          this.game.transition(() => this.game.reset(new OverworldScene(this.game)), 24);
        }
        return;
      }
      if (ev.key === 'Escape') {
        sfx.back();
        this.game.transition(() => this.game.reset(new TitleScene(this.game)));
        return;
      }
      if (ev.key === 'Backspace') {
        if (this.name.length) {
          this.name = this.name.slice(0, -1);
          sfx.key();
        }
        continue;
      }
      if (ev.key.length === 1 && ALLOWED.test(ev.key)) {
        if (this.name.length >= MAX || (ev.key === ' ' && (!this.name.length || this.name.endsWith(' ')))) {
          sfx.error();
        } else {
          this.name += ev.key;
          sfx.key();
        }
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, 'Name the courier.', W / 2, 60, { scale: 3, align: 'center' });
    drawSprite(ctx, 'fox', Math.floor(this.t / 30) % 2 ? 'down0' : 'down1', W / 2 - 48, 110, 6);

    const sx = this.shake ? (this.shake % 2 ? 4 : -4) : 0;
    const scale = 4;
    const slotW = measure('W'.repeat(MAX), scale);
    const x0 = W / 2 - slotW / 2 + sx;
    drawText(ctx, this.name, x0, 250, { scale, color: C.yellow });
    // underline slots
    for (let i = 0; i < MAX; i++) {
      ctx.fillStyle = i < this.name.length ? C.yellow : C.dim;
      ctx.fillRect(x0 + i * 24, 288, 20, 3);
    }
    if (this.name.length < MAX && Math.floor(this.t / 20) % 2 === 0) {
      ctx.fillStyle = C.white;
      ctx.fillRect(x0 + this.name.length * 24, 250, 3, 32);
    }

    drawText(ctx, 'Type a name (up to 10 letters).', W / 2, 330, { align: 'center', color: C.gray });
    drawText(ctx, 'ENTER: confirm    BACKSPACE: erase    ESC: back', W / 2, 430, { align: 'center', color: C.dim });
  }
}
