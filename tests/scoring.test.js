import { test } from 'node:test';
import assert from 'node:assert/strict';
import { align, scoreSentence, scoreRound, meetsGoal, showAcc, showWpm } from '../js/core/scoring.js';

const T = 'The quick fox.';

test('exact match is 100% accurate', () => {
  const r = scoreSentence(T, T, 6000);
  assert.equal(r.distance, 0);
  assert.equal(r.acc, 1);
  assert.equal(r.net, r.gross);
});

test('a dropped character costs exactly one error', () => {
  const typed = 'The quck fox.'; // missing "i"
  const r = scoreSentence(T, typed, 6000);
  assert.equal(r.distance, 1);
  assert.equal(r.acc, 1 - 1 / T.length);
  assert.equal(r.keyHits.i.miss, 1);
  assert.equal(r.keyHits.f.miss, 0, 'later characters are not shifted out of place');
});

test('an extra character costs exactly one error', () => {
  const typed = 'The quiick fox.';
  const r = scoreSentence(T, typed, 6000);
  assert.equal(r.distance, 1);
  assert.equal(r.acc, 1 - 1 / typed.length);
  const { insertions } = align(T, typed);
  assert.equal(insertions, 1);
});

test('a substitution is marked on the right key', () => {
  const r = scoreSentence(T, 'The quick fix.', 6000);
  assert.equal(r.distance, 1);
  assert.equal(r.keyHits.o.miss, 1);
});

test('empty input scores zero accuracy', () => {
  const r = scoreSentence(T, '', 3000);
  assert.equal(r.acc, 0);
  assert.equal(r.net, 0);
});

test('WPM math: 50 characters in one minute is 10 WPM', () => {
  const s = 'x'.repeat(50);
  const r = scoreSentence(s, s, 60000);
  assert.equal(r.gross, 10);
  assert.equal(r.net, 10);
});

test('tiny durations are clamped so WPM cannot explode', () => {
  const r = scoreSentence('ab', 'ab', 0);
  assert.ok(Number.isFinite(r.gross));
  assert.ok(r.gross <= 0.4 / (500 / 60000) + 1e-9);
});

test('round totals are weighted by characters and time', () => {
  const a = scoreSentence('x'.repeat(50), 'x'.repeat(50), 60000); // 10 wpm, 100%
  const b = scoreSentence('y'.repeat(50), 'y'.repeat(25) + 'z'.repeat(25), 30000); // 20 wpm gross, 50%
  const r = scoreRound([a, b]);
  assert.equal(r.chars, 100);
  assert.equal(r.acc, 0.75);
  assert.ok(Math.abs(r.gross - 100 / 5 / 1.5) < 1e-9);
  assert.equal(r.keyHits.y.miss, 25);
});

test('goal check agrees with the floored display values', () => {
  assert.equal(showAcc(0.9499), 94);
  assert.equal(showWpm(29.99), 29);
  assert.equal(meetsGoal({ net: 30, acc: 0.95 }, { wpm: 30, acc: 95 }), true);
  assert.equal(meetsGoal({ net: 29.99, acc: 0.99 }, { wpm: 30, acc: 95 }), false);
  assert.equal(meetsGoal({ net: 40, acc: 0.9499 }, { wpm: 30, acc: 95 }), false);
});
