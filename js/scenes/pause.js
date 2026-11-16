import { drawText } from '../gfx/font.js';
import { C, Menu, W, box } from '../gfx/ui.js';
import { StatsScene } from './stats.js';
import { SettingsScene } from './settings.js';
import { TitleScene } from './title.js';

export class PauseScene {
  constructor(game) {
    this.game = game;
    this.opaque = false;
    this.menu = new Menu(['Resume', 'Stats', 'Settings', 'Title screen'], { cancelIndex: 0 });
  }

  update() {
    const i = this.menu.update();
    const game = this.game;
    if (i === 0) game.pop();
    else if (i === 1) game.transition(() => game.push(new StatsScene(game)));
    else if (i === 2) game.transition(() => game.push(new SettingsScene(game)));
    else if (i === 3) game.transition(() => game.reset(new TitleScene(game)));
  }

  render(ctx) {
    ctx.fillStyle = 'rgba(11,9,7,0.6)';
    ctx.fillRect(0, 0, W, 480);
    box(ctx, W / 2 - 130, 120, 260, 220);
    drawText(ctx, 'MENU', W / 2, 140, { scale: 2, color: C.yellow, align: 'center' });
    this.menu.render(ctx, W / 2 - 90, 184, { gap: 34 });
    drawText(ctx, 'Progress saves automatically.', W / 2, 360, { color: C.gray, align: 'center', shadow: C.black });
  }
}
