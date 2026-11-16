import { input } from './input.js';
import { sfx } from './audio/sfx.js';
import { SceneManager } from './scenes/manager.js';
import { TitleScene } from './scenes/title.js';
import { W, H } from './gfx/ui.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Scale the 640x480 canvas to fit the window, using whole-number zoom when there's room.
function fit() {
  const sw = window.innerWidth;
  const sh = window.innerHeight;
  let s = Math.min(sw / W, sh / H);
  if (s >= 1) s = Math.floor(s * 2) / 2 || 1; // half-steps keep pixels mostly even
  canvas.style.width = `${Math.floor(W * s)}px`;
  canvas.style.height = `${Math.floor(H * s)}px`;
}
window.addEventListener('resize', fit);
fit();
canvas.focus();

// Audio may only start after a user gesture.
input.onAnyKey(() => sfx.unlock());
window.addEventListener('pointerdown', () => {
  sfx.unlock();
  canvas.focus();
});

const game = new SceneManager(ctx);
game.push(new TitleScene(game));

const STEP = 1000 / 60;
let last = performance.now();
let acc = 0;

function frame(now) {
  acc += Math.min(250, now - last);
  last = now;
  while (acc >= STEP) {
    input.beginFrame();
    game.update();
    acc -= STEP;
  }
  game.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Handy for automated checks / debugging in the console.
window.__game = game;
