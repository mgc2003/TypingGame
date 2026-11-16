import { drawText } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, Menu, W, H } from '../gfx/ui.js';
import { save } from '../core/storage.js';
import { NamingScene } from './naming.js';
import { OverworldScene } from './overworld.js';
import { StatsScene } from './stats.js';
import { SettingsScene } from './settings.js';
import { ConfirmScene } from './confirm.js';

export class TitleScene {
  constructor(game) {
    this.game = game;
    this.t = 0;
    // falling envelopes in the background
    this.letters = Array.from({ length: 14 }, (_, i) => ({
      x: (i * 97) % W,
      y: (i * 53) % H,
      v: 0.3 + (i % 4) * 0.15,
      sway: i * 0.7,
    }));
    this.buildMenu();
  }

  buildMenu() {
    this.hasSave = !!save.playerName;
    this.options = this.hasSave ? ['Continue', 'New Game', 'Stats', 'Settings'] : ['Start', 'Stats', 'Settings'];
    this.menu = new Menu(this.options, { cancelIndex: -1 });
  }

  resume() {
    this.buildMenu();
  }

  update() {
    this.t++;
    for (const l of this.letters) {
      l.y += l.v;
      if (l.y > H + 10) {
        l.y = -20;
        l.x = (l.x + 211) % W;
      }
    }
    const i = this.menu.update();
    if (i < 0) return;
    const choice = this.options[i];
    const game = this.game;
    if (choice === 'Start') {
      game.transition(() => game.swap(new NamingScene(game)));
    } else if (choice === 'Continue') {
      game.transition(() => game.reset(new OverworldScene(game)));
    } else if (choice === 'New Game') {
      game.push(
        new ConfirmScene(game, ['Start a new story?', 'Your typing stats are kept.'], ['Yes', 'No'], (yes) => {
          if (yes) game.transition(() => game.reset(new NamingScene(game)));
        }),
      );
    } else if (choice === 'Stats') {
      game.transition(() => game.push(new StatsScene(game)));
    } else if (choice === 'Settings') {
      game.transition(() => game.push(new SettingsScene(game)));
    }
  }

  render(ctx) {
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);
    for (const l of this.letters) {
      ctx.globalAlpha = 0.25;
      drawSprite(ctx, 'envelope', 'idle', l.x + Math.sin(this.t / 40 + l.sway) * 12, l.y, 2);
    }
    ctx.globalAlpha = 1;

    drawText(ctx, 'LOST LETTERS', W / 2, 70, { scale: 6, color: C.white, align: 'center', shadow: C.shadow });
    drawText(ctx, 'a little typing adventure', W / 2, 130, { scale: 2, color: C.gray, align: 'center' });

    const wing = Math.floor(this.t / 12) % 2;
    const hover = Math.round(Math.sin(this.t / 15) * 4);
    drawSprite(ctx, 'owl', 'down' + wing, W / 2 - 32, 166 + hover, 4);

    this.menu.render(ctx, W / 2 - 80, 260, { gap: 34 });

    drawText(ctx, 'ARROWS/WASD: move   Z/ENTER: select', W / 2, 440, { scale: 2, color: C.dim, align: 'center' });
    if (save.complete) drawText(ctx, '♥ all letters delivered ♥', W / 2, 410, { scale: 2, color: C.yellow, align: 'center' });
  }
}
