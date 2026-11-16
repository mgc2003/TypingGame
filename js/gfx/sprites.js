// Character sprites drawn as pixel strings. Each char maps to a palette colour; "." is transparent.

const OUT = '#1a1020';

export const SPRITES = {
  fox: {
    palette: { o: OUT, O: '#e8782a', d: '#b85418', w: '#f4ecdc', k: '#100810', b: '#7a4a2a', s: '#5a3018' },
    frames: {
      down0: [
        '................',
        '...o........o...',
        '..oOo......oOo..',
        '..oOOo....oOOo..',
        '..oOOOooooOOOo..',
        '..oOOOOOOOOOOo..',
        '.oOOOkOOOOkOOOo.',
        '.oOwwwwkkwwwwOo.',
        '..owwwwwwwwwwo..',
        '...oowwwwwwoo...',
        '...osOOOOOOso...',
        '..oOOsOwwOsbbo..',
        '..oOOOswwsbbbo..',
        '...oOOOOOObbo...',
        '...oOdo..odOo...',
        '....oo....oo....',
      ],
      up0: [
        '................',
        '...o........o...',
        '..oOo......oOo..',
        '..oOOo....oOOo..',
        '..oOOOooooOOOo..',
        '..oOOOOOOOOOOo..',
        '.oOOOOOOOOOOOOo.',
        '.oOOOOOOOOOOOOo.',
        '..oOOOOOOOOOOo..',
        '...ooOOOOOOoo...',
        '...obbbbbbbbo...',
        '..oObbbbbbbbOo..',
        '..oObbsbbsbbOo..',
        '...oOObbbbOOo...',
        '...oOdo..odOo...',
        '....oo....oo....',
      ],
      side0: [
        '................',
        '......o.........',
        '.....oOo.o......',
        '.....oOOoOo.....',
        '....oOOOOOOo....',
        '....oOOOOkOOo...',
        '....oOOOOOOwwo..',
        '....oOOOOwwwwko.',
        '.....oOOwwwwoo..',
        '......oooooo....',
        '..oo..osOOOo....',
        '.oOwo.obsOOOo...',
        '.oOOoobbbsOOo...',
        '..oOOobbbbOo....',
        '......oOdo.oOo..',
        '.......oo...oo..',
      ],
    },
  },
  mushroom: {
    palette: { o: OUT, r: '#c8344a', R: '#8a1e34', w: '#f4ecdc', c: '#eadbb8', C: '#c4b08a', k: '#100810', p: '#f08a9a' },
    frames: {
      idle: [
        '................',
        '.....oooooo.....',
        '...oorrwwrrroo..',
        '..orrrwwrrrwwro.',
        '.orwwrrrrrrwwrro',
        '.orwwrrrwwrrrrro',
        '.oRRrrrrrrrrRRo.',
        '..ooRRRRRRRRoo..',
        '....occccccco...',
        '....ockccckco...',
        '....opcccccpo...',
        '....occckccco...',
        '...oCcccccccCo..',
        '...oCCccccccCo..',
        '....oCCCCCCCo...',
        '.....ooooooo....',
      ],
    },
  },
  postmaster: {
    palette: { o: OUT, B: '#3a5cc8', b: '#26388a', l: '#7aa0f0', f: '#d8404a', k: '#100810', w: '#f4ecdc', g: '#6a4a3a' },
    frames: {
      idle: [
        '................',
        '....oooooooo....',
        '...oBBlllBBBo...',
        '..oBBlBBBBBBBo..',
        '..oBkkBBBBkkBoff',
        '..oBwkBBBBkwBoff',
        '..oBBBBBBBBBBo.o',
        '..oBBBkkkkBBBo.o',
        '..oBBkBBBBkBBo.o',
        '..oBBBBBBBBBBo.o',
        '..obbbbbbbbbbo.o',
        '..oooooooooooo.o',
        '......oggo......',
        '......oggo......',
        '......oggo......',
        '.....oooooo.....',
      ],
    },
  },
  ghost: {
    palette: { o: '#2a1a3a', g: '#e8e4f8', G: '#b0a8d8', k: '#100810', p: '#f0a0c0', y: '#ffd25a', Y: '#f08a2a', m: '#5a5a6a' },
    frames: {
      idle: [
        '......oooo......',
        '....oogggggo....',
        '...oggggggggo...',
        '..oggggggggggo..',
        '..oggkggggkggo..',
        '..oggkggggkggo..',
        '..ogpggkkggpgo..',
        '..oggggggggggo..',
        '..ogggggggggmo..',
        '..oggggggggmYmo.',
        '..oGgggggggmyym.',
        '..oGGggggggmYYm.',
        '..oGGGgggGGomm..',
        '..oGo.oGo.oGo...',
        '...o...o...o....',
        '................',
      ],
    },
  },
  sage: {
    palette: { o: OUT, S: '#2e5a34', h: '#7ab86a', t: '#c8b878', T: '#9a8a58', w: '#f4ecdc', k: '#100810', s: '#4a8a4a' },
    frames: {
      idle: [
        '................',
        '.....oooooo.....',
        '....otttttto....',
        '....otkttkto....',
        '....otwwwwto....',
        '...oowwwwwwoo...',
        '..oSSowwwwoSSo..',
        '.oShSSowwoSShSo.',
        '.oSShSSooSShSSo.',
        '.oShhhSSSShhhSo.',
        '.oSSShSSSShSSSo.',
        '.oShSSShhSSShSo.',
        '..oSSShSShSSSo..',
        '..ottoSSSSotto..',
        '..oTTo.oo.oTTo..',
        '...oo......oo...',
      ],
    },
  },
  heart: {
    palette: { r: '#ff2a4a', h: '#ff8a9a' },
    frames: {
      idle: [
        '.rr.rr.',
        'rhrrrrr',
        'rrrrrrr',
        '.rrrrr.',
        '..rrr..',
        '...r...',
      ],
    },
  },
  envelope: {
    palette: { o: '#2a2030', w: '#f4ecdc', s: '#c8b8a0', r: '#d8404a' },
    frames: {
      idle: [
        'oooooooooo',
        'oowwwwwwoo',
        'owowwwwowo',
        'owwowwowwo',
        'owwwrrwwwo',
        'owwwwwwwso',
        'oooooooooo',
      ],
    },
  },
};

// Walk-cycle frames are derived from the base frames by swapping the feet rows.
function withFeet(base, a, b) {
  const f = base.slice();
  f[14] = a;
  f[15] = b;
  return f;
}
{
  const fr = SPRITES.fox.frames;
  fr.down1 = withFeet(fr.down0, '...oOdo...oo....', '....oo..........');
  fr.down2 = withFeet(fr.down0, '....oo...odOo...', '..........oo....');
  fr.up1 = withFeet(fr.up0, '...oOdo...oo....', '....oo..........');
  fr.up2 = withFeet(fr.up0, '....oo...odOo...', '..........oo....');
  fr.side1 = withFeet(fr.side0, '.....oOdo..oOo..', '......oo....oo..');
  fr.side2 = withFeet(fr.side0, '......oOdo.oOo..', '.......oo..oo...');
}

const cache = new Map();

function build(name, frame) {
  const def = SPRITES[name];
  const rows = def.frames[frame];
  if (!rows) throw new Error(`missing sprite frame ${name}.${frame}`);
  const c = document.createElement('canvas');
  c.width = rows[0].length;
  c.height = rows.length;
  const g = c.getContext('2d');
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const col = def.palette[rows[y][x]];
      if (col) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
  }
  return c;
}

export function spriteCanvas(name, frame = 'idle') {
  const k = name + '.' + frame;
  let c = cache.get(k);
  if (!c) {
    c = build(name, frame);
    cache.set(k, c);
  }
  return c;
}

export function drawSprite(ctx, name, frame, x, y, scale = 1, flip = false) {
  const c = spriteCanvas(name, frame);
  const w = c.width * scale;
  const h = c.height * scale;
  if (flip) {
    ctx.save();
    ctx.translate(Math.round(x) + w, Math.round(y));
    ctx.scale(-1, 1);
    ctx.drawImage(c, 0, 0, w, h);
    ctx.restore();
  } else {
    ctx.drawImage(c, Math.round(x), Math.round(y), w, h);
  }
}
