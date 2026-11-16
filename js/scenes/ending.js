import { drawText } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, W, H } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { save } from '../core/storage.js';
import { showWpm, showAcc } from '../core/scoring.js';
import { NPCS } from '../world/npcs.js';

export class EndingScene {
  constructor(game) {
    this.game = game;
    this.t = 0;
    const name = save.playerName || 'Courier';
    this.lines = [
      'The last lost letter is delivered.',
      'One by one, lanterns flicker on across the village.',
      'Somewhere, a shy mushroom is reading a letter',
      'for the third time, and smiling.',
      '',
      `Thank you, ${name}.`,
    ];
  }

  enter() {
    sfx.befriend();
  }

  update() {
    this.t++;
    if (this.t > 200 && input.pressed('confirm')) {
      sfx.confirm();
      // back to the village; everyone still trades letters for practice
      this.game.transition(() => this.game.pop(), 30);
    }
  }

  render(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // little parade: the courier and all their new friends
    const total = NPCS.length + 1;
    const spacing = 96;
    const x0 = W / 2 - ((total - 1) * spacing) / 2 - 24;
    const sprites = [['fox', 'down0'], ...NPCS.map((n) => [n.sprite, 'idle'])];
    sprites.forEach(([s, f], i) => {
      const bob = Math.round(Math.sin(this.t / 15 + i) * 3);
      drawSprite(ctx, s, f, x0 + i * spacing, 40 + bob, 3);
      if (i > 0) drawSprite(ctx, 'heart', 'idle', x0 + i * spacing + 17, 22 + bob, 2);
    });

    this.lines.forEach((l, i) => {
      const appear = 30 + i * 25;
      if (this.t < appear) return;
      ctx.globalAlpha = Math.min(1, (this.t - appear) / 25);
      drawText(ctx, l, W / 2, 140 + i * 28, { align: 'center', color: i === this.lines.length - 1 ? C.yellow : C.white });
    });
    ctx.globalAlpha = 1;

    if (this.t > 180) {
      drawText(ctx, 'THE END', W / 2, 330, { scale: 4, align: 'center', color: C.white, shadow: '#3a2a5a' });
      drawText(ctx, `Best speed ${showWpm(save.bests.net)} WPM   Best accuracy ${showAcc(save.bests.acc)}%`, W / 2, 384, {
        color: C.gray,
        align: 'center',
      });
    }
    if (this.t > 200) {
      drawText(ctx, 'Villagers will still trade letters for practice.', W / 2, 420, { color: C.dim, align: 'center' });
      drawText(ctx, 'Z / ENTER: return to the village', W / 2, 448, { color: C.dim, align: 'center' });
    }
  }
}
