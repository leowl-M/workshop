import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const window = {};
vm.runInNewContext(readFileSync(new URL('../data.js', import.meta.url), 'utf8'), { window });
const { FAMILIES, SKILLS, CASES, SHARE_URL } = window;

test('families are the nine of the spec', () =>
  assert.deepEqual(Array.from(FAMILIES, f => f.id),
    ['metodo', 'stile', 'gusto', 'immagine', '3d', 'framer', 'strumenti', 'compliance', 'documenti']));

test('every skill complete, family valid, names unique', () => {
  const ids = new Set(FAMILIES.map(f => f.id));
  for (const s of SKILLS) {
    assert.ok(s.name && s.what && s.when, s.name);
    assert.ok(ids.has(s.family), s.name);
    assert.ok(s.what.length <= 90 && s.when.length <= 110, s.name);
  }
  assert.equal(new Set(SKILLS.map(s => s.name)).size, SKILLS.length);
  assert.ok(SKILLS.length >= 60);
});

test('every family has at least one skill', () =>
  FAMILIES.forEach(f => assert.ok(SKILLS.some(s => s.family === f.id), f.id)));

test('five cases in spec order; their skills exist', () => {
  assert.deepEqual(Array.from(CASES, c => c.id), ['tokenizer', 'layerlink', 'squeeze', 'handoff-check', 'tavolo']);
  const names = new Set(SKILLS.map(s => s.name));
  CASES.forEach(c => c.skills.forEach(n => assert.ok(names.has(n), `${c.id}: ${n}`)));
  assert.equal(CASES.find(c => c.id === 'layerlink').steps.length, 5);
});

test('SHARE_URL is https', () => assert.match(SHARE_URL, /^https:\/\//));
