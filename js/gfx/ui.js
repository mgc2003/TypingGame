import { drawText } from './font.js';
import { drawSprite } from './sprites.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';

export const W = 640;
export const H = 480;

export const C = {
  // dark academia: parchment, candlelight, oxblood and ink
  white: '#e8dcc0',
  gray: '#8c7f68',
  dim: '#4e4436',
  yellow: '#d9a845',
  red: '#c24a52',
  green: '#8aab78',
  cyan: '#7f9fb8',
  orange: '#c07a3a',
  black: '#0b0907',
  shadow: '#3a2416',
};

/** Retro dialog box: black fill with a chunky white border. */
export function box(ctx, x, y, w, h, { border = C.white, fill = C.black, bw = 4 } = {}) {
  ctx.fillStyle = border;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(x + bw, y + bw, w - bw * 2, h - bw * 2);
}

export function heart(ctx, x, y, scale = 2) {
  drawSprite(ctx, 'heart', 'idle', x, y, scale);
}

/** HP-style bar. */
export function bar(ctx, x, y, w, h, frac, fg = C.yellow, bg = C.red) {
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fg;
  ctx.fillRect(x, y, Math.round(w * Math.max(0, Math.min(1, frac))), h);
}

/**
 * Simple keyboard menu with a heart cursor. Items are strings or functions returning strings.
 * update() returns the chosen index, -2 on cancel, or -1 if nothing happened.
 */
export class Menu {
  constructor(items, { horizontal = false, index = 0, cancelIndex = -2 } = {}) {
    this.items = items;
    this.horizontal = horizontal;
    this.index = index;
    this.cancelIndex = cancelIndex;
  }

  label(i) {
    const it = this.items[i];
    return typeof it === 'function' ? it() : it;
  }

  update() {
    const prev = this.horizontal ? ['left', 'up'] : ['up', 'left'];
    const next = this.horizontal ? ['right', 'down'] : ['down', 'right'];
    const n = this.items.length;
    if (prev.some((a) => input.pressed(a, true))) {
      this.index = (this.index + n - 1) % n;
      sfx.move();
    } else if (next.some((a) => input.pressed(a, true))) {
      this.index = (this.index + 1) % n;
      sfx.move();
    }
    if (input.pressed('confirm')) {
      sfx.confirm();
      return this.index;
    }
    if (input.pressed('cancel')) {
      sfx.back();
      return this.cancelIndex;
    }
    return -1;
  }

  render(ctx, x, y, { scale = 2, gap = 28, spacing = 180, color = C.white, selColor = C.yellow } = {}) {
    for (let i = 0; i < this.items.length; i++) {
      const ix = this.horizontal ? x + i * spacing : x;
      const iy = this.horizontal ? y : y + i * gap;
      const sel = i === this.index;
      if (sel) heart(ctx, ix, iy + scale, scale);
      drawText(ctx, this.label(i), ix + 10 * scale, iy, { scale, color: sel ? selColor : color });
    }
  }
}
