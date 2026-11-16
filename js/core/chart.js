import { drawText } from '../gfx/font.js';
import { C } from '../gfx/ui.js';

/**
 * Pixel line chart of recent rounds: net WPM (yellow, left axis) and accuracy (cyan, right axis).
 */
export function drawChart(ctx, x, y, w, h, history, { maxPoints = 30 } = {}) {
  const pts = history.slice(-maxPoints);
  const padL = 64;
  const padR = 52;
  const padT = 30;
  const padB = 16;
  const px = x + padL;
  const py = y + padT;
  const pw = w - padL - padR;
  const ph = h - padT - padB;

  drawText(ctx, 'WPM', x + 8, y + 8, { color: C.yellow });
  drawText(ctx, 'ACC %', x + w - 8, y + 8, { color: C.cyan, align: 'right' });
  drawText(ctx, `last ${pts.length} rounds`, x + w / 2, y + 8, { color: C.gray, align: 'center' });

  if (pts.length < 2) {
    drawText(ctx, 'Finish a couple of rounds', x + w / 2, y + h / 2 - 12, { color: C.gray, align: 'center' });
    drawText(ctx, 'to see your progress here.', x + w / 2, y + h / 2 + 12, { color: C.gray, align: 'center' });
    return;
  }

  const maxW = Math.max(40, Math.ceil(Math.max(...pts.map((p) => p.net)) / 10) * 10);
  const minA = 50;

  // grid lines
  ctx.fillStyle = '#2a2219';
  for (let i = 0; i <= 4; i++) ctx.fillRect(px, py + Math.round((ph * i) / 4), pw, 1);
  drawText(ctx, String(maxW), px - 8, py - 6, { color: C.yellow, align: 'right' });
  drawText(ctx, '0', px - 8, py + ph - 8, { color: C.yellow, align: 'right' });
  drawText(ctx, '100', px + pw + 8, py - 6, { color: C.cyan });
  drawText(ctx, String(minA), px + pw + 8, py + ph - 8, { color: C.cyan });

  const xs = (i) => px + Math.round((pw * i) / (pts.length - 1));
  const yW = (v) => py + ph - Math.round((ph * Math.min(v, maxW)) / maxW);
  const yA = (v) => py + ph - Math.round((ph * Math.max(0, v * 100 - minA)) / (100 - minA));

  const line = (getY, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const X = xs(i);
      const Y = getY(p);
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    pts.forEach((p, i) => ctx.fillRect(xs(i) - 2, getY(p) - 2, 4, 4));
  };
  line((p) => yA(p.acc), C.cyan);
  line((p) => yW(p.net), C.yellow);
}
