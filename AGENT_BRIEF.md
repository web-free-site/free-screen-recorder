# Cursor agent brief — free-screen-recorder

Target: https://free-screen-recorder.web-free.site
Repo name (wrangler `name`): `free-screen-recorder`
English name: "Free Screen Recorder". English primary.

Follow every rule in the attached `agent-brief-common.md`, with one SEO override below. Do not write the tool from scratch. Do not deploy. Do not switch models. Push to `main` of this repo when the work is done.

**SEO / language override (takes precedence over the common brief):** do **not** add a French or Swahili landing page, UI translation, or how-to pages. How-to and legal pages are English only. You may omit `hreflang` fr.

Recording and editing must stay **100% in the browser**. Do not add a share-link upload, a cloud storage bucket, or any endpoint that receives video. No accounts, no time limit, no watermark.

## Recommended base (use this)

- Repo: https://github.com/mmiscool/screencap.me
- License: MIT (keep `LICENSE`, credit Mike / screencap.me in the footer and on `/about`)
- Stars: 25
- Last commit: 4 Dec 2025, 07:47 CAT (Africa/Kigali) — `7f2bf4e` on `master`
- Official demo: `https://screencap.me`
- Stack: zero dependencies, no build — `index.html`, `main.js` (~95 kB), `styles.css`. Uses the Screen Capture and MediaRecorder APIs. Features already in the base: screen + microphone, optional webcam picture-in-picture, import existing clips, title cards, trim and reorder clips, export one WebM in the browser, save/load a local JSON project. No FFmpeg, no backend.
- Cloudflare: yes — static assets / Workers with assets. Drop the upstream `CNAME`. Screen capture requires a secure context (HTTPS), which the custom domain will provide; local tests need `localhost` or HTTPS, not a raw `file://` page.
- Verification (this box, 19 Nov 2026, CAT): cloned; `LICENSE` is a real MIT file (Copyright (c) 2025 Mike). The README matches a complete recorder + editor, with a fix in the last commit for browser crashes on large renders. Chromium-based browsers are the practical target (the README already says this); say so honestly on `/about` if Safari/Firefox support is weaker.
- Local clone already on the box: `/workspace/repo-candidates/batch-2026-11-19/screencap.me`
- Why this one: MIT with a real `LICENSE` file, a complete website with trim and export, no server, no share-upload, and no framework — the easiest fit for Workers static assets and Adsterra (no COEP/COOP).

## Backup (MIT; more polished; must strip the share backend)

- Repo: https://github.com/6can/kirmizi
- License: MIT (LICENSE file, Copyright (c) 2026 hix)
- Stars: 13
- Last commit: 20 Sep 2026, 14:42 CAT (Africa/Kigali) — `7c0b8c0` on `main`
- Official demo: `https://kirmizi.app`
- Stack: Next.js, MP4 muxer, a built-in editor, Playwright tests, and a **Cloudflare Worker + R2 + D1 + Turnstile share endpoint** under `worker/`. Recording and editing are client-side, but share is not. If you are forced to use this base: **delete the share worker, R2/D1 usage, Turnstile, and every share UI/route** (`app/v`, `components/share`, etc.). Do not deploy that worker. You must still prerender every public page, and you must not set COEP/COOP headers.
- Local clone: `/workspace/repo-candidates/batch-2026-11-19/kirmizi`

Prefer screencap.me. kirmizi’s share backend is incompatible with “nothing is uploaded” and with the free-plan constraint.

## Do not use these

- Hosted recorders that upload video to a server, desktop installers, and browser extensions as the only UI.
- Tools that require COEP/COOP or a paid encoding API.

## What to build on top of mmiscool/screencap.me

1. Import the base into this repo, keep the MIT license, and credit Mike / screencap.me. Omit GitHub Actions workflows if any (the token lacks the `workflow` scope — do not restore them). Do not keep the upstream `CNAME`. Do not turn the site into a promo for screencap.me; a short credit is enough.
2. Rebrand to "Free Screen Recorder". English primary. No FR/SW translations of the site.
3. Keep capture, trim, title cards, webcam PiP, and export 100% in the browser. No accounts, no paid APIs, no API keys, no upload, no share links. Export at least WebM (the base already does). An optional in-browser MP4 export is welcome only if you can do it without a GPL FFmpeg core, without COEP/COOP, and without putting a huge `.wasm` in the repo — otherwise leave WebM and say so on the page.
4. Adsterra only, never AdSense. Use **only** the codes in `/workspace/ads-free-screen-recorder.md` (that file will be filled in before you start; do not invent codes). Follow the `free-invoice-generator` pattern: all 10 units, banners in isolated iframes, `atOptions {key, format:'iframe', height, width, params:{}}`, `src https://bauval.org/22/<key>`, `public/ads.json`. Never set COEP/COOP headers. Ads must not overlay the recording chrome in a way that is captured into the video, and must not break Start/Stop, trim, or export.
5. SEO: prerendered HTML for every page (no bare SPA fallback); unique title, meta description, canonical, OG; JSON-LD (WebApplication + FAQPage); `sitemap.xml` and `robots.txt` for `https://free-screen-recorder.web-free.site`; English how-to pages, at least `/how-to-record-your-screen-in-the-browser` and `/how-to-record-your-screen-with-a-webcam`; prerendered `/privacy`, `/terms`, `/about`, `/contact`. Canonicals must be `https://free-screen-recorder.web-free.site`. No French landing page. If you keep a single HTML file as the app shell, still prerender the how-to and legal pages as real HTML files.
6. Footer: credit the upstream project, and add a link back to the hub `https://web-free.site`.
7. On every prerendered HTML page, before `</body>`, add:
   - The same **"More free tools"** block used on the other web-free.site tools (`id="wf-more-tools"`). Include a "Guides on this site" column for the how-to pages. List every current hub tool, plus the four other sites in this batch. Show **Free Screen Recorder** as bold text, not a self-link.
     - **Documents & writing:** Free Word Counter, Free PDF Converter, Free CV Maker, Free Invoice Generator, Free Typing Test, Free Signature Generator, and Free Email Signature Generator (`https://free-email-signature-generator.web-free.site/`).
     - **Images & codes:** Free QR Code Creator, Free Image Resizer, Free Image to Text, Free Background Remover, Free Image Compressor.
     - **Calculators & currency:** Free Online Calculator, Free Currency Converter, Free Unit Converter, Free Loan Calculator, Free Age Calculator, Free Percentage Calculator, Free BMI Calculator.
     - **Text & SEO:** Free AI Humanizer, Free SEO Generator, Free Backlink Generator, Free JSON Formatter, Free Text to Speech, Free Speech to Text, and Free Diff Checker (`https://free-diff-checker.web-free.site/`).
     - **Audio & video:** Free Video to MP3 Converter, Free MP3 Cutter (`https://free-mp3-cutter.web-free.site/`), and **Free Screen Recorder**.
     - **Files:** Free ZIP Tool (`https://free-zip-tool.web-free.site/`).
     - **Test data:** Free Fake Address Generator, Free Fake Name Generator.
     - **Security & passwords:** Free Password Generator.
   - The same Cloudflare Web Analytics tag used on the other sites: `<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3e2f5f96ab32442ebb6e6f650615b58a"}'></script><!-- End Cloudflare Web Analytics -->`
8. `wrangler.toml`: `name = "free-screen-recorder"`, `[assets]` pointing at the static output. Use `html_handling = "auto-trailing-slash"` and `not_found_handling = "none"`. Custom domain `free-screen-recorder.web-free.site`. **Do not put `account_id` (or API tokens) in the committed file.** **Do not deploy.** Push to this repo only. Deploy happens from Gentil's box.
9. Test: serve the production files over `http://localhost` (or HTTPS), record a short screen clip (a few seconds), trim it, export a WebM, confirm it plays, try webcam PiP if a camera is available (skip that check if none is), confirm there is no upload or share endpoint, check mobile layout at 390px (recording may be limited on phones — say so if the browser cannot capture), fix bugs. Critique your own result and fix issues.
10. Push everything to `main`. Final report: base repo + license, pages, tests and results (including which browsers you actually recorded in), remaining caveats, commit hash.

## Adsterra ad codes

Read `/workspace/ads-free-screen-recorder.md` and use only the codes in that file. It will be filled in separately, before this agent is launched. Do not invent Adsterra keys, URLs, or site IDs.


---
NOTE: any /workspace/... box path mentioned above is NOT accessible to you; everything you need is inline below. Clone the base repo from GitHub yourself.

# COMMON RULES (contents of agent-brief-common.md)
COMMON RULES (from Gentil, mandatory):
- Start from an existing, usable open-source repository: search GitHub, then compare stars, activity, license (MIT/Apache/BSD preferred; avoid AGPL/GPL unless nothing else fits) and code quality. Import its code into this repo, keep its LICENSE, and credit it in the footer and on /about.
- Do NOT write the tool from scratch. If no suitable open-source base exists, STOP before coding and report the 2-3 best candidates and why they fail. Gentil must approve any from-scratch work, and he only allows it for one or two simple pages.
- Keep the model you were launched with. Do not switch models.
- Must be hostable on Cloudflare Workers with static assets (free plan). No paid APIs, no server costs, no API keys. Client-side processing preferred.
- Monetization: Adsterra only, never AdSense. The real codes for this site are in the attached adsterra-new-codes.md, in this site's section (use only that section). Integrate all 10 units following the free-invoice-generator pattern: Popunder and Social Bar in the HTML; 728x90 at the top; sidebar 160x600 and 160x300; mid-page 728x90, 468x60 and Native; 300x250; sticky 320x50 on mobile; Smartlink as a discreet link. Banners go in isolated iframes with atOptions {key, format:'iframe', height, width, params:{}} and src https://bauval.org/22/<key>. Also write public/ads.json with all the codes. Never set COEP/COOP headers. Ads must not break the tool.
- SEO: prerendered HTML for every page (no bare SPA fallback); unique title, meta description, canonical and OG tags; JSON-LD (WebApplication + FAQPage); hreflang en/fr; sitemap.xml and robots.txt using the site's own URL; a long-tail keyword page or two; FAQ and how-to content; /privacy, /terms, /about and /contact pages (prerendered); plus a French landing page.
- Name: "Free <Tool>". English primary.
- Add wrangler.toml with name = <repo name> and [assets] pointing to the build output. Do NOT deploy: Gentil's box deploys it.
- Test: build, run it locally, exercise the main feature in a browser, check mobile at 390px, and fix bugs. Critique your own result and fix the issues you find.
- Push everything to main of this repo.
- Final report: the base repo and its license, the pages, the tests and their results, the remaining caveats, and the commit hash.


# ADSTERRA CODES FOR THIS SITE (use only these)
Code formats (KEY = the 32-char hash):
- Popunder: <script data-cfasync="false" src="https://abscloud.org/1/KEY"></script>
- Native Banner: <script async="async" data-cfasync="false" src="https://bauval.org/21/KEY"></script><div id="container-KEY"></div>
- Social Bar: <script data-cfasync="false" src="https://bauval.org/14/KEY"></script>
- Banner WxH: <script>atOptions = {'key':'KEY','format':'iframe','height':H,'width':W,'params':{}};</script><script src="https://bauval.org/22/KEY"></script>
- Smartlink URL: https://araplhn.org/4/KEY

## free-screen-recorder.web-free.site — site ID 6213259
Popunder e62a2b73cd0f33e17592521ae8f28895
Native Banner 4a0844b266024164a427cba252714128
Smartlink 47858e13fc12ce7d27db29e942c8d029
Social Bar 9c8ab023da0a2b414a9e6a6a3732c24d
468x60 ffc4daa387a14931f157c760b30ea1bd
160x300 4a332899bd1fdf414b12aee979ad5d49
320x50 b0d8d42c12f63505c3c6f3a9520de5f4
300x250 605fd6e985245a60a640ec7f4faf3294
160x600 deaf052dd273610883430d1f528c8e8f
728x90 3b40c294ae9df9077ffdb29a2782e64d
