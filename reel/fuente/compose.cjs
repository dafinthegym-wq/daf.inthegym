// Renderiza el reel (1080×1920, 30 fps) y lo une con la música.
// Uso: node compose.cjs                → video completo
//      node compose.cjs preview 3 12 … → hoja de vista previa en esos segundos
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');

const FPS = 30, DUR = 58;
const AUDIO_SRC = path.join(__dirname, 'mixkit', '126.mp3'); // Mixkit: "Trap Electro Vibes" (licencia gratuita de Mixkit)
const AUDIO_OFFSET = 5.6; // el drop de la canción (12,1 s) cae en el segundo 6,5 del video
const dir = __dirname;
const toUrl = (f) => 'file:///' + f.split(String.fromCharCode(92)).join('/');
const phoneFrames = fs.readdirSync(path.join(dir, 'frames-phone')).sort();
const lapFrames = fs.readdirSync(path.join(dir, 'frames-desktop')).sort();

const map = (t, a, b, list, start = 0) => {
  const p = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return list[Math.min(list.length - 1, start + Math.round(p * (list.length - 1 - start)))];
};
const phoneAt = (t) => path.join(dir, 'frames-phone', map(t, 6.3, 30.0, phoneFrames));
const lapAt = (t) => path.join(dir, 'frames-desktop', map(t, 29.4, 40.9, lapFrames, 27));

(async () => {
  const preview = process.argv[2] === 'preview';
  const times = preview ? process.argv.slice(3).map(Number) : null;
  const out = path.join(dir, 'out');
  if (!preview) { fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true }); }
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', protocolTimeout: 300000, args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await p.goto(toUrl(path.join(dir, 'composer.html')), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const shots = [];
  const list = preview ? times : Array.from({ length: DUR * FPS }, (_, i) => i / FPS);
  for (let k = 0; k < list.length; k++) {
    const t = list[k];
    await p.evaluate((t, a, c) => window.render(t, a, c), t, toUrl(phoneAt(t)), toUrl(lapAt(t)));
    if (preview) shots.push(await sharp(await p.screenshot()).resize(process.env.BIG ? 1080 : 360).toBuffer());
    else {
      await p.screenshot({ path: path.join(out, String(k).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 93 });
      if (k % 150 === 0) console.log(' ', t.toFixed(1), 's');
    }
  }
  await b.close();
  if (preview) {
    await sharp({ create: { width: shots.length * (process.env.BIG ? 1086 : 366), height: process.env.BIG ? 1920 : 640, channels: 3, background: '#f00' } })
      .composite(shots.map((s, i) => ({ input: s, left: i * (process.env.BIG ? 1086 : 366), top: 0 }))).jpeg({ quality: 85 }).toFile(path.join(dir, 'preview.jpg'));
    return;
  }
  const final = path.join(dir, 'reel-dlt-x-dafinthegym.mp4');
  execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(out, '%04d.jpg'),
    '-ss', String(AUDIO_OFFSET), '-t', String(DUR), '-i', AUDIO_SRC,
    '-filter_complex', `[1:a]afade=t=in:st=0:d=0.3,afade=t=out:st=${DUR - 2.6}:d=2.6,loudnorm=I=-14:TP=-1:LRA=11[a]`,
    '-map', '0:v', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
    '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });
  console.log('VIDEO:', final);
})();
