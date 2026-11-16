// Character sprites drawn as pixel strings. Each char maps to a palette colour; "." is transparent.

const OUT = '#120c0a';

export const SPRITES = {
  // The courier: a little owl with a satchel. Frame 0 = wings folded, 1 = wings raised.
  owl: {
    palette: { o: OUT, B: '#7e5a38', b: '#573c24', w: '#9a7a54', c: '#cdb894', e: '#d9a845', k: '#0c0806', y: '#b8903c', s: '#5a3420' },
    frames: {
      down0: [
        '................',
        '...o........o...',
        '...oo......oo...',
        '...oBooooooBo...',
        '..oBBBBBBBBBBo..',
        '..oBeeeBBeeeBo..',
        '..oBekeBBekeBo..',
        '..oBeeeyyeeeBo..',
        '..obBBByyBBBbo..',
        '.obbBcccccccBbo.',
        '.obbcwcwcwcwcbbo',
        '.obbccccccccsbbo',
        '..obbcwcwcssbo..',
        '...obbcccssbo...',
        '....ooyooyoo....',
        '................',
      ],
      down1: [
        '................',
        '...o........o...',
        '...oo......oo...',
        'o..oBooooooBo..o',
        'bboBBBBBBBBBBobb',
        'bboBeeeBBeeeBobb',
        '.boBekeBBekeBob.',
        '..oBeeeyyeeeBo..',
        '..obBBByyBBBbo..',
        '...oBcccccccBo..',
        '...ocwcwcwcwco..',
        '...occccccsbo...',
        '....ocwcwssbo...',
        '....obcccsbo....',
        '....ooyooyoo....',
        '................',
      ],
      up0: [
        '................',
        '...o........o...',
        '...oo......oo...',
        '...oBooooooBo...',
        '..oBBBBBBBBBBo..',
        '..oBBwBBBBwBBo..',
        '..oBBBBBBBBBBo..',
        '..oBBBwBBwBBBo..',
        '..obBBBBBBBBbo..',
        '.obbBsBBBBsBbbo.',
        '.obbBBssssBBbbo.',
        '.obbBBssssBBbbo.',
        '..obbBBBBBBbbo..',
        '...obbBBBBbbo...',
        '....oowwwwoo....',
        '................',
      ],
      up1: [
        '................',
        '...o........o...',
        '...oo......oo...',
        'o..oBooooooBo..o',
        'bboBBBBBBBBBBobb',
        'bboBBwBBBBwBBobb',
        '.boBBBBBBBBBBob.',
        '..oBBBwBBwBBBo..',
        '..obBBBBBBBBbo..',
        '...oBsBBBBsBo...',
        '...oBBssssBBo...',
        '...oBBssssBBo...',
        '....oBBBBBBo....',
        '....oBBBBBBo....',
        '....oowwwwoo....',
        '................',
      ],
      side0: [
        '................',
        '.....o.....o....',
        '.....oo...oo....',
        '.....oBoooBo....',
        '....oBBBBBBBo...',
        '....oBBBBeeeBo..',
        '....oBBBBekeBo..',
        '....oBBBBeeeyo..',
        '....obBBBBBByo..',
        '...obbbBBcccco..',
        '..obbwbbBccccco.',
        '..obbbwbbsccsco.',
        '...obbbbsssco...',
        '....obbbbbco....',
        '.....ooyooyo....',
        '................',
      ],
      side1: [
        '................',
        '.....o.....o....',
        '..o..oo...oo....',
        '..bo.oBoooBo....',
        '..bboBBBBBBBo...',
        '..bboBBBBeeeBo..',
        '...boBBBBekeBo..',
        '....oBBBBeeeyo..',
        '....obBBBBBByo..',
        '...ooBBBBcccco..',
        '....oBBBBccccco.',
        '....oBBBsccsco..',
        '...obbbbsssco...',
        '....obbbbbco....',
        '.....ooyooyo....',
        '................',
      ],
    },
  },
  mushroom: {
    palette: { o: OUT, r: '#8e2a36', R: '#5e1824', w: '#d8cbb0', c: '#d4c4a0', C: '#a8946e', k: '#0c0806', p: '#c8707c' },
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
    palette: { o: OUT, B: '#2c3c6a', b: '#1c2646', l: '#4e6494', f: '#8e2a36', k: '#0c0806', w: '#ddd0b4', g: '#4a3426' },
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
    palette: { o: '#1e1626', g: '#d6d0c4', G: '#9a92a6', k: '#0c0806', p: '#b88a94', y: '#f0c860', Y: '#c8742a', m: '#4a4650' },
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
    palette: { o: OUT, S: '#2a3e2a', h: '#5a7a4a', t: '#a8986a', T: '#7a6c48', w: '#ddd0b4', k: '#0c0806', s: '#3a5a3a' },
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
    palette: { r: '#c4283e', h: '#e07080' },
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
    palette: { o: '#2a1e16', w: '#ddd0b4', s: '#a8987a', r: '#8e2a36' },
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
