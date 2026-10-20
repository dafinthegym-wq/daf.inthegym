import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "./ui.jsx";
import { useT } from "../i18n.jsx";

const D_PATH = "M19.5 26 H38 C47 26 51.5 31.5 49.6 39.5 L49.2 41.2 C47.4 49 41.4 54 33 54 H13.2 Z M27.8 33.5 L24.7 46.5 H31.6 C35.6 46.5 38.4 44.3 39.3 40.6 L39.6 39.3 C40.4 35.6 38.8 33.5 35 33.5 Z";
const CROWN = "M22 22.5 L20.5 13 L27 17.5 L32.5 9.5 L37.5 17.5 L44.5 13 L42.5 22.5 Z";
const WORD = "DAF.INTHEGYM";
const curtain = [0.76, 0, 0.24, 1];

/* Logo que se dibuja: contorno de la D → relleno → corona → líneas de velocidad */
function DrawnMark({ quick, speed = 1 }) {
  const s = (quick ? 0.45 : 1) * speed;
  return (
    <svg className="pl__mark" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3FB0FF" />
          <stop offset="1" stopColor="#1257E6" />
        </linearGradient>
      </defs>
      {[{ x: 3, y: 31, w: 11, o: 1 }, { x: 5, y: 38.4, w: 8, o: 0.8 }, { x: 7, y: 45.8, w: 5, o: 0.6 }].map((r, i) => (
        <motion.rect
          key={i} x={r.x} y={r.y} width={r.w} height="3.2" rx="1.6" fill="url(#plg)"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: r.o, x: 0 }}
          transition={{ duration: 0.5 * s, ease, delay: (1.25 + i * 0.09) * s }}
        />
      ))}
      <motion.path
        d={D_PATH} fill="none" stroke="#F4F6FA" strokeWidth="1.2" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 0 }}
        transition={{ pathLength: { duration: 1.1 * s, ease: "easeInOut" }, opacity: { delay: 1.15 * s, duration: 0.3 } }}
      />
      <motion.path
        d={D_PATH} fill="#F4F6FA" fillRule="evenodd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 * s, delay: 0.95 * s }}
      />
      <motion.path
        d={CROWN} fill="url(#plg)"
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ y: -22, opacity: 0, rotate: -14 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 14, delay: 1.15 * s }}
      />
    </svg>
  );
}

export default function Preloader({ onDone }) {
  const t = useT().preloader;
  // Primera visita: experiencia completa. Siguientes (misma sesión): versión corta.
  const quick = useRef((() => { try { return sessionStorage.getItem("daf-seen") === "1"; } catch { return false; } })()).current;
  // En celular la animación completa va ~40% más rápida (la página aparece antes)
  const phone = useRef(typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches).current;
  const speed = phone && !quick ? 0.6 : 1;
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try { sessionStorage.setItem("daf-seen", "1"); } catch { /* ignorar */ }
    const minTime = quick ? 800 : phone ? 1500 : 2600;
    // El tiempo cuenta desde que se abrió la página (no desde que cargó el código):
    // en celulares lentos no se espera dos veces.
    const start = phone ? Math.min(performance.now(), 900) : performance.now();
    let loaded = false;
    // Progreso real: espera la foto del inicio (con un tope por si la red es lenta)
    const img = new Image();
    img.onload = img.onerror = () => { loaded = true; };
    img.src = window.matchMedia("(max-width: 860px)").matches ? "img/hero-gym-sm.webp" : "img/hero-gym.webp";
    const cap = setTimeout(() => { loaded = true; }, phone ? 3000 : 6000);

    let id;
    const tick = (now) => {
      const p = Math.min((now - start) / minTime, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const target = loaded ? eased * 100 : Math.min(eased * 100, 88);
      // el contador se actualiza en saltos (no en cada fotograma) para no recargar el celular
      const next = Math.round(target / 4) * 4;
      setCount((c) => (next > c ? next : c));
      if (p >= 1 && loaded) {
        setCount(100);
        setWord(t.words.length - 1); // termina siempre en "Tu plan"
        setDone(true);
        setTimeout(() => setLeaving(true), quick ? 100 : phone ? 200 : 380);
        setTimeout(onDone, quick ? 220 : phone ? 340 : 560);
        return;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(id); clearTimeout(cap); };
  }, [onDone, quick, phone, t.words.length]);

  useEffect(() => {
    if (quick || done) return;
    const iv = setInterval(() => setWord((w) => (w + 1) % t.words.length), phone ? 400 : 620);
    return () => clearInterval(iv);
  }, [quick, done, phone, t.words.length]);

  return (
    <motion.div className="pl" aria-label={t.label} role="status">
      {/* Cortinas de salida */}
      <motion.div
        className="pl__curtain pl__curtain--blue"
        initial={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: phone ? 0.65 : 0.9, ease: curtain, delay: phone ? 0.08 : 0.12 }}
      />
      <motion.div
        className="pl__curtain pl__curtain--dark"
        initial={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: phone ? 0.65 : 0.9, ease: curtain }}
      >
        <div className="pl__grid" aria-hidden="true" />
        <div className="pl__glow" aria-hidden="true" />

        <motion.div className="pl__center" animate={leaving ? { y: -30, opacity: 0, scale: 0.96 } : {}} transition={{ duration: 0.35, ease }}>
          <DrawnMark quick={quick} speed={speed} />
          <div className="pl__word" aria-hidden="true">
            {WORD.split("").map((ch, i) => (
              <span key={i} className="pl__mask">
                <motion.span
                  className={ch === "." ? "pl__dot" : i > 3 ? "pl__thin" : undefined}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7 * speed, ease, delay: (quick ? 0.3 : 1.3 * speed) + i * (quick ? 0.015 : 0.04 * speed) }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </div>
          {!quick && (
            <div className="pl__rotator">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={word}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  {t.words[word]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        <motion.div className="pl__foot" animate={leaving ? { opacity: 0 } : {}} transition={{ duration: 0.25 }}>
          <div className="pl__meta">
            <span>{t.tagline}</span>
            <span>Miami · Online</span>
          </div>
          <div className="pl__bar"><motion.span style={{ scaleX: count / 100 }} /></div>
          <div className="pl__count">
            {String(count).padStart(3, "0")}<small>%</small>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
