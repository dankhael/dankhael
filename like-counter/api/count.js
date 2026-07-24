// GET /count -> { "count": N }  (read-only, CORS-enabled for the interactive card page)
const KEY = 'arcade_likes';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  let count = 0;
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (base && token) {
    try {
      const r = await fetch(`${base}/get/${KEY}`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      count = parseInt(j.result, 10) || 0;
    } catch (_) {}
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ count }));
}
