import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import { scrollToId, useMedia } from "./ui.jsx";
import { wa } from "../config.js";
import { useT } from "../i18n.jsx";

/* Secciones que muestra el indicador de la barra inferior */
const SECTIONS = ["#servicios", "#resultados", "#sobre-mi", "#transformacion", "#online", "#instagram", "#entrenamiento", "#como-empezar", "#preguntas", "#contacto"];

/* ---------- Barra de acciones inferior (celular y tablet) ---------- */
export function MobileActionBar() {
  const t = useT();
  const mobile = useMedia("(max-width: 860px)");
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const [section, setSection] = useState(-1);
  const ring = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollY, "change", (v) => {
    const vh = window.innerHeight;
    // visible después del inicio; se oculta mientras el formulario de contacto está en pantalla
    const form = document.querySelector(".form");
    const formOnScreen = form && form.getBoundingClientRect().top < vh * 0.85 && form.getBoundingClientRect().bottom > 0;
    setShow(v > vh * 0.7 && !formOnScreen);
    let current = -1;
    SECTIONS.forEach((id, i) => {
      const el = document.querySelector(id);
      if (el && el.getBoundingClientRect().top < vh * 0.45) current = i;
    });
    setSection(current);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("has-actionbar", mobile);
  }, [mobile]);

  if (!mobile) return null;
  const label = section >= 0 ? t.misc.sections[section] : "";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="actionbar"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <div className="actionbar__section" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={label}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="actionbar__row">
            <a className="actionbar__cta" href={wa(t.misc.waEval)} target="_blank" rel="noopener" data-haptic>
              <span>{t.nav.cta}</span><FiArrowUpRight />
            </a>
            <a className="actionbar__icon actionbar__icon--wa" href={wa(t.misc.waMsg)} target="_blank" rel="noopener" aria-label={t.misc.waAria} data-haptic>
              <FaWhatsapp />
            </a>
            <button
              type="button"
              className="actionbar__icon actionbar__icon--top"
              aria-label={t.misc.toTop}
              onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : scrollToId("#inicio"))}
            >
              <svg className="actionbar__ring" viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="21" className="to-top__track" />
                <motion.circle cx="24" cy="24" r="21" className="to-top__bar" style={{ pathLength: ring }} />
              </svg>
              <FiArrowUp />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Vibración breve en botones principales (sin onda visual) ---------- */
export function useTouchFeedback() {
  useEffect(() => {
    const onDown = (e) => {
      if (e.pointerType === "mouse") return;
      const el = e.target.closest(".btn--primary, [data-haptic]");
      if (el && navigator.vibrate) navigator.vibrate(12);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
}
