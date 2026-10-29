// Stop model for presenting a scroll page from the keyboard. Pure: no DOM.
// A stop is a scroll position where one idea is fully on screen.
(function () {
  // Sorted, de-duplicated stop positions (closer than `minGap` px collapse into one).
  function normalizeStops(ys, minGap = 8) {
    return [...ys].filter(Number.isFinite).sort((a, b) => a - b)
      .filter((y, i, a) => i === 0 || y - a[i - 1] >= minGap);
  }

  // Next stop strictly ahead of `y` (or behind, dir < 0); clamps at both ends.
  function nextStopY(stops, y, dir, eps = 4) {
    if (!stops.length) return y;
    if (dir > 0) return stops.find(s => s > y + eps) ?? stops[stops.length - 1];
    return stops.findLast(s => s < y - eps) ?? stops[0];
  }

  // Index of the stop nearest to `y`, for the "03 / 41" counter.
  function nearestStop(stops, y) {
    let best = 0;
    stops.forEach((s, i) => { if (Math.abs(s - y) < Math.abs(stops[best] - y)) best = i; });
    return best;
  }

  const api = { normalizeStops, nextStopY, nearestStop };
  if (typeof window !== 'undefined') Object.assign(window, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
