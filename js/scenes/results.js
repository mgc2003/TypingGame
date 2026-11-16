import { drawText } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { C, W, H, box } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { recordRound } from '../core/storage.js';
import { meetsGoal, showWpm, showAcc } from '../core/scoring.js';

export class ResultsScene {
  constructor(game, npc, goal, practice, round, sentences, onFinish) {
    this.game = game;
    this.npc = npc;
    this.goal = goal;
    this.practice = practice;
    this.round = round;
    this.sentences = sentences;
    this.onFinish = onFinish;
    this.passed = meetsGoal(round, goal);
    this.speedOk = showWpm(round.net) >= goal.wpm;
    this.accOk = showAcc(round.acc) >= goal.acc;
    this.beat = recordRound(npc.id, round, sentences, round.keyHits);
    this.t = 0;
    this.played = false;
  }

  update() {
    this.t++;
    if (!this.played && this.t === 20) {
      this.played = true;
      if (this.practice || this.passed) sfx.sent();
      else sfx.fail();
    }
    if (this.t > 30 && input.pressed('confirm')) {
      const game = this.game;
      game.transition(() => {
        game.pop();
        this.onFinish({ passed: this.passed });
      }, 20);
    }
  }

  render(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    const r = this.round;

    let title;
    let color;
    if (this.practice) {
      title = 'Practice complete!';
      color = C.cyan;
    } else if (this.passed) {
      title = 'Letters delivered!';
      color = C.yellow;
    } else {
      title = 'Not quite...';
      color = C.red;
    }
    drawText(ctx, title, W / 2, 26, { scale: 3, color, align: 'center' });
    drawSprite(ctx, this.npc.sprite, 'idle', W / 2 - 32, 64, 4);

    // per-sentence breakdown
    box(ctx, 16, 140, W - 32, 46 + this.sentences.length * 26, { border: C.gray, bw: 3 });
    drawText(ctx, 'LETTER', 36, 154, { color: C.gray });
    drawText(ctx, 'WPM', 420, 154, { color: C.gray, align: 'right' });
    drawText(ctx, 'ACC', 560, 154, { color: C.gray, align: 'right' });
    this.sentences.forEach((s, i) => {
      const y = 180 + i * 26;
      let label = s.target;
      if (label.length > 24) label = label.slice(0, 22) + '..';
      drawText(ctx, `${i + 1}. ${label}`, 36, y, { color: C.white });
      drawText(ctx, String(showWpm(s.net)), 420, y, { color: C.white, align: 'right' });
      drawText(ctx, `${showAcc(s.acc)}%`, 560, y, { color: C.white, align: 'right' });
    });

    // round totals vs goal
    const ty = 200 + this.sentences.length * 26;
    const mark = (ok) => (this.practice ? '' : ok ? ' ✓' : ' ✗');
    const goalW = this.practice ? '' : `  (goal ${this.goal.wpm})`;
    const goalA = this.practice ? '' : `  (goal ${this.goal.acc}%)`;
    drawText(ctx, `Speed     ${showWpm(r.net)} WPM${goalW}${mark(this.speedOk)}`, 36, ty, {
      color: this.practice || this.speedOk ? C.green : C.red,
    });
    drawText(ctx, `Accuracy  ${showAcc(r.acc)}%${goalA}${mark(this.accOk)}`, 36, ty + 28, {
      color: this.practice || this.accOk ? C.green : C.red,
    });
    drawText(ctx, `Raw speed ${showWpm(r.gross)} WPM before errors`, 36, ty + 56, { color: C.gray });

    const bests = [];
    if (this.beat.net) bests.push('speed');
    if (this.beat.acc) bests.push('accuracy');
    if (this.beat.sentenceNet && !this.beat.net) bests.push('single letter');
    if (bests.length && Math.floor(this.t / 15) % 2 === 0) {
      drawText(ctx, `NEW BEST ${bests.join(' + ').toUpperCase()}!`, W / 2, ty + 84, { color: C.yellow, align: 'center' });
    }

    if (this.t > 30) drawText(ctx, 'Z / ENTER: continue', W / 2, 450, { color: C.dim, align: 'center' });
  }
}
