// Genera favicons, íconos de app (iPhone/Android) e imágenes para compartir en redes (1200×630).
// Uso: npm run icons
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.resolve(here, "../public");

const mark = (fill = "#F4F6FA") => `
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3FB0FF"/><stop offset="1" stop-color="#1257E6"/></linearGradient></defs>
  <path d="M22 22.5 L20.5 13 L27 17.5 L32.5 9.5 L37.5 17.5 L44.5 13 L42.5 22.5 Z" fill="url(#g)"/>
  <rect x="3" y="31" width="11" height="3.2" rx="1.6" fill="url(#g)"/>
  <rect x="5" y="38.4" width="8" height="3.2" rx="1.6" fill="url(#g)" opacity=".8"/>
  <rect x="7" y="45.8" width="5" height="3.2" rx="1.6" fill="url(#g)" opacity=".6"/>
  <path fill="${fill}" fill-rule="evenodd" d="M19.5 26 H38 C47 26 51.5 31.5 49.6 39.5 L49.2 41.2 C47.4 49 41.4 54 33 54 H13.2 Z M27.8 33.5 L24.7 46.5 H31.6 C35.6 46.5 38.4 44.3 39.3 40.6 L39.6 39.3 C40.4 35.6 38.8 33.5 35 33.5 Z"/>`;

// Ícono cuadrado con fondo (para apps): el logo ocupa ~70% (zona segura para íconos "maskable")
const appIcon = (size, pad = 0.15) => {
  const inner = size * (1 - pad * 2);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#07080B"/>
    <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.45}" fill="#1257E6" opacity="0.18"/>
    <svg x="${size * pad}" y="${size * pad}" width="${inner}" height="${inner}" viewBox="0 0 64 64">${mark()}</svg>
  </svg>`);
};

// favicon.svg con fondo oscuro: Google lo pone sobre un círculo blanco y el logo transparente (D blanca) no se veía
writeFileSync(path.join(pub, "favicon.svg"), appIcon(64, 0.06).toString());
await sharp(appIcon(512, 0.16)).png().toFile(path.join(pub, "icon-512.png"));
await sharp(appIcon(192, 0.16)).png().toFile(path.join(pub, "icon-192.png"));
await sharp(appIcon(180, 0.12)).png().toFile(path.join(pub, "apple-touch-icon.png"));
await sharp(appIcon(48, 0.06)).png().toFile(path.join(pub, "favicon-48.png"));
// favicon.ico con 16, 32 y 48 px (PNG dentro de ICO). Google pide mínimo 48×48 para el ícono del buscador
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(appIcon(s, s <= 32 ? 0.04 : 0.06)).png().toBuffer()));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(pngs[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([head, ...pngs]));

// Imagen para compartir (WhatsApp, Facebook, Google…): 1200×630
const og = async (lang) => {
  const txt = lang === "en"
    ? { k: "PERSONAL TRAINER · MIAMI &amp; ONLINE", a: "YOU PUT IN THE WORK.", b: "I BUILD THE PLAN.", c: "90-Day Transformation · Online coaching" }
    : { k: "ENTRENADOR PERSONAL · MIAMI &amp; ONLINE", a: "TÚ PONES EL TRABAJO.", b: "YO CONSTRUYO EL PLAN.", c: "Transformación 90 días · Coaching online" };
  const bg = await sharp(readFileSync(path.join(pub, "img/hero-gym.webp")))
    .resize(1200, 630, { fit: "cover", position: "top" }).modulate({ brightness: 0.7 }).toBuffer();
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#060709" stop-opacity="0.95"/><stop offset="0.62" stop-color="#060709" stop-opacity="0.55"/><stop offset="1" stop-color="#060709" stop-opacity="0.1"/></linearGradient>
      <linearGradient id="blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4DB8FF"/><stop offset="1" stop-color="#1E7BFF"/></linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#fade)"/>
    <svg x="70" y="62" width="76" height="76" viewBox="0 0 64 64">${mark()}</svg>
    <text x="160" y="118" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="40" fill="#F4F6FA">DAF<tspan fill="#4DB8FF">.</tspan><tspan font-size="22" fill="#9FB3CC" dx="8" letter-spacing="4">INTHEGYM</tspan></text>
    <text x="72" y="268" font-family="Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="4" fill="#4DB8FF">${txt.k}</text>
    <text x="68" y="350" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="66" fill="#F4F6FA">${txt.a}</text>
    <text x="68" y="428" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="66" fill="url(#blue)">${txt.b}</text>
    <text x="72" y="500" font-family="Arial, sans-serif" font-size="28" fill="#C3CAD6">${txt.c}</text>
    <rect x="72" y="540" width="330" height="56" rx="28" fill="#1E7BFF"/>
    <text x="237" y="576" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#fff">${lang === "en" ? "Free assessment →" : "Evaluación gratis →"}</text>
  </svg>`);
  await sharp(bg).composite([{ input: overlay }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(pub, `og-${lang}.jpg`));
};
await og("es");
await og("en");
console.log("✔ íconos e imágenes para compartir generados");
