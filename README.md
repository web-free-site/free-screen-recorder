# Free Screen Recorder

Browser-based screen and microphone recorder with trim, title cards, webcam PiP, and WebM export. No signup, no upload, no watermark.

**Live URL (after deploy):** https://free-screen-recorder.web-free.site/

## Upstream

Built on [screencap.me](https://github.com/mmiscool/screencap.me) by Mike, MIT License. See `LICENSE`.

## Local development

Screen capture needs a secure context (`https://` or `http://localhost`).

```bash
python3 -m http.server 8080 --bind 127.0.0.1
# open http://127.0.0.1:8080/
```

## Cloudflare Workers

Static assets are served from the repo root via `wrangler.toml`. **Do not deploy from CI here** — Gentil's box deploys.

```bash
# optional local validation only
npx wrangler dev
```

`AGENT_BRIEF.md` is excluded from the asset bundle.

## Pages

- `/` — recorder
- `/about/`, `/privacy/`, `/terms/`, `/contact/`
- `/how-to-record-your-screen-in-the-browser/`
- `/how-to-record-your-screen-with-a-webcam/`

Regenerate static content pages:

```bash
node scripts/build-static-pages.mjs
```

## Ads

Adsterra unit keys live in `public/ads.json`. Banner slots load in isolated iframes via `wf-ads.js`.