import { drawText } from '../gfx/font.js';
import { C, Menu, W, box } from '../gfx/ui.js';

/** Small yes/no overlay. onDone(true) for the first option. */
export class ConfirmScene {
  constructor(game, lines, options, onDone) {
    this.game = game;
    this.opaque = false;
    this.lines = lines;
    this.menu = new Menu(options, { horizontal: true, index: 1, cancelIndex: 1 });
    this.onDone = onDone;
  }

  update() {
    const i = this.menu.update();
    if (i < 0) return;
    this.game.pop();
    this.onDone(i === 0);
  }

  render(ctx) {
    const h = 70 + this.lines.length * 26;
    const y = 240 - h / 2;
    box(ctx, 90, y, W - 180, h);
    this.lines.forEach((l, i) => drawText(ctx, l, W / 2, y + 22 + i * 26, { align: 'center', color: C.white }));
    this.menu.render(ctx, W / 2 - 110, y + h - 38, { spacing: 140 });
  }
}
