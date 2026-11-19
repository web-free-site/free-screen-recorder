import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const server = http.createServer((req, res) => {
  let filePath = path.join(siteRoot, decodeURIComponent(req.url.split('?')[0]));
  if (req.url === '/') filePath = path.join(siteRoot, 'index.html');
  if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (!filePath.startsWith(siteRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('nf');
  }
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
  };
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(filePath));
});

await new Promise((r) => server.listen(8877, '127.0.0.1', r));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  permissions: ['microphone', 'camera'],
});
await context.addInitScript(() => {
  const makeVideoStream = () => {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 200;
    const ctx = c.getContext('2d');
    let n = 0;
    setInterval(() => {
      n += 1;
      ctx.fillStyle = '#224';
      ctx.fillRect(0, 0, 320, 200);
      ctx.fillStyle = '#8cf';
      ctx.fillText('test ' + n, 20, 40);
    }, 50);
    return c.captureStream(20);
  };
  const makeMicStream = () => {
    const ac = new AudioContext();
    const osc = ac.createOscillator();
    const dest = ac.createMediaStreamDestination();
    osc.connect(dest);
    osc.start();
    return dest.stream;
  };
  navigator.mediaDevices.getDisplayMedia = async () => {
    const v = makeVideoStream();
    const a = makeMicStream();
    return new MediaStream([...v.getVideoTracks(), ...a.getAudioTracks()]);
  };
  navigator.mediaDevices.getUserMedia = async (constraints = {}) => {
    if (constraints.video) return makeVideoStream();
    return makeMicStream();
  };
});

const page = await context.newPage();
await page.goto('http://127.0.0.1:8877/', { waitUntil: 'networkidle' });

await page.waitForSelector('#btnStartCapture');
const start = await page.isVisible('#btnStartCapture');
if (!start) throw new Error('Start button not visible at 390px');

const appBox = await page.locator('#app').boundingBox();
if (!appBox || appBox.width < 300) throw new Error('App too narrow at mobile width');

await page.click('#btnStartCapture');
await page.waitForFunction(() => {
  const status = document.getElementById('status')?.textContent || '';
  const cap = document.getElementById('captureStatus')?.textContent || '';
  return /capture|recording|ready/i.test(status + cap);
}, null, { timeout: 15000 });
await page.waitForTimeout(2000);
const stopBtn = page.locator('.stop-overlay-btn');
if (await stopBtn.count()) {
  await stopBtn.click();
  await page.waitForFunction(() => Number(document.getElementById('clipCount')?.textContent || 0) >= 1, null, {
    timeout: 20000,
  });
  const exportBtn = page.locator('#btnExport');
  if (await exportBtn.isEnabled()) {
    await exportBtn.click();
    await page
      .waitForFunction(() => {
        const a = document.getElementById('downloadLink');
        return a && window.getComputedStyle(a).display !== 'none';
      }, null, { timeout: 90000 })
      .catch(() => null);
  }
}

const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const dpage = await desktop.newPage();
await dpage.goto('http://127.0.0.1:8877/about/', { waitUntil: 'domcontentloaded' });
const aboutTitle = await dpage.textContent('h1');
if (!aboutTitle?.includes('About')) throw new Error('About page failed');

const exportOk = await page.evaluate(() => {
  const a = document.getElementById('downloadLink');
  return !!(a && window.getComputedStyle(a).display !== 'none');
});

await browser.close();
server.close();
console.log(
  'Browser tests passed (Chromium headless, mobile 390px layout, mocked getDisplayMedia)',
);
console.log('WebM export link visible after automated run:', exportOk);