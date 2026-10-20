// Graba la web real fotograma a fotograma con un reloj virtual (30 fps exactos, animaciones reales).
// Uso: node record.cjs <phone|desktop>
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const MODE = process.argv[2] || 'phone';
const FPS = 30, DT = 1000 / FPS, SLOT = 220; // ms reales por fotograma (constante)
const cfg = MODE === 'phone'
  ? { w: 390, h: 844, dsf: 2.4, mobile: true, quick: false, plan: [
      ['hold', 3.4],
      ['#servicios', -40, 2.4], ['hold', 1.8],
      ['#resultados', 60, 2.0], ['by', 1300, 3.4], ['hold', 0.8],
      ['#sobre-mi', 380, 2.2], ['hold', 1.8],
      ['#online', 0, 2.2], ['by', 720, 2.8], ['hold', 0.8],
      ['#instagram', -20, 2.0], ['hold', 1.6],
    ] }
  : { w: 1440, h: 900, dsf: 1.5, mobile: false, quick: true, plan: [
      ['hold', 2.6],
      ['#servicios', 120, 2.4], ['hold', 1.4],
      ['#resultados', 0, 2.0], ['by', 900, 2.6], ['hold', 0.4],
      ['#sobre-mi', 80, 2.2], ['hold', 1.2],
    ] };

const SHIM = `(() => {
  let now = 0; const t0 = Date.now();
  const rafs = new Map(); let rid = 0;
  const timers = new Map(); let tid = 0;
  window.requestAnimationFrame = (cb) => { rafs.set(++rid, cb); return rid; };
  window.cancelAnimationFrame = (id) => { rafs.delete(id); };
  window.setTimeout = (fn, d, ...a) => { timers.set(++tid, { t: now + (+d || 0), fn, a }); return tid; };
  window.clearTimeout = (id) => { timers.delete(id); };
  window.setInterval = (fn, d, ...a) => { const id = ++tid; timers.set(id, { t: now + (+d || 1), fn, a, iv: (+d || 1) }); return id; };
  window.clearInterval = (id) => { timers.delete(id); };
  performance.now = () => now;
  Date.now = () => t0 + now;
  window.__vnow = () => now;
  window.__advance = (ms) => {
    const end = now + ms;
    for (let guard = 0; guard < 500; guard++) {
      let best = null;
      for (const [id, x] of timers) if (x.t <= end && (!best || x.t < best[1].t)) best = [id, x];
      if (!best) break;
      const [id, x] = best; now = Math.max(now, x.t);
      if (x.iv) x.t += x.iv; else timers.delete(id);
      try { typeof x.fn === 'function' && x.fn(...x.a); } catch (e) {}
    }
    now = end;
    const cbs = [...rafs.values()]; rafs.clear();
    for (const cb of cbs) { try { cb(now); } catch (e) {} }
  };
})();`;

(async () => {
  const out = path.join(__dirname, 'frames-' + MODE);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 300000, args: ['--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: cfg.w, height: cfg.h, deviceScaleFactor: cfg.dsf, isMobile: cfg.mobile, hasTouch: cfg.mobile });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  // 1) visita previa para dejar todo en caché (fotos, fuentes)
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  for (let y = 0; y < 20000; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 40)); }
  await new Promise((r) => setTimeout(r, 1500));
  // 2) grabación con reloj virtual
  await p.evaluateOnNewDocument(SHIM);
  await p.evaluateOnNewDocument((quick) => { try { if (quick) sessionStorage.setItem('daf-seen', '1'); else sessionStorage.removeItem('daf-seen'); } catch (e) {} }, cfg.quick);
  const cdp = await p.target().createCDPSession();
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: DT / SLOT }); // animaciones CSS/WAAPI al mismo ritmo
  await p.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => window.scrollTo(0, 0));

  // convertir el plan en acciones por fotograma
  const actions = []; let f = 0;
  for (const step of cfg.plan) {
    if (step[0] === 'hold') { f += Math.round(step[1] * FPS); continue; }
    if (step[0] === 'by') { actions.push({ f, by: step[1], dur: step[2] }); f += Math.round(step[2] * FPS); continue; }
    actions.push({ f, sel: step[0], off: step[1], dur: step[2] }); f += Math.round(step[2] * FPS);
  }
  const total = f;
  console.log(MODE, 'fotogramas:', total, '(' + (total / FPS).toFixed(1) + ' s)');
  let ai = 0;
  for (let i = 0; i < total; i++) {
    const t0 = Date.now();
    while (ai < actions.length && actions[ai].f === i) {
      const a = actions[ai++];
      await p.evaluate((a) => {
        const L = window.__lenis;
        let y = a.by != null ? window.scrollY + a.by : document.querySelector(a.sel).getBoundingClientRect().top + window.scrollY + a.off;
        if (L) L.scrollTo(y, { duration: a.dur, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
        else window.scrollTo(0, y);
      }, a);
    }
    await p.evaluate((dt) => window.__advance(dt), DT);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 90 });
    const spent = Date.now() - t0;
    if (spent < SLOT) await new Promise((r) => setTimeout(r, SLOT - spent));
    if (i % 60 === 0) console.log(' ', i, '/', total, 'real', spent, 'ms');
  }
  await b.close();
})();
