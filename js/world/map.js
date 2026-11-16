// The village map. Built in code (rather than hand-typed strings) so it's easy to tweak.
//  .  grass       ,  grass tuft   =  path      T  tree       ~  water
//  R  roof        #  wall         D  door      f  flowers    o  rock
//  S  sign        G  log gate (opens when the Postmaster is befriended)
//  B  bridge (repaired when the ghost is befriended)

export const MAP_W = 40;
export const MAP_H = 15;
export const SPAWN = { tx: 4, ty: 7 };

const ALWAYS_SOLID = new Set(['T', '~', 'R', '#', 'D', 'o', 'S']);

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) >>> 0;
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  return h;
}

export function buildMap() {
  const g = Array.from({ length: MAP_H }, () => Array(MAP_W).fill('.'));
  const set = (x, y, c) => {
    if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) g[y][x] = c;
  };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c);
  };

  // scattered grass tufts
  for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) if (hash(x, y) % 6 === 0) g[y][x] = ',';

  // forest border
  rect(0, 0, MAP_W - 1, 1, 'T');
  rect(0, MAP_H - 2, MAP_W - 1, MAP_H - 1, 'T');
  rect(0, 0, 0, MAP_H - 1, 'T');
  rect(MAP_W - 1, 0, MAP_W - 1, MAP_H - 1, 'T');
  // ragged edges
  for (const [x, y] of [[1, 2], [9, 2], [10, 2], [15, 2], [1, 12], [2, 12], [8, 12], [13, 12], [14, 12],
    [17, 2], [26, 2], [27, 2], [17, 12], [18, 12], [26, 12], [30, 2], [31, 2], [38, 2], [30, 12], [37, 12], [38, 12]]) {
    set(x, y, 'T');
  }

  // main road
  rect(1, 7, MAP_W - 2, 8, '=');

  // --- Section A: post office & mushroom grove ---
  rect(2, 2, 6, 3, 'R');
  rect(2, 4, 6, 5, '#');
  set(4, 5, 'D');
  set(4, 6, '=');
  set(8, 6, 'S');
  for (const [x, y] of [[10, 4], [11, 3], [13, 3], [14, 4], [11, 5], [13, 5], [3, 10], [5, 11], [10, 10], [11, 11]]) set(x, y, 'f');
  for (const [x, y] of [[6, 10], [7, 10], [7, 11], [12, 10]]) set(x, y, 'T');
  set(15, 6, 'S');

  // --- the log gate ---
  rect(16, 2, 16, 12, 'T');
  set(16, 7, 'G');
  set(16, 8, 'G');

  // --- Section B: the pond ---
  rect(20, 10, 23, 11, '~');
  set(19, 11, '~');
  set(19, 3, 'o');
  set(25, 11, 'o');
  set(21, 4, 'o');
  for (const [x, y] of [[18, 4], [24, 3], [25, 5], [19, 9], [24, 9], [22, 12]]) set(x, y, 'f');
  for (const [x, y] of [[26, 4], [26, 10]]) set(x, y, 'T');

  // --- the river & bridge ---
  rect(28, 0, 29, MAP_H - 1, '~');
  rect(28, 7, 29, 8, 'B');

  // --- Section C: the sage's grove ---
  rect(34, 2, 37, 3, 'T');
  set(33, 3, 'T');
  for (const [x, y] of [[32, 5], [33, 5], [37, 5], [38, 6], [32, 10], [34, 11], [36, 10], [37, 11], [31, 4]]) set(x, y, 'f');
  set(31, 10, 'o');
  set(36, 11, 'T');

  return g;
}

export function isSolid(ch, flags) {
  if (ch === 'G') return !flags.postmaster;
  if (ch === 'B') return !flags.ghost;
  return ALWAYS_SOLID.has(ch);
}

/** Which painted tile to use for map cell (x, y). */
export function tileFor(grid, x, y, flags) {
  const ch = grid[y][x];
  const v = hash(x, y) % 4;
  switch (ch) {
    case ',': return ['tuft', v];
    case '=': return ['path', v];
    case 'T': return ['tree', v];
    case '~': return ['water', v];
    case 'R': return ['roof', y === 2 ? 0 : 1];
    case '#': return ['wall', 0];
    case 'D': return ['door', 0];
    case 'f': return ['flowers', hash(x, y) % 8];
    case 'o': return ['rock', v];
    case 'S': return ['sign', v];
    case 'G': return flags.postmaster ? ['path', v] : ['gate', v];
    case 'B': {
      if (!flags.ghost) return ['bridgeBroken', v];
      return grid[y - 1]?.[x] === 'B' ? ['bridgeBottom', v] : ['bridgeTop', v];
    }
    default: return ['grass', v];
  }
}

/** Flavour text for interactable tiles (signs, gate, bridge, door). Keyed by "x,y" or tile char. */
export const TILE_TEXT = {
  '8,6': ['(POST OFFICE. Letters in, letters out. Please wipe your talons.)'],
  '15,6': ['(EAST ROAD. Pond, river, and the Sage\'s grove beyond.)', '(Someone has scribbled underneath: "Mind the log fence.")'],
  D: ['(The post office door is shut tight. A note says: CLOSED FOR STORM CLEANUP.)'],
  G: ['(A heavy log fence blocks the east road. A tag on it reads: PROPERTY OF THE POSTMASTER.)'],
  B: ['(The storm swept the bridge planks away. The river is much too wide to jump.)'],
};
