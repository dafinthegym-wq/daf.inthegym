/* =========================================================
   CONFIGURACIÓN SEO — edita estos datos si cambian
   ========================================================= */

// Dominio oficial de la web (sin "/" al final). Se usa en canonical, hreflang, sitemap,
// robots.txt, Open Graph y datos estructurados. Solo cámbialo si cambia el dominio.
export const SITE_URL = (process.env.SITE_URL || "https://dafinthegym.com").replace(/\/$/, "");

// Código de verificación de Google Search Console (opcional).
// Search Console → Añadir propiedad → "Prefijo de URL" → método "Etiqueta HTML":
// copia SOLO el valor de content="...". Déjalo vacío si verificas por DNS.
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || "";

export const BUSINESS = {
  name: "DAF · daf.inthegym",
  shortName: "DAF",
  phone: "+1-786-546-5851",
  city: "Miami",
  region: "FL",
  country: "US",
  // Coordenadas aproximadas del área de servicio (centro de Miami)
  geo: { lat: 25.7617, lng: -80.1918 },
  sameAs: [
    "https://www.instagram.com/daf.inthegym/",
    "https://www.facebook.com/share/1BNgyXbZkY/",
    "https://www.tiktok.com/@daf_fitness",
    "https://wa.me/17865465851",
  ],
};

export const PAGES = {
  es: {
    path: "/",
    locale: "es_US",
    title: "Entrenador Personal en Miami · Transformación 90 Días | DAF",
    description:
      "Entrenador personal en Miami para mujeres de 30+: pierde grasa abdominal con la Transformación de 90 días o coaching online. Evaluación gratis.",
    ogAlt: "DAF, entrenador personal en Miami: Transformación 90 días y coaching online",
  },
  en: {
    path: "/en/",
    locale: "en_US",
    title: "Personal Trainer in Miami · 90-Day Transformation | DAF",
    description:
      "Personal trainer in Miami for women 30+: lose belly fat with the 90-Day Transformation or online coaching. Free assessment.",
    ogAlt: "DAF, personal trainer in Miami: 90-Day Transformation and online coaching",
  },
};
