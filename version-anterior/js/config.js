/* =========================================================
   CONFIGURACIÓN DEL SITIO — edita solo este archivo
   ========================================================= */
window.DAF_CONFIG = {
  whatsapp: "17865465851",

  /* ---------------------------------------------------------
     FEED DE INSTAGRAM (se actualiza solo cuando publicas)
     Rellena UNA de las tres opciones. Se usa la primera que
     tenga valor. Si todas están vacías, se muestran fotos de
     respaldo que enlazan a tu perfil.
     --------------------------------------------------------- */
  instagram: {
    profileUrl: "https://www.instagram.com/daf.inthegym/",
    postsToShow: 8,

    // OPCIÓN 1 (recomendada) · Behold.so — gratis, sin exponer tokens.
    //   1) Crea una cuenta en https://behold.so y conecta @daf.inthegym
    //   2) Crea un feed tipo "JSON"
    //   3) Copia la URL del feed y pégala aquí, p. ej. "https://feeds.behold.so/AbCdEf123"
    beholdFeedUrl: "",

    // OPCIÓN 2 · Elfsight — widget visual ya diseñado por ellos.
    //   1) Crea un widget "Instagram Feed" en https://elfsight.com
    //   2) Copia el ID de la clase, p. ej. de <div class="elfsight-app-1234-abcd"> pega "1234-abcd"
    elfsightAppId: "",

    // OPCIÓN 3 · Instagram Graph API (token de larga duración).
    //   Requiere una cuenta profesional y una app en https://developers.facebook.com
    //   ("Instagram API with Instagram Login"). Pega aquí el token de larga duración.
    //   ⚠ El token es visible para cualquiera que vea el código de la página y
    //   caduca cada 60 días (se renueva con /refresh_access_token). Por eso
    //   se recomienda la Opción 1.
    graphAccessToken: ""
  },

  /* ---------------------------------------------------------
     TESTIMONIOS — añade aquí reseñas reales de clientes.
     Mientras la lista esté vacía, el carrusel no aparece.
     Ejemplo:
       { quote: "Texto de la reseña…", name: "Nombre", detail: "Transformación 90 días" }
     --------------------------------------------------------- */
  testimonials: []
};
