import fs from 'node:fs';
import path from 'node:path';

const HOST = 'https://free-screen-recorder.web-free.site';
const root = path.resolve(import.meta.dirname, '..');
const moreTools = fs.readFileSync(path.join(root, 'fragments/more-tools.html'), 'utf8');
const analytics = fs.readFileSync(path.join(root, 'fragments/analytics.html'), 'utf8');
const adHead = fs.readFileSync(path.join(root, 'fragments/ad-head.html'), 'utf8');

const nav = `<header class="site-header">
  <div class="site-header__row">
    <a class="site-brand" href="/"><strong>Free Screen Recorder</strong><small>Record, trim, and export in your browser</small></a>
    <nav class="site-nav" aria-label="Main">
      <a href="/">Recorder</a>
      <a href="/how-to-record-your-screen-in-the-browser/">How-to</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
    </nav>
  </div>
  <div class="ad-header-slot"><div data-ad-slot="header728x90" data-ad-label="Sponsored"></div></div>
</header>`;

const footer = `<footer class="site-footer">
  <p>
    <a href="https://web-free.site/">web-free.site</a>
    · Based on <a href="https://github.com/mmiscool/screencap.me" rel="noopener noreferrer">screencap.me</a> (MIT, Mike)
    · <span data-ad-smartlink></span>
  </p>
  <p>
    <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="/about/">About</a> ·
    <a href="/contact/">Contact</a>
  </p>
</footer>`;

const adRail = `<aside class="site-ad-rail site-ad-rail--desktop" aria-label="Advertisement sidebar">
  <div data-ad-slot="sidebar160x600" data-ad-label="Sponsored"></div>
  <div data-ad-slot="sidebar160x300" data-ad-label="Sponsored"></div>
</aside>`;

const midAds = `<div class="ad-mid-row">
  <div data-ad-slot="betweenToolContent728x90" data-ad-label="Sponsored"></div>
  <div data-ad-slot="content468x60" data-ad-label="Sponsored"></div>
  <div data-ad-slot="content300x250" data-ad-label="Sponsored"></div>
</div>
<div data-ad-slot="nativeBelowResult" data-ad-label="Sponsored"></div>`;

const mobileSticky = `<div class="ad-mobile-sticky-host"><div data-ad-slot="mobileSticky320x50" data-ad-label="Sponsored"></div></div>`;

function pageShell({ title, description, path, bodyHtml, extraHead = '', jsonLd = '' }) {
  const canonical = HOST + path;
  const ogImage = HOST + '/screenshot.png';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/wf-brand.css" />
  <meta name="color-scheme" content="light dark" />
  ${extraHead}
  ${jsonLd}
</head>
<body class="site-body-root">
  ${adHead}
  <div class="site-root">
    ${nav}
    <div class="site-layout site-layout--static">
      <div class="site-main-col">
        <article class="site-page"><div class="prose">${bodyHtml}</div></article>
        ${midAds}
        ${footer}
      </div>
      ${adRail}
    </div>
    ${moreTools}
  </div>
  ${mobileSticky}
  ${analytics}
  <script src="/wf-ads.js" defer></script>
</body>
</html>`;
}

const pages = [
  {
    dir: 'about',
    path: '/about/',
    title: 'About — Free Screen Recorder',
    description:
      'How Free Screen Recorder works, browser support, upstream credits, and what stays on your device.',
    body: `<h1>About Free Screen Recorder</h1>
<p><strong>Free Screen Recorder</strong> is a browser-based screen and microphone capture tool with trimming, title cards, optional webcam picture-in-picture, and WebM export. Nothing is uploaded to a server.</p>
<h2>Browser support</h2>
<p>Chromium-based browsers (Chrome, Edge, Brave, and most ChromeOS devices) are the practical choice. Screen capture, MediaRecorder, and the in-browser render pipeline depend on APIs that are most complete in Chromium. Safari and Firefox may work for basic capture in some versions, but trimming, export, or PiP can be unreliable—we do not guarantee feature parity outside Chromium.</p>
<h2>Mobile</h2>
<p>At roughly 390px width the layout adapts, but many phones cannot share the full screen through the browser picker. Treat mobile as limited: you may import clips or edit, but screen capture is often blocked or restricted by the OS.</p>
<h2>Export format</h2>
<p>Final videos export as <strong>WebM</strong> using canvas compositing and MediaRecorder in the page. We do not bundle FFmpeg or a large WASM encoder; MP4 export is not offered on this build.</p>
<h2>Upstream project</h2>
<p>This site is built on <a href="https://github.com/mmiscool/screencap.me">screencap.me</a> by Mike, licensed under the <a href="https://opensource.org/licenses/MIT">MIT License</a>. We kept the core recorder and editor logic and rebranded the experience for <a href="https://web-free.site/">web-free.site</a>.</p>
<h2>No accounts, no cloud</h2>
<p>Projects save as JSON you download locally. Video never leaves your machine unless you choose to share the exported file yourself.</p>`,
  },
  {
    dir: 'privacy',
    path: '/privacy/',
    title: 'Privacy Policy — Free Screen Recorder',
    description: 'Privacy policy for Free Screen Recorder: local processing, cookies, ads, and analytics.',
    body: `<h1>Privacy Policy</h1>
<p><em>Last updated: November 2026</em></p>
<p>Free Screen Recorder (<a href="${HOST}/">free-screen-recorder.web-free.site</a>) processes screen, microphone, webcam, and file data <strong>entirely in your browser</strong>. We do not operate a backend that receives your recordings or projects.</p>
<h2>What we do not collect</h2>
<ul>
<li>We do not upload video, audio, or project JSON to our servers.</li>
<li>We do not require accounts or email addresses to use the recorder.</li>
</ul>
<h2>Advertising</h2>
<p>We show third-party advertisements (Adsterra). Ad partners may use cookies or similar technologies under their own policies. Ad scripts load from their domains; we do not control their data practices.</p>
<h2>Analytics</h2>
<p>We use Cloudflare Web Analytics on this site to understand aggregate traffic. It is configured without third-party cookies according to Cloudflare's documentation.</p>
<h2>Contact</h2>
<p>Questions: see <a href="/contact/">Contact</a>.</p>`,
  },
  {
    dir: 'terms',
    path: '/terms/',
    title: 'Terms of Use — Free Screen Recorder',
    description: 'Terms of use for the Free Screen Recorder web application.',
    body: `<h1>Terms of Use</h1>
<p><em>Last updated: November 2026</em></p>
<p>By using Free Screen Recorder you agree to these terms.</p>
<h2>Service</h2>
<p>The tool is provided "as is" without warranties. Recording laws vary by region—you are responsible for consent when capturing other people or sensitive content.</p>
<h2>Acceptable use</h2>
<p>Do not use the site for unlawful surveillance, harassment, or malware distribution. Do not attempt to bypass security of other systems.</p>
<h2>Limitation of liability</h2>
<p>We are not liable for lost footage, failed exports, browser bugs, or damages arising from use of the tool.</p>
<h2>Changes</h2>
<p>We may update these terms; continued use constitutes acceptance of the revised terms.</p>`,
  },
  {
    dir: 'contact',
    path: '/contact/',
    title: 'Contact — Free Screen Recorder',
    description: 'How to reach the maintainers of Free Screen Recorder on web-free.site.',
    body: `<h1>Contact</h1>
<p>Free Screen Recorder is part of the <a href="https://web-free.site/">web-free.site</a> collection of browser tools.</p>
<p>For site issues, use the contact options listed on the main <a href="https://web-free.site/">web-free.site</a> hub. This recorder does not provide support email in-app; your recordings never leave your device, so we cannot recover lost projects.</p>
<p>Upstream open-source code: <a href="https://github.com/mmiscool/screencap.me">mmiscool/screencap.me</a>.</p>`,
  },
  {
    dir: 'how-to-record-your-screen-in-the-browser',
    path: '/how-to-record-your-screen-in-the-browser/',
    title: 'How to Record Your Screen in the Browser (Free, No Upload)',
    description:
      'Step-by-step guide to recording your screen and microphone in Chrome or Edge without installing software or creating an account.',
    body: `<h1>How to record your screen in the browser</h1>
<p>You can capture screen and microphone audio on <a href="/">Free Screen Recorder</a> without installing desktop software. Everything runs on your machine.</p>
<h2>Before you start</h2>
<ul>
<li>Use a <strong>Chromium</strong> browser on desktop (Chrome, Edge, or Brave) over HTTPS or <code>localhost</code>.</li>
<li>Close sensitive windows you do not want in the capture.</li>
<li>Plug in or select the microphone you want if the browser asks.</li>
</ul>
<h2>Steps</h2>
<ol>
<li>Open the <a href="/">recorder home page</a>.</li>
<li>Click <strong>Start Screen + Mic</strong> and pick the screen, window, or tab to share. Enable system audio if offered and you need it.</li>
<li>Click <strong>Start Clip</strong> when you are ready. Use <strong>Stop Recording</strong> when the segment is done.</li>
<li>Repeat for multiple clips, or <strong>Import Clip</strong> to add existing videos.</li>
<li>Drag trim handles on each clip, reorder with the ↑/↓ controls, and add <strong>Title Block</strong> cards if needed.</li>
<li>Click <strong>Export Final Video</strong> and download the WebM when rendering completes.</li>
</ol>
<h2>Tips</h2>
<p>Pause notifications during capture. For long sessions, export your project JSON with <strong>Export Project</strong> so you can resume later with <strong>Import Project</strong>.</p>`,
  },
  {
    dir: 'how-to-record-your-screen-with-a-webcam',
    path: '/how-to-record-your-screen-with-a-webcam/',
    title: 'How to Record Your Screen With a Webcam (Picture-in-Picture)',
    description:
      'Add a floating webcam overlay while recording your screen in the browser, plus mic sync tips.',
    body: `<h1>How to record your screen with a webcam</h1>
<p>Free Screen Recorder supports an optional <strong>Webcam PiP</strong> (picture-in-picture) overlay on top of your screen capture—useful for tutorials and demos.</p>
<h2>Enable webcam PiP</h2>
<ol>
<li>Start screen capture with <strong>Start Screen + Mic</strong>.</li>
<li>Click <strong>Webcam PiP</strong> and allow camera access when prompted.</li>
<li>A floating camera window appears over the preview. Position yourself and verify lighting.</li>
<li>Record clips as usual with <strong>Start Clip</strong>.</li>
</ol>
<h2>Sync microphone audio</h2>
<p>Camera previews can lag behind audio. Use <strong>Mic offset (ms)</strong> on the right panel (default 120ms) and click <strong>Set</strong> while capture is idle to line up voice with the PiP feed.</p>
<h2>Limits</h2>
<p>PiP and dual capture are demanding. Close unused tabs. On phones, camera + screen capture may be unsupported—use a desktop Chromium browser for reliable results.</p>
<p>Return to the <a href="/">recorder</a> when you are ready.</p>`,
  },
];

for (const p of pages) {
  const outDir = path.join(root, p.dir);
  fs.mkdirSync(outDir, { recursive: true });
  const html = pageShell({
    title: p.title,
    description: p.description,
    path: p.path,
    bodyHtml: p.body,
  });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('Wrote', p.dir + '/index.html');
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Free Screen Recorder really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There is no subscription, watermark, or time limit. Export stays in your browser as WebM.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does my video get uploaded?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Capture, editing, and export run locally. Project files download as JSON on your device only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which browsers work best?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Modern Chromium browsers on desktop are recommended. Safari and Firefox may lack full export or PiP support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I record on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Layout works at mobile widths, but most phones block full screen capture in the browser. Use desktop for recording.',
      },
    },
  ],
};

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Screen Recorder',
  operatingSystem: 'Any (Chromium desktop recommended)',
  applicationCategory: 'MultimediaApplication',
  browserRequirements: 'Requires HTTPS or localhost; Chromium recommended for export and PiP.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Screen and microphone capture in the browser',
    'Trim, reorder, and title cards',
    'Webcam picture-in-picture',
    'WebM export without a server',
    'Local project save and load',
  ],
  url: HOST + '/',
};

console.log('Static pages built. Patch index.html JSON-LD manually or via separate step.');
console.log('FAQ JSON snippet for index:', JSON.stringify([webAppLd, faqLd], null, 2));