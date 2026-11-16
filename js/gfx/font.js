// Code-drawn 5x8 bitmap font. Rows 0-6 hold capitals/body, row 7 is for descenders.
// Each glyph block starts with "@" + the character, followed by up to 8 rows of "." and "#".

export const GLYPH_W = 5;
export const GLYPH_H = 8;
export const ADVANCE = 6; // glyph width + 1px spacing (monospace)
export const LINE_H = 10;

const RAW = `
@A
.###.
#...#
#...#
#####
#...#
#...#
#...#
@B
####.
#...#
#...#
####.
#...#
#...#
####.
@C
.###.
#...#
#....
#....
#....
#...#
.###.
@D
####.
#...#
#...#
#...#
#...#
#...#
####.
@E
#####
#....
#....
####.
#....
#....
#####
@F
#####
#....
#....
####.
#....
#....
#....
@G
.###.
#...#
#....
#.###
#...#
#...#
.####
@H
#...#
#...#
#...#
#####
#...#
#...#
#...#
@I
.###.
..#..
..#..
..#..
..#..
..#..
.###.
@J
..###
...#.
...#.
...#.
...#.
#..#.
.##..
@K
#...#
#..#.
#.#..
##...
#.#..
#..#.
#...#
@L
#....
#....
#....
#....
#....
#....
#####
@M
#...#
##.##
#.#.#
#.#.#
#...#
#...#
#...#
@N
#...#
#...#
##..#
#.#.#
#..##
#...#
#...#
@O
.###.
#...#
#...#
#...#
#...#
#...#
.###.
@P
####.
#...#
#...#
####.
#....
#....
#....
@Q
.###.
#...#
#...#
#...#
#.#.#
#..#.
.##.#
@R
####.
#...#
#...#
####.
#.#..
#..#.
#...#
@S
.####
#....
#....
.###.
....#
....#
####.
@T
#####
..#..
..#..
..#..
..#..
..#..
..#..
@U
#...#
#...#
#...#
#...#
#...#
#...#
.###.
@V
#...#
#...#
#...#
#...#
#...#
.#.#.
..#..
@W
#...#
#...#
#...#
#.#.#
#.#.#
#.#.#
.#.#.
@X
#...#
#...#
.#.#.
..#..
.#.#.
#...#
#...#
@Y
#...#
#...#
.#.#.
..#..
..#..
..#..
..#..
@Z
#####
....#
...#.
..#..
.#...
#....
#####
@a
.....
.....
.###.
....#
.####
#...#
.####
@b
#....
#....
####.
#...#
#...#
#...#
####.
@c
.....
.....
.###.
#....
#....
#...#
.###.
@d
....#
....#
.####
#...#
#...#
#...#
.####
@e
.....
.....
.###.
#...#
#####
#....
.###.
@f
..##.
.#..#
.#...
###..
.#...
.#...
.#...
@g
.....
.....
.####
#...#
#...#
.####
....#
.###.
@h
#....
#....
#.##.
##..#
#...#
#...#
#...#
@i
..#..
.....
.##..
..#..
..#..
..#..
.###.
@j
...#.
.....
..##.
...#.
...#.
...#.
#..#.
.##..
@k
#....
#....
#..#.
#.#..
##...
#.#..
#..#.
@l
.##..
..#..
..#..
..#..
..#..
..#..
.###.
@m
.....
.....
##.#.
#.#.#
#.#.#
#.#.#
#...#
@n
.....
.....
#.##.
##..#
#...#
#...#
#...#
@o
.....
.....
.###.
#...#
#...#
#...#
.###.
@p
.....
.....
####.
#...#
#...#
####.
#....
#....
@q
.....
.....
.####
#...#
#...#
.####
....#
....#
@r
.....
.....
#.##.
##..#
#....
#....
#....
@s
.....
.....
.####
#....
.###.
....#
####.
@t
.#...
.#...
###..
.#...
.#...
.#..#
..##.
@u
.....
.....
#...#
#...#
#...#
#..##
.##.#
@v
.....
.....
#...#
#...#
#...#
.#.#.
..#..
@w
.....
.....
#...#
#...#
#.#.#
#.#.#
.#.#.
@x
.....
.....
#...#
.#.#.
..#..
.#.#.
#...#
@y
.....
.....
#...#
#...#
#...#
.####
....#
.###.
@z
.....
.....
#####
...#.
..#..
.#...
#####
@0
.###.
#...#
#..##
#.#.#
##..#
#...#
.###.
@1
..#..
.##..
..#..
..#..
..#..
..#..
.###.
@2
.###.
#...#
....#
...#.
..#..
.#...
#####
@3
#####
...#.
..#..
...#.
....#
#...#
.###.
@4
...#.
..##.
.#.#.
#..#.
#####
...#.
...#.
@5
#####
#....
####.
....#
....#
#...#
.###.
@6
..##.
.#...
#....
####.
#...#
#...#
.###.
@7
#####
....#
...#.
..#..
.#...
.#...
.#...
@8
.###.
#...#
#...#
.###.
#...#
#...#
.###.
@9
.###.
#...#
#...#
.####
....#
...#.
.##..
@.
.....
.....
.....
.....
.....
.##..
.##..
@,
.....
.....
.....
.....
.....
.##..
..#..
.#...
@!
..#..
..#..
..#..
..#..
..#..
.....
..#..
@?
.###.
#...#
....#
...#.
..#..
.....
..#..
@'
..#..
..#..
.#...
@"
.#.#.
.#.#.
.#.#.
@-
.....
.....
.....
.###.
@:
.....
.##..
.##..
.....
.##..
.##..
@;
.....
.##..
.##..
.....
.##..
..#..
.#...
@(
...#.
..#..
.#...
.#...
.#...
..#..
...#.
@)
.#...
..#..
...#.
...#.
...#.
..#..
.#...
@/
.....
....#
...#.
..#..
.#...
#....
@\\
.....
#....
.#...
..#..
...#.
....#
@&
.##..
#..#.
#.#..
.#...
#.#.#
#..#.
.##.#
@+
.....
..#..
..#..
#####
..#..
..#..
@=
.....
.....
#####
.....
#####
@*
.....
..#..
#.#.#
.###.
#.#.#
..#..
@#
.#.#.
.#.#.
#####
.#.#.
#####
.#.#.
.#.#.
@%
##...
##..#
...#.
..#..
.#...
#..##
...##
@@
.###.
#...#
#.###
#.#.#
#.###
#....
.###.
@_
.....
.....
.....
.....
.....
.....
.....
#####
@<
...#.
..#..
.#...
#....
.#...
..#..
...#.
@>
.#...
..#..
...#.
....#
...#.
..#..
.#...
@[
.###.
.#...
.#...
.#...
.#...
.#...
.###.
@]
.###.
...#.
...#.
...#.
...#.
...#.
.###.
@$
..#..
.####
#.#..
.###.
..#.#
####.
..#..
@~
.....
.....
.#...
#.#.#
...#.
@♥
.....
.#.#.
#####
#####
.###.
..#..
@✓
.....
....#
...##
#.##.
###..
.#...
@✗
.....
#...#
.#.#.
..#..
.#.#.
#...#
@✉
.....
#####
##.##
#.#.#
#...#
#####
@▶
.#...
.##..
.###.
.##..
.#...
@◀
...#.
..##.
.###.
..##.
...#.
@□
#####
#...#
#...#
#...#
#...#
#...#
#####
`;

function parse(raw) {
  const map = new Map();
  let key = null;
  let rows = [];
  const flush = () => {
    if (key === null) return;
    while (rows.length < GLYPH_H) rows.push('.....');
    map.set(key, rows.map((r) => r.padEnd(GLYPH_W, '.')));
  };
  for (const line of raw.split('\n')) {
    if (line.startsWith('@') && line.length === 2) {
      flush();
      key = line[1];
      rows = [];
    } else if (line.length && key !== null) {
      rows.push(line);
    }
  }
  flush();
  map.set(' ', Array(GLYPH_H).fill('.....'));
  return map;
}

export const GLYPHS = parse(RAW);
const FALLBACK = '□';

/** Map typographic characters people paste or that keyboards emit to the ASCII we draw. */
export function normalizeChar(ch) {
  switch (ch) {
    case '‘': case '’': case 'ʼ': return "'";
    case '“': case '”': return '"';
    case '–': case '—': return '-';
    case ' ': return ' ';
    default: return ch;
  }
}

export function hasGlyph(ch) {
  return GLYPHS.has(ch);
}

const cache = new Map();

function glyphCanvas(ch, color) {
  const k = ch + '|' + color;
  let c = cache.get(k);
  if (c) return c;
  const rows = GLYPHS.get(ch) || GLYPHS.get(FALLBACK);
  c = document.createElement('canvas');
  c.width = GLYPH_W;
  c.height = GLYPH_H;
  const g = c.getContext('2d');
  g.fillStyle = color;
  for (let y = 0; y < GLYPH_H; y++) {
    for (let x = 0; x < GLYPH_W; x++) {
      if (rows[y][x] === '#') g.fillRect(x, y, 1, 1);
    }
  }
  cache.set(k, c);
  return c;
}

export function drawChar(ctx, ch, x, y, scale = 2, color = '#e8dcc0') {
  if (ch === ' ') return;
  ctx.drawImage(glyphCanvas(ch, color), Math.round(x), Math.round(y), GLYPH_W * scale, GLYPH_H * scale);
}

export function measure(str, scale = 2) {
  if (!str.length) return 0;
  return (str.length * ADVANCE - 1) * scale;
}

/**
 * Draw a single line of text. align: 'left' | 'center' | 'right' (x is the anchor).
 * Returns the drawn width.
 */
export function drawText(ctx, str, x, y, { scale = 2, color = '#e8dcc0', align = 'left', shadow = null } = {}) {
  str = String(str);
  const w = measure(str, scale);
  let sx = x;
  if (align === 'center') sx = x - w / 2;
  else if (align === 'right') sx = x - w;
  sx = Math.round(sx);
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (shadow) drawChar(ctx, ch, sx + i * ADVANCE * scale + scale, y + scale, scale, shadow);
    drawChar(ctx, ch, sx + i * ADVANCE * scale, y, scale, color);
  }
  return w;
}

/**
 * Word-wrap text to at most maxChars per line.
 * Returns { lines, pos } where pos[i] = { line, col } for each character index of the input
 * (newline characters map to the end of their line).
 */
export function wrap(text, maxChars) {
  const lines = [''];
  const pos = [];
  let i = 0;
  const tokens = text.match(/\n|[^\s]+[ ]*|[ ]+/g) || [];
  for (const tok of tokens) {
    if (tok === '\n') {
      pos.push({ line: lines.length - 1, col: lines[lines.length - 1].length });
      lines.push('');
      i++;
      continue;
    }
    const word = tok.trimEnd();
    let cur = lines[lines.length - 1];
    if (cur.length > 0 && cur.length + word.length > maxChars) {
      lines.push('');
      cur = '';
    }
    for (const ch of tok) {
      cur = lines[lines.length - 1];
      // hard-break words longer than a full line
      if (ch !== ' ' && cur.length >= maxChars) {
        lines.push('');
        cur = '';
      }
      pos.push({ line: lines.length - 1, col: cur.length });
      lines[lines.length - 1] = cur + ch;
      i++;
    }
  }
  return { lines: lines.map((l) => l.trimEnd()), pos };
}
