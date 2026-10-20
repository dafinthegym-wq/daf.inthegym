# daf.inthegym — sitio web de DAF

Sitio de DAF, entrenador personal en Miami: **https://dafinthegym.com**
Diseño y desarrollo: DLT Development.

## Estructura
| Carpeta | Contenido |
|---|---|
| `web/` | Sitio web (React + Vite). Instrucciones en [`web/README.md`](web/README.md). |
| `netlify.toml` | Configuración de publicación en Netlify (usa `web/` como base). |
| `assets/` | Fotos originales y versiones mejoradas con IA (fuente para `npm run images`). |
| `logo-daf/` | Kit de logos (SVG, PNG y guía de marca en PDF). |
| `logos-cliente/` | Los 3 logos principales en PNG. |
| `reel/fuente/` | Scripts para generar el reel de Instagram (el video no se incluye por tamaño). |
| `version-anterior/` | Primera versión estática del sitio (solo referencia). |

## Desarrollo rápido
```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # genera web/dist con HTML prerenderizado para SEO
```
