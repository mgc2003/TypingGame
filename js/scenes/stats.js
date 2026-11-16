import { drawText } from '../gfx/font.js';
import { C, W, H, box, bar } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { save } from '../core/storage.js';
import { showWpm, showAcc } from '../core/scoring.js';
import { drawChart } from '../core/chart.js';

const MIN_SAMPLES = 5;

/** Keys with the worst miss rate (only keys seen often enough to be meaningful). */
export function weakKeys(keyStats, n = 6) {
  return Object.entries(keyStats)
    .filter(([, v]) => v.total >= MIN_SAMPLES && v.miss > 0)
    .map(([ch, v]) => ({ ch, rate: v.miss / v.total, ...v }))
    .sort((a, b) => b.rate - a.rate || b.miss - a.miss)
    .slice(0, n);
}

export class StatsScene {
  constructor(game) {
    this.game = game;
  }

  update() {
    if (input.pressed('cancel') || input.pressed('confirm')) {
      sfx.back();
      this.game.transition(() => this.game.pop());
    }
  }

  render(ctx) {
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, 'YOUR TYPING', W / 2, 16, { scale: 3, align: 'center' });

    const h = save.history;
    const recent = h.slice(-10);
    const avgNet = recent.length ? recent.reduce((s, r) => s + r.net, 0) / recent.length : 0;
    const avgAcc = recent.length ? recent.reduce((s, r) => s + r.acc, 0) / recent.length : 0;

    drawText(ctx, `Best speed  ${showWpm(save.bests.net)} WPM`, 24, 56, { color: C.yellow });
    drawText(ctx, `Best acc.  ${showAcc(save.bests.acc)}%`, W - 24, 56, { color: C.cyan, align: 'right' });
    drawText(ctx, `Rounds  ${h.length}`, 24, 82, { color: C.white });
    drawText(ctx, recent.length ? `Last 10: ${showWpm(avgNet)} WPM / ${showAcc(avgAcc)}%` : 'Last 10: -', W - 24, 82, {
      color: C.white,
      align: 'right',
    });

    box(ctx, 16, 110, W - 32, 200, { border: C.gray, bw: 3 });
    drawChart(ctx, 16, 110, W - 32, 200, h);

    drawText(ctx, 'MOST MISSED KEYS', 24, 324, { color: C.white });
    const weak = weakKeys(save.keyStats);
    if (!weak.length) {
      drawText(ctx, 'Nothing yet. Keep typing!', 24, 352, { color: C.gray });
    }
    weak.forEach((k, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 24 + col * 304;
      const y = 352 + row * 28;
      const label = k.ch === ' ' ? 'SPC' : `"${k.ch}"`;
      drawText(ctx, label, x, y, { color: C.yellow });
      bar(ctx, x + 56, y, 120, 16, k.rate, C.red, C.dim);
      drawText(ctx, `${Math.round(k.rate * 100)}%`, x + 188, y, { color: C.white });
      drawText(ctx, `${k.miss}/${k.total}`, x + 290, y, { color: C.gray, align: 'right' });
    });

    drawText(ctx, 'X / ESC: back', W / 2, 452, { color: C.dim, align: 'center' });
  }
}
