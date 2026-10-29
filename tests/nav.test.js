import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { computeStops, targetStop, stopLabel } = createRequire(import.meta.url)('../nav.js');

const S = [
  { id: 's01', num: '01', top: 0,    steps: 1, pinLength: 0 },
  { id: 's07', num: '07', top: 1000, steps: 5, pinLength: 2000 },
  { id: 's09', num: '09', top: 4000, steps: 1, pinLength: 0 },
];

test('computeStops spreads pinned steps across pinLength', () => {
  const st = computeStops(S);
  assert.deepEqual(st.map(s => s.y), [0, 1000, 1500, 2000, 2500, 3000, 4000]);
  assert.equal(st[3].step, 3); assert.equal(st[3].steps, 5);
});
test('pinLength 0 (reduced motion) collapses to one stop', () => {
  assert.equal(computeStops([{ ...S[1], pinLength: 0 }]).length, 1);
});
test('next after manual scroll mid-section goes forward, not back', () => {
  assert.equal(targetStop(computeStops(S), 1720, 1).y, 2000);
});
test('prev from exact stop goes to previous stop', () => {
  assert.equal(targetStop(computeStops(S), 1500, -1).y, 1000);
});
test('five rapid presses chained from pending target = five stops', () => {
  const st = computeStops(S); let y = 0;
  for (let i = 0; i < 5; i++) y = targetStop(st, y, 1).y;
  assert.equal(y, 3000);
});
test('clamps at ends', () => {
  const st = computeStops(S);
  assert.equal(targetStop(st, 4000, 1).y, 4000);
  assert.equal(targetStop(st, 0, -1).y, 0);
});
test('stopLabel', () => {
  const st = computeStops(S);
  assert.equal(stopLabel(st[3]), '07 · 3/5');
  assert.equal(stopLabel(st[0]), '01');
});
