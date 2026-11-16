import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLYPHS, GLYPH_W, GLYPH_H, wrap } from '../js/gfx/font.js';
import { SPRITES } from '../js/gfx/sprites.js';
import { SENTENCES } from '../js/data/sentences.js';
import { NPCS, goalFor, fmt } from '../js/world/npcs.js';
import { buildMap, isSolid, MAP_W, MAP_H, SPAWN, TILE_TEXT } from '../js/world/map.js';

function allText() {
  const out = [];
  for (const set of Object.values(SENTENCES)) out.push(...set);
  for (const n of NPCS) {
    for (const v of Object.values(n.lines)) out.push(...(Array.isArray(v) ? v : [v]));
    if (n.intro) out.push(...n.intro);
  }
  for (const v of Object.values(TILE_TEXT)) out.push(...v);
  return out.map((t) => fmt(t, { name: 'Fennel', wpm: 30, acc: 90 }));
}

test('every glyph is 5x8 and only uses . and #', () => {
  for (const [ch, rows] of GLYPHS) {
    assert.equal(rows.length, GLYPH_H, `glyph ${ch} height`);
    for (const r of rows) {
      assert.equal(r.length, GLYPH_W, `glyph ${ch} width`);
      assert.match(r, /^[.#]+$/, `glyph ${ch} pixels`);
    }
  }
});

test('the font covers printable ASCII', () => {
  for (let c = 32; c < 127; c++) {
    const ch = String.fromCharCode(c);
    if (ch === '`' || ch === '{' || ch === '}' || ch === '|' || ch === '^') continue;
    assert.ok(GLYPHS.has(ch), `missing glyph for ${JSON.stringify(ch)}`);
  }
});

test('all game text can be drawn by the bitmap font', () => {
  for (const t of allText()) {
    for (const ch of t) assert.ok(GLYPHS.has(ch), `missing glyph ${JSON.stringify(ch)} in: ${t}`);
  }
});

test('sentence sets are big enough for each round', () => {
  for (const n of NPCS) {
    const set = SENTENCES[n.id];
    assert.ok(set, `no sentences for ${n.id}`);
    assert.ok(set.length >= n.roundSize, `${n.id} needs at least ${n.roundSize} sentences`);
    assert.ok(n.roundSize >= 3 && n.roundSize <= 5);
    for (const s of set) assert.ok(s.length <= 47 * 5, 'sentence fits in the 5-line typing box');
    assert.equal(new Set(set).size, set.length, `${n.id} has duplicate sentences`);
  }
});

test('sprite rows have consistent widths and known palette keys', () => {
  for (const [name, def] of Object.entries(SPRITES)) {
    for (const [fname, rows] of Object.entries(def.frames)) {
      const w = rows[0].length;
      rows.forEach((r, i) => {
        assert.equal(r.length, w, `${name}.${fname} row ${i}`);
        for (const ch of r) assert.ok(ch === '.' || def.palette[ch], `${name}.${fname} unknown colour ${ch}`);
      });
    }
  }
});

test('wrap keeps every character position and respects the width', () => {
  for (const s of SENTENCES.sage) {
    const { lines, pos } = wrap(s, 47);
    assert.equal(pos.length, s.length);
    for (const l of lines) assert.ok(l.length <= 47);
    pos.forEach((p, i) => assert.equal(lines[p.line][p.col] ?? ' ', s[i]));
  }
});

test('goals scale with difficulty and stay sane', () => {
  for (const n of NPCS) {
    const g = goalFor(n, 'gentle');
    const h = goalFor(n, 'tough');
    assert.ok(g.wpm < n.goal.wpm && h.wpm > n.goal.wpm);
    assert.ok(g.acc <= n.goal.acc && h.acc >= n.goal.acc && h.acc <= 99);
  }
});

function reachable(flags) {
  const g = buildMap();
  const npcTiles = new Set(NPCS.map((n) => `${n.tx},${n.ty}`));
  const seen = new Set([`${SPAWN.tx},${SPAWN.ty}`]);
  const q = [[SPAWN.tx, SPAWN.ty]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      const k = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H || seen.has(k)) continue;
      if (isSolid(g[ny][nx], flags) || npcTiles.has(k)) continue;
      seen.add(k);
      q.push([nx, ny]);
    }
  }
  const canTalk = (n) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${n.tx + dx},${n.ty + dy}`));
  return Object.fromEntries(NPCS.map((n) => [n.id, canTalk(n)]));
}

test('map: NPC tiles are open ground', () => {
  const g = buildMap();
  assert.equal(g.length, MAP_H);
  g.forEach((row) => assert.equal(row.length, MAP_W));
  for (const n of NPCS) assert.ok(!isSolid(g[n.ty][n.tx], {}), `${n.id} placed on a solid tile`);
  assert.ok(!isSolid(g[SPAWN.ty][SPAWN.tx], {}), 'spawn is open');
});

test('map: gates lock the path in story order', () => {
  assert.deepEqual(reachable({}), { mushroom: true, postmaster: true, ghost: false, sage: false });
  assert.deepEqual(reachable({ mushroom: true, postmaster: true }), {
    mushroom: true,
    postmaster: true,
    ghost: true,
    sage: false,
  });
  assert.deepEqual(reachable({ mushroom: true, postmaster: true, ghost: true }), {
    mushroom: true,
    postmaster: true,
    ghost: true,
    sage: true,
  });
});
