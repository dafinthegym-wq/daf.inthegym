# DAF · daf.inthegym (React)

Sitio hecho con React + Vite, con animaciones de Framer Motion y scroll suave con Lenis.
Al compilar, cada idioma se genera como HTML completo (prerender) para que Google lea todo el contenido.

## Verlo en tu computadora
```bash
cd web
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

## Publicarlo

### Opción recomendada: Netlify conectado a GitHub
1. Sube la carpeta `daf.inthegym` a un repositorio de GitHub.
2. En app.netlify.com → **Add new site → Import an existing project** → elige el repositorio.
3. Netlify lee `netlify.toml` (en la raíz) y usa todo solo: carpeta `web`, comando `npm run build`, publicación `dist`.
4. En Netlify → Domain management → **Add a domain** → `dafinthegym.com` (márcalo como Primary domain).
   El dominio está en Squarespace: en Squarespace → Dominios → DNS, apunta el registro **A** de `@` a `75.2.60.5`
   y el **CNAME** `www` a `<tu-sitio>.netlify.app` (o cambia los nameservers a los de Netlify). Netlify activa HTTPS solo.

### Opción manual: arrastrar y soltar
`npm run build` y arrastra la carpeta `dist/` a app.netlify.com/drop. El dominio `https://dafinthegym.com`
ya está configurado en `seo.config.mjs`.

## SEO (Google)
Ya está configurado:
- HTML prerenderizado de `/` (español) y `/en/` (inglés), con `hreflang` entre ambos.
- Título, descripción, canonical, robots, Open Graph y Twitter (imágenes `og-es.jpg` / `og-en.jpg` de 1200×630).
- Datos estructurados (schema.org): negocio local en Miami, servicios, sitio web y preguntas frecuentes.
- `robots.txt` y `sitemap.xml` generados en cada compilación.
- Favicon, ícono de iPhone/Android y `manifest.webmanifest`.
- Fotos optimizadas, fuentes servidas desde la propia web y caché configurada en `netlify.toml`.

Los textos SEO (título y descripción de Google) y los datos del negocio están en **`seo.config.mjs`**.

### Dar de alta en Google (después de publicar)
1. Entra a **search.google.com/search-console** → *Añadir propiedad*.
   - Con dominio propio: tipo **Dominio** y verifica con el registro DNS que te indica.
   - Con dirección de Netlify: tipo **Prefijo de URL**, método **Etiqueta HTML**; copia el valor `content="…"`
     en `GOOGLE_SITE_VERIFICATION` de `seo.config.mjs` y vuelve a publicar.
2. En Search Console → **Sitemaps** → escribe `sitemap.xml` → Enviar.
3. En **Inspección de URL** pega la dirección principal y la de `/en/` → *Solicitar indexación*.
4. (Muy recomendado para Miami) Crea el perfil gratuito en **business.google.com** como entrenador personal,
   con zona de servicio Miami, el teléfono y el enlace a la web. Es lo que más ayuda a salir en búsquedas locales y en Maps.
5. (Opcional) En **bing.com/webmasters** importa el sitio desde Search Console.

Para revisar: **search.google.com/test/rich-results** (datos estructurados) y **pagespeed.web.dev** (velocidad).

## Idiomas (español / inglés)
Todos los textos de la página están en `src/i18n.jsx`, en español (`es`) y en inglés (`en`).
Si cambias un texto, cámbialo en los dos idiomas.
- Español en `/` e inglés en `/en/` (así Google indexa cada idioma por separado).
- El visitante cambia de idioma con el botón **ES / EN**; la dirección cambia sola y la página recuerda su elección.
- La primera vez, a las personas se les muestra según el idioma de su teléfono/PC.

## Qué editar
Todo lo configurable está en `src/config.js`:
- **Instagram**: publicaciones en `INSTAGRAM_POSTS` (o feed automático con `BEHOLD_FEED_URL`).
- **Testimonios**: añade reseñas reales en `TESTIMONIALS`.
- **WhatsApp y redes**: `WHATSAPP` y `SOCIAL`.

## Fotos e íconos
- Las fotos finales están en `public/img/`. Si consigues fotos nuevas, ponlas en `../assets/img/` (en .jpg),
  añade el nombre a la lista de `scripts/process-images.mjs` y ejecuta `npm run images`.
- Foto del inicio: Pexels #29224211 (foad shariyati), licencia Pexels (uso gratuito, sin atribución obligatoria).
- Si cambias el logo o la foto del inicio, ejecuta `npm run icons` para regenerar íconos e imágenes para compartir.

## Fuentes
La fuente de los títulos (Archivo) está recortada en `public/fonts/archivo-sub.woff2` (88 KB → 41 KB) para que cargue rápido en celular.
Si agregas textos con caracteres que no estaban (por ejemplo otro idioma), regénerala con
[fonttools](https://github.com/fonttools/fonttools) (`varLib.instancer` + `subset`) a partir de
`node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2`.
