import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const window = JSON.parse(readFileSync(new URL('../content.json', import.meta.url), 'utf8'));
const { FAMILIES, SKILLS, SHARE_URL } = window;

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

const byId = (P, id) => P.find(p => p.id === id);

test('nine projects: complete, grouped, every image slot numbered and described', () => {
  const P = window.PROJECTS, groups = new Set(window.GROUPS.map(g => g.id));
  assert.equal(P.length, 9);
  assert.equal(new Set(P.map(p => p.id)).size, 9);
  const ids = [];
  for (const p of P) {
    assert.ok(p.name && p.kind && p.solution && p.details.length && p.imgs.length, p.id);
    assert.ok(groups.has(p.group), p.id);
    p.imgs.forEach(id => { assert.match(id, /^img-\d\d$/); assert.ok(window.SLOTS[id], id); ids.push(id); });
  }
  assert.equal(new Set(ids).size, ids.length, 'each slot used once');
  assert.ok(P.filter(p => p.group === 'figma').every(p => p.problem), 'figma cards show the problem');
  assert.ok(!byId(P, 'photoshop'), 'Modifica in Photoshop removed');
  assert.ok(!P.some(p => /tea|portfolio/i.test(p.id)), 'client material and portfolio stay out');
  const sim = window.PRISMA_SIM;
  assert.deepEqual(Object.keys(sim), ['shift', 'cmd', 'ctrl'], 'one simulated fan per key');
  Object.values(sim).forEach(m => assert.ok(m.items.includes(m.pick), m.title));
});

test('keys: one per project, each opens a real project', () => {
  const ids = new Set(window.PROJECTS.map(p => p.id));
  assert.equal(window.KEYS.length, 9);
  window.KEYS.forEach(k => assert.ok(ids.has(k.to) && k.label && k.u > 0, k.label));
});

test('SHARE_URL is https', () => assert.match(SHARE_URL, /^https:\/\//));

test('kit: 7 groups, 50 entries; every plugin has a /plugin install command', () => {
  assert.equal(window.KIT.length, 7);
  assert.equal(window.KIT.reduce((n, g) => n + g.rows.length, 0), 50);
  window.KIT.forEach(g => g.rows.forEach(r => assert.ok(r.name && r.what, r.name)));
  window.KIT.find(g => /^Plugin/.test(g.h)).rows.forEach(r => assert.ok(r.cmds?.some(c => c.startsWith('/plugin install ')), r.name));
});

test('web apps: 21, all https', () => {
  assert.equal(window.WEBAPPS.length, 21);
  window.WEBAPPS.forEach(a => assert.match(a.href, /^https:\/\//, a.name));
});

test('method: nine steps, each with a real excerpt', () => {
  assert.equal(window.METHOD.length, 9);
  window.METHOD.forEach(m => assert.ok(m.name && m.what && m.file && m.lines.length, m.name));
});
