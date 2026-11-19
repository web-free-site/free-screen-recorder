import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredFiles = [
  'index.html',
  'main.js',
  'styles.css',
  'wf-ads.js',
  'public/ads.json',
  'sitemap.xml',
  'robots.txt',
  'about/index.html',
  'privacy/index.html',
  'terms/index.html',
  'contact/index.html',
  'how-to-record-your-screen-in-the-browser/index.html',
  'how-to-record-your-screen-with-a-webcam/index.html',
];

let failed = 0;
for (const rel of requiredFiles) {
  const p = path.join(siteRoot, rel);
  if (!fs.existsSync(p)) {
    console.error('MISSING', rel);
    failed++;
  }
}

const mainJs = fs.readFileSync(path.join(siteRoot, 'main.js'), 'utf8');
if (/\bfetch\s*\(/.test(mainJs)) {
  console.error('main.js contains fetch() — unexpected upload risk');
  failed++;
}

const indexHtml = fs.readFileSync(path.join(siteRoot, 'index.html'), 'utf8');
for (const id of ['btnStartCapture', 'btnExport', 'wf-more-tools']) {
  if (!indexHtml.includes(id)) {
    console.error('index.html missing', id);
    failed++;
  }
}

if (!indexHtml.includes('free-screen-recorder.web-free.site')) {
  console.error('index.html missing canonical host');
  failed++;
}

if (indexHtml.includes('screencap.me/')) {
  console.error('index.html still references screencap.me as canonical');
  failed++;
}

const ads = JSON.parse(fs.readFileSync(path.join(siteRoot, 'public/ads.json'), 'utf8'));
const keys = new Set(
  [
    ads.popunder?.split('/').pop(),
    ads.socialBar?.split('/').pop(),
    ads.nativeBanner?.src?.split('/').pop(),
    ads.smartlink?.url?.split('/').pop(),
    ...Object.values(ads.banners || {}).map((b) => b.key),
  ].filter(Boolean),
);
if (keys.size < 10) {
  console.error('ads.json expected 10 distinct ad keys, got', keys.size);
  failed++;
}

function request(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port: 8765, path: pathname, method: 'GET' },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }),
        );
      },
    );
    req.on('error', reject);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  let filePath = path.join(siteRoot, decodeURIComponent(req.url.split('?')[0]));
  if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (req.url === '/') filePath = path.join(siteRoot, 'index.html');
  if (!filePath.startsWith(siteRoot)) {
    res.statusCode = 403;
    return res.end('forbidden');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('not found');
  }
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(filePath));
});

await new Promise((resolve) => server.listen(8765, '127.0.0.1', resolve));

const paths = ['/', '/about/', '/public/ads.json', '/main.js'];
for (const p of paths) {
  const r = await request(p);
  if (r.status !== 200) {
    console.error('HTTP', p, r.status);
    failed++;
  }
}

server.close();

if (failed) {
  console.error('\nSmoke tests failed:', failed);
  process.exit(1);
}
console.log('Smoke tests passed');