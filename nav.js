// Stop model for step-by-step presenting. Pure: no DOM.
// A "stop" is one section, or one step inside a pinned section.
(function () {
  function computeStops(sections) {
    const stops = [];
    for (const s of sections) {
      if (s.steps <= 1 || !s.pinLength) {
        stops.push({ id: s.id, num: s.num, step: 1, steps: 1, y: s.top });
        continue;
      }
      for (let k = 0; k < s.steps; k++) {
        stops.push({ id: s.id, num: s.num, step: k + 1, steps: s.steps, y: s.top + s.pinLength * k / (s.steps - 1) });
      }
    }
    return stops.sort((a, b) => a.y - b.y);
  }

  // Next/previous stop relative to a scroll position (or a pending target), never backwards.
  function targetStop(stops, fromY, dir, eps = 4) {
    if (dir > 0) return stops.find(s => s.y > fromY + eps) || stops[stops.length - 1];
    return stops.findLast(s => s.y < fromY - eps) || stops[0];
  }

  function stopLabel(stop) {
    return stop.steps > 1 ? `${stop.num} · ${stop.step}/${stop.steps}` : stop.num;
  }

  const api = { computeStops, targetStop, stopLabel };
  if (typeof window !== 'undefined') Object.assign(window, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
