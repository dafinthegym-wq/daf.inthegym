/* Renderiza la página a HTML en el momento de compilar (prerender para Google). */
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export function render(lang) {
  return renderToString(<App initialLang={lang} />);
}

export { STRINGS } from "./i18n.jsx";
