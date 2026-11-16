import { drawText } from '../gfx/font.js';
import { drawSprite } from '../gfx/sprites.js';
import { tileCanvas, TILE } from '../gfx/tiles.js';
import { C, W, H, box } from '../gfx/ui.js';
import { input } from '../input.js';
import { sfx } from '../audio/sfx.js';
import { save, persist } from '../core/storage.js';
import { buildMap, isSolid, tileFor, MAP_W, MAP_H, SPAWN, TILE_TEXT } from '../world/map.js';
import { NPCS, npcById, goalFor, fmt } from '../world/npcs.js';
import { DialogueScene, speakerOf } from './dialogue.js';
import { ChallengeScene } from './challenge.js';
import { PauseScene } from './pause.js';
import { EndingScene } from './ending.js';

const SCALE = 2; // world pixels -> screen pixels
const VIEW_W = W / SCALE;
const SPEED = 1.35;
// player collision box, relative to sprite top-left (covers the feet)
const HB = { x: 3, y: 10, w: 10, h: 6 };

const UNLOCK_TEXT = {
  postmaster: ['(Somewhere to the east, a heavy log fence creaks open.)'],
  ghost: ['(From the river comes a chorus of croaking and hammering. The old bridge is mended!)'],
};

export class OverworldScene {
  constructor(game) {
    this.game = game;
    this.grid = buildMap();
    this.player = {
      x: SPAWN.tx * TILE,
      y: SPAWN.ty * TILE - 4,
      dir: 'down',
      moving: false,
      anim: 0,
    };
    this.camX = 0;
    this.t = 0;
    this.shake = 0;
    this.introTimer = 0;
    this.stepTimer = 0;
  }

  get flags() {
    return save.flags;
  }

  // ---------- helpers ----------

  vars(npc) {
    const goal = npc ? goalFor(npc, save.settings.difficulty) : { wpm: 0, acc: 0 };
    return { name: save.playerName || 'Courier', wpm: goal.wpm, acc: goal.acc };
  }

  say(npc, lines, opts = {}) {
    const v = this.vars(npc);
    const sp = speakerOf(npc);
    const pages = lines.map((text) => ({ text: fmt(text, v), speaker: sp }));
    this.game.push(new DialogueScene(this.game, pages, { ...opts, prompt: opts.prompt ? fmt(opts.prompt, v) : null }));
  }

  narrate(lines, onDone) {
    this.game.push(new DialogueScene(this.game, lines.map((text) => ({ text })), { onDone }));
  }

  npcAtTile(tx, ty) {
    return NPCS.find((n) => n.tx === tx && n.ty === ty) || null;
  }

  solidAt(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
    if (isSolid(this.grid[ty][tx], this.flags)) return true;
    return !!this.npcAtTile(tx, ty);
  }

  boxBlocked(x, y) {
    const l = x + HB.x;
    const r = x + HB.x + HB.w - 1;
    const t = y + HB.y;
    const b = y + HB.y + HB.h - 1;
    return this.solidAt(l, t) || this.solidAt(r, t) || this.solidAt(l, b) || this.solidAt(r, b);
  }

  isAvailable(npc) {
    return !npc.requires || !!this.flags[npc.requires];
  }

  /** The villager the player should visit next (gets a floating envelope marker). */
  nextNpc() {
    return NPCS.find((n) => !this.flags[n.id] && this.isAvailable(n)) || null;
  }

  // ---------- interaction ----------

  interact() {
    const p = this.player;
    const cx = p.x + HB.x + HB.w / 2;
    const cy = p.y + HB.y + HB.h / 2;
    const reach = 11;
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir];
    // probe straight ahead, then a little closer (helps when standing right against something)
    for (const dist of [reach, 6]) {
      const tx = Math.floor((cx + d[0] * dist) / TILE);
      const ty = Math.floor((cy + d[1] * dist) / TILE);
      const npc = this.npcAtTile(tx, ty);
      if (npc) return this.talkTo(npc);
      const ch = this.grid[ty]?.[tx];
      const text = TILE_TEXT[`${tx},${ty}`] || (ch === 'G' && !this.flags.postmaster && TILE_TEXT.G)
        || (ch === 'B' && !this.flags.ghost && TILE_TEXT.B) || (ch === 'D' && TILE_TEXT.D);
      if (text) {
        sfx.confirm();
        return this.narrate(text);
      }
    }
  }

  talkTo(npc) {
    const L = npc.lines;
    if (!save.introSeen) return this.playIntro();
    if (!this.isAvailable(npc)) return this.say(npc, L.locked);
    const befriended = !!this.flags[npc.id];
    if (befriended) {
      return this.say(npc, L.after, {
        choices: ['Practice', 'Bye'],
        onDone: (c) => c === 0 && this.startChallenge(npc, true),
      });
    }
    this.say(npc, L.pre, {
      choices: ['Retype letters', 'Not yet'],
      prompt: L.prompt,
      onDone: (c) => c === 0 && this.startChallenge(npc, false),
    });
  }

  startChallenge(npc, practice) {
    const goal = goalFor(npc, save.settings.difficulty);
    this.game.transition(() => {
      this.game.push(new ChallengeScene(this.game, npc, goal, practice, (outcome) => this.onChallengeDone(npc, practice, outcome)));
    }, 20);
  }

  /** outcome: null if the player left early, otherwise { passed } */
  onChallengeDone(npc, practice, outcome) {
    if (!outcome) {
      this.narrate(['(You tuck the soggy letters back into your mailbag for later.)']);
      return;
    }
    if (practice) {
      this.say(npc, npc.lines.practiced);
      return;
    }
    if (!outcome.passed) {
      this.say(npc, npc.lines.fail);
      return;
    }
    this.flags[npc.id] = true;
    persist();
    sfx.befriend();
    this.say(npc, npc.lines.befriend, {
      onDone: () => {
        if (npc.id === 'sage') {
          save.complete = true;
          persist();
          this.game.transition(() => this.game.push(new EndingScene(this.game)), 40);
          return;
        }
        const unlock = UNLOCK_TEXT[npc.id];
        if (unlock) {
          this.shake = 30;
          sfx.gate();
          this.narrate(unlock);
        }
      },
    });
  }

  playIntro() {
    const pm = npcById.postmaster;
    this.say(pm, pm.intro, {
      onDone: () => {
        save.introSeen = true;
        persist();
      },
    });
  }

  // ---------- update ----------

  update() {
    this.t++;
    if (this.shake > 0) this.shake--;

    if (!save.introSeen) {
      this.introTimer++;
      if (this.introTimer === 40) this.playIntro();
      return;
    }

    if (input.pressed('pause')) {
      this.game.push(new PauseScene(this.game));
      return;
    }
    if (input.pressed('confirm')) {
      this.interact();
      return;
    }

    const p = this.player;
    let dx = 0;
    let dy = 0;
    if (input.held('left')) dx -= 1;
    if (input.held('right')) dx += 1;
    if (input.held('up')) dy -= 1;
    if (input.held('down')) dy += 1;
    p.moving = dx !== 0 || dy !== 0;
    if (p.moving) {
      if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }
      if (dy < 0) p.dir = 'up';
      else if (dy > 0) p.dir = 'down';
      if (dx < 0 && !dy) p.dir = 'left';
      else if (dx > 0 && !dy) p.dir = 'right';
      const nx = p.x + dx * SPEED;
      if (!this.boxBlocked(nx, p.y)) p.x = nx;
      const ny = p.y + dy * SPEED;
      if (!this.boxBlocked(p.x, ny)) p.y = ny;
      p.anim++;
      if (++this.stepTimer % 18 === 0) sfx.step();
    } else {
      p.anim = 0;
    }

    const target = p.x + 8 - VIEW_W / 2;
    this.camX = Math.max(0, Math.min(MAP_W * TILE - VIEW_W, target));
  }

  // ---------- render ----------

  render(ctx) {
    const shakeX = this.shake ? ((this.shake % 4) - 1.5) * 2 : 0;
    const cam = Math.round(this.camX);
    const water = Math.floor(this.t / 30) % 2;
    ctx.save();
    ctx.translate(shakeX, 0);
    ctx.scale(SCALE, SCALE);
    ctx.translate(-cam, 0);

    const x0 = Math.max(0, Math.floor(cam / TILE));
    const x1 = Math.min(MAP_W - 1, Math.ceil((cam + VIEW_W) / TILE));
    for (let y = 0; y < MAP_H; y++) {
      for (let x = x0; x <= x1; x++) {
        const [kind, variant] = tileFor(this.grid, x, y, this.flags);
        ctx.drawImage(tileCanvas(kind, variant, water), x * TILE, y * TILE);
      }
    }

    // entities sorted by feet position
    const ents = NPCS.map((n) => ({ kind: 'npc', npc: n, y: n.ty * TILE + 16 }));
    ents.push({ kind: 'player', y: this.player.y + 16 });
    ents.sort((a, b) => a.y - b.y);
    const next = this.nextNpc();
    for (const e of ents) {
      if (e.kind === 'player') this.drawPlayer(ctx);
      else this.drawNpc(ctx, e.npc, e.npc === next);
    }
    ctx.restore();

    this.drawHud(ctx);
  }

  drawPlayer(ctx) {
    const p = this.player;
    const step = p.moving ? [0, 1, 0, 2][Math.floor(p.anim / 8) % 4] : 0;
    const base = p.dir === 'left' || p.dir === 'right' ? 'side' : p.dir;
    drawSprite(ctx, 'fox', base + step, p.x, p.y, 1, p.dir === 'left');
  }

  drawNpc(ctx, npc, marked) {
    const x = npc.tx * TILE;
    let y = npc.ty * TILE;
    if (npc.sprite === 'ghost') y += Math.round(Math.sin(this.t / 20) * 1.5) - 2;
    // soft glow under the lantern ghost
    if (npc.sprite === 'ghost') {
      ctx.fillStyle = 'rgba(255,210,90,0.12)';
      ctx.beginPath();
      ctx.arc(x + 13, y + 11, 9 + Math.sin(this.t / 10), 0, Math.PI * 2);
      ctx.fill();
    }
    drawSprite(ctx, npc.sprite, 'idle', x, y);
    if (this.flags[npc.id]) {
      drawSprite(ctx, 'heart', 'idle', x + 5, y - 9 + Math.round(Math.sin(this.t / 25)));
    } else if (marked && save.introSeen) {
      drawSprite(ctx, 'envelope', 'idle', x + 3, y - 12 + Math.round(Math.sin(this.t / 10) * 1.5));
    }
  }

  drawHud(ctx) {
    const friends = NPCS.filter((n) => this.flags[n.id]).length;
    const label = `${save.playerName || 'Courier'}`;
    const right = `♥ ${friends}/${NPCS.length}`;
    const w = Math.max(160, (label.length + right.length + 3) * 12 + 24);
    box(ctx, 8, 8, w, 36, { bw: 3 });
    drawText(ctx, label, 20, 18, { color: C.white });
    drawText(ctx, right, 8 + w - 14, 18, { color: C.yellow, align: 'right' });
    if (!save.introSeen) return;
    const next = this.nextNpc();
    if (next) {
      const goal = goalFor(next, save.settings.difficulty);
      const txt = `Next: ${next.name}  ${goal.wpm} WPM / ${goal.acc}%`;
      drawText(ctx, txt, W - 12, H - 24, { color: C.white, align: 'right', shadow: '#000' });
    }
  }
}
