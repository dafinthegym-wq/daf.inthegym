# DAF · daf.inthegym — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias de compilación). Abre `index.html` en el navegador o súbelo tal cual a Netlify, Vercel, GitHub Pages o cualquier hosting.

## Estructura
```
index.html              Página única con todas las secciones
assets/css/styles.css   Estilos y animaciones
assets/js/config.js     ← lo único que necesitas editar (Instagram, testimonios, WhatsApp)
assets/js/main.js       Interacciones (scroll reveal, parallax, contadores, feed, formulario)
assets/img/             Fotos y logo nuevo (logo-icon.svg, logo-full.svg)
```

## Feed de Instagram (se actualiza solo)
Edita `assets/js/config.js` → `instagram` y rellena **una** opción:

1. **Behold (recomendado)**: crea un feed JSON en https://behold.so conectado a @daf.inthegym y pega la URL en `beholdFeedUrl`. El token queda en Behold, no en tu web.
2. **Elfsight**: pega el ID del widget en `elfsightAppId`.
3. **Instagram Graph API**: pega un token de larga duración en `graphAccessToken`. Caduca cada 60 días y queda visible en el código.

Si no hay nada configurado, se muestran fotos de respaldo que enlazan al perfil.

## Testimonios
Añade reseñas reales en `testimonials` dentro de `config.js`. Mientras esté vacío, el carrusel no aparece.

## Pendiente de confirmar
- Certificaciones del coach (no se incluyeron porque el material original las marcaba "por confirmar").
- Garantía del programa de 90 días (tampoco estaba definida).
- Las fotos son las extraídas del HTML de referencia; sustitúyelas en `assets/img/` manteniendo el nombre.
