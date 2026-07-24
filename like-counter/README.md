# 💜 arcade-likes — the heart counter

Tiny Vercel API behind the profile card's heart button.

- `GET /like` → increments the counter, then 302-redirects back to your profile.
- `GET /likes.svg` → a beating-heart SVG badge showing the current count (served
  with no-cache headers so GitHub's image proxy refreshes it as often as it allows).

The counter lives in a Redis key `arcade_likes`. Any Upstash-compatible Redis works
(Vercel's Marketplace "Upstash for Redis" injects the exact env vars this expects).

## Deploy (one time, ~3 minutes)

From this `like-counter/` folder:

```bash
# 1. Log in + create the project (accept the defaults; when asked for the
#    directory, keep ".")
vercel login
vercel link       # or just run `vercel` and follow the prompts

# 2. Add a Redis store — this auto-creates KV_REST_API_URL + KV_REST_API_TOKEN.
#    Dashboard: your project → Storage → Marketplace → "Upstash for Redis" → Connect.
#    (Free "pay-as-you-go" tier is plenty for a like counter.)

# 3. Optional: where the heart sends visitors back to (defaults to your profile).
vercel env add REDIRECT_URL   # value: https://github.com/dankhael

# 4. Ship it.
vercel deploy --prod
```

Vercel prints your production URL, e.g. `https://dankhael-arcade-likes.vercel.app`.

## Test it

```bash
curl -i https://<your-domain>/like          # expect: 302 Location: https://github.com/dankhael
open  https://<your-domain>/likes.svg       # the heart badge with the current number
```

## Wire it into the profile README

In the root `README.md`, find the two `LIKES_DOMAIN` placeholders in the heart block
and replace them with your deployed domain, e.g. `dankhael-arcade-likes.vercel.app`.
Swap the badge image from the static `assets/heart-badge.svg` to the live
`https://<your-domain>/likes.svg`. There's a comment there marking exactly what to change.

## Env vars

| name                 | required | notes                                             |
| -------------------- | -------- | ------------------------------------------------- |
| `KV_REST_API_URL`    | yes      | Upstash/Vercel-KV REST endpoint (auto-injected).  |
| `KV_REST_API_TOKEN`  | yes      | Upstash/Vercel-KV REST token (auto-injected).     |
| `REDIRECT_URL`       | no       | Where `/like` sends the visitor. Defaults to the profile. |
