// GET /likes.svg  ->  read the counter and render a beating-heart badge as SVG.
// no-store + no-cache headers ask GitHub's Camo proxy to keep it fresh (it still
// caches for a short while — that delay is unavoidable for any README counter).
const KEY = 'arcade_likes';

function fmt(n) {
  return Number(n).toLocaleString('en-US');
}

function renderSvg(count) {
  const label = fmt(count);
  // Monospace ~ 15px per char; leave room for the heart + padding.
  const w = 78 + label.length * 16;
  const cx = w - 14 - (label.length * 16) / 2; // rough centering of the number block
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="46" viewBox="0 0 ${w} 46" role="img" aria-label="${label} hearts">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b3597"/>
      <stop offset="1" stop-color="#2a2570"/>
    </linearGradient>
    <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff7aa2"/>
      <stop offset="1" stop-color="#e11d63"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="scan" width="1" height="3" patternUnits="userSpaceOnUse">
      <rect width="1" height="1" fill="#ffffff" opacity="0.05"/>
    </pattern>
  </defs>

  <rect x="1" y="1" width="${w - 2}" height="44" rx="11" fill="url(#bg)" stroke="#6d64d6" stroke-width="2"/>
  <rect x="1" y="1" width="${w - 2}" height="44" rx="11" fill="url(#scan)"/>

  <g transform="translate(26 23)" filter="url(#glow)">
    <path transform="translate(-11 -10) scale(0.92)" fill="url(#hb)"
      d="M12 21s-6.7-4.35-9.33-8.02C.9 10.2 1.6 6.5 4.8 5.3c1.9-.72 3.9.06 4.9 1.62l.3.48.3-.48c1-1.56 3-2.34 4.9-1.62 3.2 1.2 3.9 4.9 2.13 7.68C18.7 16.65 12 21 12 21z"/>
    <animateTransform attributeName="transform" type="scale" additive="sum"
      values="1;1.16;1;1.08;1" keyTimes="0;0.15;0.3;0.45;1" dur="1.4s" repeatCount="indefinite"/>
  </g>

  <text x="${cx}" y="30" text-anchor="middle" font-family="'DejaVu Sans Mono','Courier New',monospace"
    font-size="21" font-weight="700" fill="#f4f2ff" letter-spacing="1">${label}</text>
</svg>`;
}

export { renderSvg };

export default async function handler(req, res) {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  let count = 0;
  if (base && token) {
    try {
      const r = await fetch(`${base}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await r.json();
      count = parseInt(j.result, 10) || 0;
    } catch (_) {
      // fall back to 0
    }
  }

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(renderSvg(count));
}
