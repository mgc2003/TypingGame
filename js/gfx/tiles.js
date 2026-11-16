// Procedurally painted 16x16 map tiles, cached per variant.
export const TILE = 16;

const PAL = {
  grass: '#3d6b45', grassDark: '#335c3b', grassLight: '#4f8452', tuft: '#6aa05e',
  path: '#a8845a', pathDark: '#8e6c46', pathLight: '#bc9a6c',
  leaf: '#1f4a2e', leafDark: '#122a1c', leafMid: '#2f6b3c', leafLight: '#4a8a4c',
  water: '#2b4f8c', wave: '#4a78c0', sparkle: '#9ac0f0',
  wall: '#d8c4a0', wallLine: '#b89c74', roof: '#9a3c4c', roofDark: '#7a2a3a', roofLight: '#b85868',
  wood: '#8a5a30', woodLight: '#a8743e', woodDark: '#5a3a20',
  rock: '#8a8a94', rockDark: '#4a4a54', rockLight: '#b0b0ba',
};

function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

function px(g, x, y, col, w = 1, h = 1) {
  g.fillStyle = col;
  g.fillRect(x, y, w, h);
}

function paintGrass(g, seed) {
  px(g, 0, 0, PAL.grass, 16, 16);
  const r = rng(seed + 11);
  for (let i = 0; i < 7; i++) px(g, (r() * 16) | 0, (r() * 16) | 0, PAL.grassLight);
  for (let i = 0; i < 4; i++) px(g, (r() * 16) | 0, (r() * 16) | 0, PAL.grassDark);
}

function paintTuft(g, seed) {
  paintGrass(g, seed);
  const r = rng(seed + 3);
  for (let i = 0; i < 2; i++) {
    const x = 2 + ((r() * 10) | 0);
    const y = 4 + ((r() * 8) | 0);
    px(g, x, y, PAL.tuft);
    px(g, x + 2, y, PAL.tuft);
    px(g, x + 1, y + 1, PAL.tuft);
  }
}

function paintPath(g, seed) {
  px(g, 0, 0, PAL.path, 16, 16);
  const r = rng(seed + 7);
  for (let i = 0; i < 8; i++) px(g, (r() * 16) | 0, (r() * 16) | 0, PAL.pathDark);
  for (let i = 0; i < 5; i++) px(g, (r() * 16) | 0, (r() * 16) | 0, PAL.pathLight);
}

function paintTree(g, seed) {
  paintGrass(g, seed);
  // round canopy
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 7.6) px(g, x, y, dist > 6.6 ? PAL.leafDark : PAL.leaf);
    }
  }
  const r = rng(seed + 5);
  for (let i = 0; i < 5; i++) {
    const x = 3 + ((r() * 7) | 0);
    const y = 3 + ((r() * 6) | 0);
    px(g, x, y, PAL.leafMid, 2, 2);
  }
  px(g, 4, 4, PAL.leafLight, 2, 1);
  px(g, 4, 5, PAL.leafLight, 1, 1);
}

function paintWater(g, frame, seed) {
  px(g, 0, 0, PAL.water, 16, 16);
  for (const y of [3, 8, 13]) {
    const x = (frame * 4 + y * 3 + seed * 5) % 16;
    px(g, x, y, PAL.wave, 4, 1);
    px(g, (x + 9) % 16, y + 1, PAL.wave, 2, 1);
  }
  if ((seed + frame) % 3 === 0) px(g, (seed * 7 + frame * 3) % 14 + 1, (seed * 3) % 14 + 1, PAL.sparkle);
}

function paintWall(g) {
  px(g, 0, 0, PAL.wall, 16, 16);
  for (let y = 3; y < 16; y += 4) px(g, 0, y, PAL.wallLine, 16, 1);
  px(g, 0, 15, PAL.woodDark, 16, 1);
}

function paintRoof(g, y) {
  px(g, 0, 0, PAL.roof, 16, 16);
  for (let r = 0; r < 4; r++) {
    px(g, 0, r * 4 + 3, PAL.roofDark, 16, 1);
    const off = r % 2 ? 0 : 4;
    for (let x = off; x < 16; x += 8) px(g, x, r * 4, PAL.roofDark, 1, 3);
  }
  if (y === 0) px(g, 0, 0, PAL.roofLight, 16, 1);
}

function paintDoor(g) {
  paintWall(g);
  px(g, 4, 2, PAL.woodDark, 8, 14);
  px(g, 5, 3, '#5a3424', 6, 13);
  px(g, 9, 9, '#e8c84a');
}

function paintFlowers(g, seed) {
  paintGrass(g, seed);
  const r = rng(seed + 19);
  const cols = ['#f08ab0', '#f4ecdc', '#c8a0f0', '#ffd25a'];
  for (let i = 0; i < 3; i++) {
    const x = 2 + ((r() * 11) | 0);
    const y = 2 + ((r() * 11) | 0);
    const c = cols[(r() * cols.length) | 0];
    px(g, x, y - 1, c);
    px(g, x - 1, y, c);
    px(g, x + 1, y, c);
    px(g, x, y + 1, c);
    px(g, x, y, '#ffd25a');
  }
}

function paintRock(g, seed) {
  paintGrass(g, seed);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = (x - 7.5) / 6.5;
      const dy = (y - 9) / 5;
      const d = dx * dx + dy * dy;
      if (d < 1) px(g, x, y, d > 0.7 ? PAL.rockDark : PAL.rock);
    }
  }
  px(g, 5, 6, PAL.rockLight, 3, 1);
  px(g, 4, 7, PAL.rockLight, 1, 2);
}

function paintGate(g, seed) {
  paintPath(g, seed);
  px(g, 1, 1, PAL.woodDark, 3, 15);
  px(g, 12, 1, PAL.woodDark, 3, 15);
  for (const y of [3, 9]) {
    px(g, 0, y, PAL.wood, 16, 3);
    px(g, 0, y, PAL.woodLight, 16, 1);
    px(g, 0, y + 2, PAL.woodDark, 16, 1);
  }
}

function paintBridge(g, frame, seed, broken, railTop, railBottom) {
  paintWater(g, frame, seed);
  if (broken) {
    px(g, 0, 4, PAL.wood, 3, 8);
    px(g, 13, 6, PAL.wood, 3, 6);
    px(g, 7, 9, PAL.woodDark, 3, 2);
    return;
  }
  for (let x = 0; x < 16; x += 4) {
    px(g, x, 0, PAL.wood, 3, 16);
    px(g, x, 0, PAL.woodLight, 1, 16);
    px(g, x + 3, 0, PAL.woodDark, 1, 16);
  }
  if (railTop) px(g, 0, 0, PAL.woodDark, 16, 2);
  if (railBottom) px(g, 0, 14, PAL.woodDark, 16, 2);
}

function paintSign(g, seed) {
  paintGrass(g, seed);
  px(g, 7, 9, PAL.woodDark, 2, 7);
  px(g, 2, 2, PAL.woodDark, 12, 8);
  px(g, 3, 3, PAL.woodLight, 10, 6);
  px(g, 4, 4, PAL.woodDark, 8, 1);
  px(g, 4, 6, PAL.woodDark, 6, 1);
}

const cache = new Map();

/**
 * Get a tile canvas. kind is a semantic tile name; variant picks a seed / shape; frame animates water.
 */
export function tileCanvas(kind, variant = 0, frame = 0) {
  const animated = kind === 'water' || kind.startsWith('bridge');
  const key = `${kind}:${variant}:${animated ? frame : 0}`;
  let c = cache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext('2d');
  const seed = variant;
  switch (kind) {
    case 'grass': paintGrass(g, seed); break;
    case 'tuft': paintTuft(g, seed); break;
    case 'path': paintPath(g, seed); break;
    case 'tree': paintTree(g, seed); break;
    case 'water': paintWater(g, frame, seed); break;
    case 'wall': paintWall(g); break;
    case 'roof': paintRoof(g, variant); break;
    case 'door': paintDoor(g); break;
    case 'flowers': paintFlowers(g, seed); break;
    case 'rock': paintRock(g, seed); break;
    case 'gate': paintGate(g, seed); break;
    case 'bridgeBroken': paintBridge(g, frame, seed, true, false, false); break;
    case 'bridgeTop': paintBridge(g, frame, seed, false, true, false); break;
    case 'bridgeBottom': paintBridge(g, frame, seed, false, false, true); break;
    case 'sign': paintSign(g, seed); break;
    default: px(g, 0, 0, '#f0f', 16, 16);
  }
  cache.set(key, c);
  return c;
}
