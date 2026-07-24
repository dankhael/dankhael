// GET /like  ->  increment the counter, then send the visitor back to the profile.
// This is the whole "click the heart" trick: a README image can't run JS, but a
// LINK can navigate. The heart is a link to here; we bump the count and 302 back.
const KEY = 'arcade_likes';

export default async function handler(req, res) {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const back = process.env.REDIRECT_URL || 'https://github.com/dankhael';

  if (base && token) {
    try {
      await fetch(`${base}/incr/${KEY}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {
      // Never block the redirect on a store hiccup.
    }
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.statusCode = 302;
  res.setHeader('Location', back);
  res.end();
}
