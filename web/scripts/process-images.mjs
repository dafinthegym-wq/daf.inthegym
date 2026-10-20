// Prepara las fotos para la web.
// 1. (Opcional) Las versiones mejoradas con IA (Real-ESRGAN x4) van en ../assets/img/ia/<nombre>.webp
// 2. Este script mezcla la versión IA con la original reescalada (para conservar textura natural),
//    aplica un enfoque suave y exporta a WebP a 2x del tamaño original.
// Uso: npm run images
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, "../../assets/img");
const ai = path.join(src, "ia");
const out = path.resolve(here, "../public/img");

// nombre → peso de la versión IA (0 = sin IA; en fotos de grupo la IA deforma caras pequeñas)
const photos = {
  "daf-retrato": 0.7,
  "daf-gym": 0.7,
  "daf-exterior": 0.65,
  "daf-2005-2024": 0.6,
  "grupo": 0,
  "resultado-eilen": 0.55,
  "resultado-sydney": 0.55,
  "resultado-genesis": 0.55,
  "resultado-dia21": 0.55,
  // portadas de los reels de Instagram (ver src/config.js → INSTAGRAM_POSTS)
  "ig-1": 0.5, "ig-2": 0.5, "ig-3": 0.5, "ig-4": 0.5, "ig-5": 0.5, "ig-6": 0.5, "ig-7": 0.5, "ig-8": 0.5,
};

// recorte de bordes negros (en píxeles de la imagen original): [izquierda, arriba, derecha, abajo]
const crops = {
  "resultado-eilen": [67, 0, 611, 679],
  "resultado-sydney": [12, 12, 660, 640],
  "resultado-genesis": [0, 16, 679, 643],
  "resultado-dia21": [17, 85, 662, 594],
};

// ancho máximo final (px) según el tamaño en pantalla × 2 para pantallas retina
const maxWidth = (name) => (name.startsWith("ig-") ? 600 : name.startsWith("resultado-") ? 1000 : 1400);

for (const [name, weight] of Object.entries(photos)) {
  const input = path.join(src, `${name}.jpg`);
  const { width, height } = await sharp(input).metadata();
  const W = width * 2, H = height * 2;

  const base = await sharp(input).resize(W, H, { kernel: "lanczos3" }).median(3).removeAlpha().raw().toBuffer();
  let pixels = base;

  const aiFile = path.join(ai, `${name}.webp`);
  if (weight > 0 && existsSync(aiFile)) {
    const up = await sharp(aiFile).resize(W, H, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer();
    pixels = Buffer.alloc(base.length);
    for (let i = 0; i < base.length; i++) pixels[i] = Math.round(up[i] * weight + base[i] * (1 - weight));
  }

  let img = sharp(pixels, { raw: { width: W, height: H, channels: 3 } });
  if (crops[name]) {
    const [l, t, r, b] = crops[name];
    img = sharp(await img.extract({ left: l * 2, top: t * 2, width: (r - l + 1) * 2, height: (b - t + 1) * 2 }).png().toBuffer());
  }
  img = sharp(await img.png().toBuffer()).resize({ width: maxWidth(name), withoutEnlargement: true, kernel: "lanczos3" });
  await img
    .sharpen({ sigma: 0.9, m1: 0.5, m2: 1.6 })
    .modulate({ saturation: 1.05 })
    .webp({ quality: 80, effort: 6, smartSubsample: true })
    .toFile(path.join(out, `${name}.webp`));
  console.log("✔", name, `${width}x${height} → ${W}x${H}`, weight > 0 && existsSync(aiFile) ? `(IA ${Math.round(weight * 100)}%)` : "(sin IA)");
}
