import { input } from '../input.js';
import { W, H, C } from '../gfx/ui.js';

/**
 * Scene stack. Only the top scene updates; rendering starts from the highest opaque scene so
 * overlays (dialogue, pause menu) draw on top of the world beneath them.
 * Scene interface: { opaque?: boolean, enter?(), exit?(), resume?(), update(), render(ctx) }
 */
export class SceneManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.stack = [];
    this.fade = null;
    this.frame = 0;
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  push(scene) {
    this.stack.push(scene);
    scene.enter?.();
  }

  pop() {
    const s = this.stack.pop();
    s?.exit?.();
    this.top?.resume?.();
    return s;
  }

  /** Replace the top scene. */
  swap(scene) {
    const s = this.stack.pop();
    s?.exit?.();
    this.push(scene);
  }

  /** Clear the whole stack and start fresh. */
  reset(scene) {
    while (this.stack.length) this.stack.pop().exit?.();
    this.push(scene);
  }

  /** Fade to black, run fn (which usually changes scenes), fade back in. */
  transition(fn, frames = 14) {
    if (this.fade) return;
    this.fade = { t: 0, frames, fn, phase: 'out' };
  }

  get busy() {
    return !!this.fade;
  }

  update() {
    this.frame++;
    if (this.fade) {
      const f = this.fade;
      if (f.phase === 'out') {
        f.t++;
        if (f.t >= f.frames) {
          f.fn();
          input.flush();
          f.phase = 'in';
        }
      } else {
        f.t--;
        if (f.t <= 0) this.fade = null;
      }
      return;
    }
    this.top?.update();
  }

  render() {
    const ctx = this.ctx;
    ctx.fillStyle = C.black;
    ctx.fillRect(0, 0, W, H);
    let start = this.stack.length - 1;
    while (start > 0 && this.stack[start].opaque === false) start--;
    for (let i = Math.max(0, start); i < this.stack.length; i++) this.stack[i].render(ctx);
    if (this.fade) {
      ctx.fillStyle = `rgba(11,9,7,${Math.min(1, this.fade.t / this.fade.frames)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}
