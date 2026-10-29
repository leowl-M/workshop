import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { normalizeStops, nextStopY, nearestStop } = createRequire(import.meta.url)('../nav.js');

test('normalizeStops sorts, drops NaN and near-duplicates', () => {
  assert.deepEqual(normalizeStops([900, 0, NaN, 903, 1800]), [0, 900, 1800]);
});
test('nextStopY goes forward from a stop and from between stops', () => {
  const s = [0, 900, 1800];
  assert.equal(nextStopY(s, 0, 1), 900);
  assert.equal(nextStopY(s, 1200, 1), 1800);
  assert.equal(nextStopY(s, 1200, -1), 900);
});
test('nextStopY: a press while already sitting on a stop never stays put', () => {
  assert.equal(nextStopY([0, 900, 1800], 902, 1), 1800);
  assert.equal(nextStopY([0, 900, 1800], 898, -1), 0);
});
test('nextStopY clamps at both ends and survives no stops', () => {
  const s = [0, 900];
  assert.equal(nextStopY(s, 900, 1), 900);
  assert.equal(nextStopY(s, 0, -1), 0);
  assert.equal(nextStopY([], 50, 1), 50);
});
test('chained presses from the pending target walk one stop each', () => {
  const s = [0, 500, 1000, 1500];
  let y = 0;
  for (let i = 0; i < 3; i++) y = nextStopY(s, y, 1);
  assert.equal(y, 1500);
});
test('nearestStop', () => {
  assert.equal(nearestStop([0, 900, 1800], 1300), 1);
  assert.equal(nearestStop([0, 900, 1800], 1400), 2);
});
