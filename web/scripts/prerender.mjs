// Después de compilar: genera el HTML completo de cada idioma (para que Google lea todo
// el contenido sin ejecutar JavaScript), las etiquetas SEO, robots.txt y sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { SITE_URL, GOOGLE_SITE_VERIFICATION, BUSINESS, PAGES } from "../seo.config.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "../dist");
const ssrDir = path.resolve(here, "../dist-ssr");
const { render, STRINGS } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

let template = readFileSync(path.join(dist, "index.html"), "utf8");
// Precarga de las fuentes que se ven en la primera pantalla
{
  const { readdirSync } = await import("node:fs");
    const wanted = [/^anton-latin-400-normal-.*\.woff2$/, /^inter-latin-400-normal-.*\.woff2$/];
  const files = readdirSync(path.join(dist, "assets")).filter((f) => wanted.some((r) => r.test(f)));
  const tags = ["/fonts/archivo-sub.woff2", ...files.map((f) => `/assets/${f}`)]
    .map((h) => `<link rel="preload" as="font" type="font/woff2" href="${h}" crossorigin />`).join("\n    ");
  template = template.replace("<!--/seo-->", "<!--/seo-->\n    " + tags);
}
const today = new Date().toISOString().slice(0, 10);
const abs = (p) => SITE_URL + p;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

if (SITE_URL.includes("localhost")) {
  console.warn("\n⚠  SITE_URL no está configurado: se usará " + SITE_URL + ".\n   En Netlify se detecta solo; en otro hosting define SITE_URL (ver seo.config.mjs).\n");
}

function jsonLd(lang) {
  const page = PAGES[lang];
  const t = STRINGS[lang];
  const url = abs(page.path);
  const graph = [
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL + "/",
      name: BUSINESS.name,
      inLanguage: ["es", "en"],
    },
    {
      "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
      "@id": SITE_URL + "/#business",
      name: BUSINESS.name,
      alternateName: "daf.inthegym",
      description: page.description,
      url: SITE_URL + "/",
      image: abs("/og-" + lang + ".jpg"),
      logo: abs("/icon-512.png"),
      telephone: BUSINESS.phone,
      address: { "@type": "PostalAddress", addressLocality: BUSINESS.city, addressRegion: BUSINESS.region, addressCountry: BUSINESS.country },
      geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
      areaServed: [{ "@type": "City", name: "Miami" }, { "@type": "Place", name: lang === "en" ? "Online (worldwide)" : "Online (todo el mundo)" }],
      sameAs: BUSINESS.sameAs,
      knowsLanguage: ["es", "en"],
      knowsAbout: t.topics.items.map((x) => x.title),
      slogan: t.preloader.tagline,
      makesOffer: t.services.items.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.text, serviceType: lang === "en" ? "Personal training" : "Entrenamiento personal", areaServed: "Miami, FL", provider: { "@id": SITE_URL + "/#business" } },
      })),
    },
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: page.title,
      description: page.description,
      inLanguage: lang,
      isPartOf: { "@id": SITE_URL + "/#website" },
      about: { "@id": SITE_URL + "/#business" },
      primaryImageOfPage: abs("/og-" + lang + ".jpg"),
    },
    {
      "@type": "FAQPage",
      "@id": url + "#faq",
      inLanguage: lang,
      mainEntity: t.faq.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

function head(lang) {
  const page = PAGES[lang];
  const url = abs(page.path);
  const other = lang === "es" ? "en" : "es";
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${abs(PAGES.es.path)}" />`,
    `<link rel="alternate" hreflang="en" href="${abs(PAGES.en.path)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${abs(PAGES.es.path)}" />`,
    GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(GOOGLE_SITE_VERIFICATION)}" />` : "",
    `<meta name="geo.region" content="US-FL" />`,
    `<meta name="geo.placename" content="Miami" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${page.locale}" />`,
    `<meta property="og:locale:alternate" content="${PAGES[other].locale}" />`,
    `<meta property="og:image" content="${abs("/og-" + lang + ".jpg")}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(page.ogAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${abs("/og-" + lang + ".jpg")}" />`,
    `<script type="application/ld+json">${jsonLd(lang)}</script>`,
  ].filter(Boolean).join("\n    ");
}

for (const lang of ["es", "en"]) {
  const app = render(lang);
  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${head(lang)}\n    <!--/seo-->`)
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`);
  if (!html.includes(app.slice(0, 40))) throw new Error("No se pudo insertar el HTML prerenderizado");
  const out = lang === "es" ? dist : path.join(dist, "en");
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, "index.html"), html);
  console.log(`✔ ${PAGES[lang].path} prerenderizada (${Math.round(html.length / 1024)} KB)`);
}

writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);

const urls = ["es", "en"].map((lang) => `  <url>
    <loc>${abs(PAGES[lang].path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${lang === "es" ? "1.0" : "0.9"}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${abs(PAGES.es.path)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${abs(PAGES.en.path)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(PAGES.es.path)}" />
    <image:image><image:loc>${abs("/og-" + lang + ".jpg")}</image:loc></image:image>
  </url>`).join("\n");
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`);
console.log("✔ robots.txt y sitemap.xml para " + SITE_URL);
rmSync(ssrDir, { recursive: true, force: true });
