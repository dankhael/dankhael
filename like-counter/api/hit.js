// POST /hit -> increment, returns { "count": N }  (CORS-enabled; used by the
// interactive card's heart button so it can bump the count without leaving the page).
const KEY = 'arcade_likes';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  let count = 0;
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (base && token) {
    try {
      const r = await fetch(`${base}/incr/${KEY}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      count = parseInt(j.result, 10) || 0;
    } catch (_) {}
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ count }));
}
