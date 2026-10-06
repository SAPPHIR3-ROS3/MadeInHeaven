const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const { pathToFileURL } = require('node:url');
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
 const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 await page.goto(pathToFileURL(require('node:path').resolve('index.html')).href);
 await page.waitForFunction(() => typeof Planets !== 'undefined' && Planets && Planets.every(p => p.image.complete));
 const result = await page.evaluate(async () => {
  const measure = (callback, count) => { const start = performance.now(); for(let i=0;i<count;i++) callback(); return (performance.now()-start)/count; };
  const starsMs = measure(() => StarDots.forEach(s => s.draw(ctx)), 30);
  const ring = new ZaWarudoRing(Planets[2]); ring.radius = 500;
  const ringMs = measure(() => ring.draw(ctx), 10);
  const staticSceneMs = measure(() => DrawStaticScene(ctx), 30);
  const probe = document.createElement('canvas'); probe.width = probe.height = 4;
  const probeCtx = probe.getContext('2d'); probeCtx.fillStyle = 'rgb(0, 0, 15)'; probeCtx.fillRect(0, 0, 4, 4);
  const probeRing = new ZaWarudoRing({ x: 2, y: 2 }); probeRing.radius = 10; probeRing.draw(probeCtx);
  const invertedPixel = Array.from(probeCtx.getImageData(2, 2, 1, 1).data);
  let readbacks = 0; const original = ctx.getImageData.bind(ctx); ctx.getImageData = (...args) => { readbacks++; return original(...args); };
  ZaWarudoStart(); await new Promise(resolve => setTimeout(resolve, 6500));
  const stopped = TimeStopState; ZaWarudoEnd(); await new Promise(resolve => setTimeout(resolve, 2200));
  return { starsMs, staticSceneMs, ringMs, invertedPixel, readbacks, stopped, resumed: TimeStopState, finite: Planets.every(p => Number.isFinite(p.x)) };
 });
 console.log(JSON.stringify({ ...result, errors }, null, 2));
 await browser.close();
 if(result.invertedPixel.join(',') !== '255,255,240,255' || errors.length || result.stopped !== 'stopped' || result.resumed !== 'idle' || !result.finite) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
