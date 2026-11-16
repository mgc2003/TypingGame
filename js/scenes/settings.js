import { drawText } from '../gfx/font.js';
import { C, Menu, W, H } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { save, persist, resetAll } from '../core/storage.js';
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER } from '../world/npcs.js';
import { ConfirmScene } from './confirm.js';
import { TitleScene } from './title.js';

const HELP = {
  0: ['Gentle lowers every goal; Tough raises it.', 'Use LEFT/RIGHT to change.'],
  1: ['Turn sound effects on or off.'],
  2: ['Erase your story, stats and settings.'],
  3: [''],
};

export class SettingsScene {
  constructor(game) {
    this.game = game;
    this.menu = new Menu(
      [
        () => `Goals:  ◀ ${DIFFICULTY_LABELS[save.settings.difficulty]} ▶`,
        () => `Sound:  ${save.settings.muted ? 'Off' : 'On'}`,
        'Reset all data',
        'Back',
      ],
      { cancelIndex: 3 },
    );
  }

  cycleDifficulty(step) {
    const order = DIFFICULTY_ORDER;
    const i = order.indexOf(save.settings.difficulty);
    save.settings.difficulty = order[(i + step + order.length) % order.length];
    persist();
    sfx.move();
  }

  update() {
    if (this.menu.index === 0) {
      if (input.pressed('left', true)) return this.cycleDifficulty(-1);
      if (input.pressed('right', true)) return this.cycleDifficulty(1);
    }
    const i = this.menu.update();
    if (i === 0) this.cycleDifficulty(1);
    else if (i === 1) {
      save.settings.muted = !save.settings.muted;
      persist();
      sfx.confirm();
    } else if (i === 2) {
      this.game.push(
        new ConfirmScene(this.game, ['Erase ALL data?', 'Story, stats and settings.'], ['Erase', 'Keep'], (yes) => {
          if (!yes) return;
          resetAll();
          // back to a fresh title screen
          this.game.transition(() => this.game.reset(new TitleScene(this.game)));
        }),
      );
    } else if (i === 3) {
      this.game.transition(() => this.game.pop());
    }
  }

  render(ctx) {
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, 'SETTINGS', W / 2, 40, { scale: 3, align: 'center' });
    this.menu.render(ctx, 150, 140, { gap: 44 });
    (HELP[this.menu.index] || []).forEach((l, k) =>
      drawText(ctx, l, W / 2, 360 + k * 24, { color: C.gray, align: 'center' }),
    );
    drawText(ctx, 'Z: select   X / ESC: back', W / 2, 450, { color: C.dim, align: 'center' });
  }
}
