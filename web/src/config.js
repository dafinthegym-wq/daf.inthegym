/* =========================================================
   CONFIGURACIÓN — edita solo este archivo
   ========================================================= */

export const WHATSAPP = "17865465851";

export const SOCIAL = {
  instagram: "https://www.instagram.com/daf.inthegym/",
  whatsapp: `https://wa.me/${WHATSAPP}`,
  facebook: "https://www.facebook.com/share/1BNgyXbZkY/",
  tiktok: "https://www.tiktok.com/@daf_fitness",
};

/* ---------------------------------------------------------
   PUBLICACIONES DE INSTAGRAM QUE SE MUESTRAN (en este orden)
   Para cambiar una: pon el enlace del post, su portada en
   public/img/ (ig-1.webp … ig-8.webp) y el texto en español (es) e inglés (en).
   Si dejas esta lista vacía [], se usa el feed automático de abajo.
   --------------------------------------------------------- */
export const INSTAGRAM_POSTS = [
  { url: "https://www.instagram.com/p/DdH3EzKRea1/", image: "img/ig-1.webp", caption: { es: "No estás flexible porque no trabajas tu flexibilidad.", en: "You're not flexible because you don't work on your flexibility." } },
  { url: "https://www.instagram.com/p/DbM5msesruF/", image: "img/ig-2.webp", caption: { es: "Viernes de legs en fuego.", en: "Leg day Friday on fire." } },
  { url: "https://www.instagram.com/p/DSdnvKvALf8/", image: "img/ig-3.webp", caption: { es: "¿Será cierto? ¿Qué dicen ustedes?", en: "Could it be true? What do you think?" } },
  { url: "https://www.instagram.com/p/DehdItOxwfu/", image: "img/ig-4.webp", caption: { es: "Con poca imaginación pero con mucha nutrición podemos alimentarnos adecuadamente.", en: "Not much imagination, plenty of nutrition — you can still eat right." } },
  { url: "https://www.instagram.com/p/DeaVtujRMWX/", image: "img/ig-5.webp", caption: { es: "Los rollitos no se eliminan haciendo más abdominales: necesitas una alimentación adecuada.", en: "More crunches won't get rid of belly rolls: you need the right nutrition." } },
  { url: "https://www.instagram.com/p/DeN1qKDMKBD/", image: "img/ig-6.webp", caption: { es: "Core en fuego.", en: "Core on fire." } },
  { url: "https://www.instagram.com/p/DeM4lMPxUCQ/", image: "img/ig-7.webp", caption: { es: "Lo que haces desde tus primeras horas determina tu día.", en: "What you do in your first hours sets up your whole day." } },
  { url: "https://www.instagram.com/p/DeIVRHWxaRY/", image: "img/ig-8.webp", caption: { es: "Sígueme y guarda este video para más consejos.", en: "Follow me and save this video for more tips." } },
];

/* ---------------------------------------------------------
   FEED AUTOMÁTICO DE INSTAGRAM (opcional; solo se usa si
   INSTAGRAM_POSTS está vacío). Se actualiza solo cuando DAF publica.

   Pega aquí la URL de tu feed de Behold (gratis):
     1. Entra a https://behold.so y crea una cuenta.
     2. Pulsa "Connect Instagram" e inicia sesión con @daf.inthegym.
     3. Crea un feed nuevo y elige el tipo "JSON".
     4. Copia la URL que te dan (se ve así: https://feeds.behold.so/AbC123xyz)
        y pégala entre las comillas de abajo.
   Mientras esté vacío, la sección muestra fotos de DAF que
   llevan al perfil de Instagram.
   --------------------------------------------------------- */
export const BEHOLD_FEED_URL = "";

/* ---------------------------------------------------------
   TESTIMONIOS — solo reseñas reales de clientes.
   Mientras la lista esté vacía, la sección de reseñas no aparece.
   Ejemplo:
     { quote: "Texto de la reseña", name: "Nombre", detail: "Transformación 90 días" },
   --------------------------------------------------------- */
export const TESTIMONIALS = [];

export const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
