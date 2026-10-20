import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence, motion, useAnimationFrame, useMotionValue, useMotionValueEvent,
  useScroll, useSpring, useTransform, useVelocity,
} from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa6";
import { FiArrowUp } from "react-icons/fi";
import { Anchor, Logo, LogoMark, ease } from "./ui.jsx";
import { SOCIAL, wa } from "../config.js";
import { useLang, useT } from "../i18n.jsx";

/* ---------- Preloader ---------- */
export function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const total = 1700;
    let id;
    const tick = (now) => {
      const p = Math.min((now - start) / total, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) id = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [onDone]);

  return (
    <motion.div className="preloader" exit={{ clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, ease }}>
        <LogoMark className="preloader__mark" />
      </motion.div>
      <div className="preloader__bar"><motion.span style={{ scaleX: count / 100 }} /></div>
      <div className="preloader__count">{String(count).padStart(3, "0")}</div>
    </motion.div>
  );
}

/* ---------- Selector de idioma ES / EN ---------- */
export function LangSwitch({ className = "" }) {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <div className={`lang ${className}`} role="group" aria-label={t.misc.langLabel}>
      {["es", "en"].map((l) => (
        <button key={l} type="button" className={lang === l ? "is-active" : ""} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {lang === l && <motion.span layoutId={`lang-pill-${className}`} className="lang__pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          <span>{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Navegación ---------- */
const HREFS = ["#servicios", "#resultados", "#sobre-mi", "#transformacion", "#online", "#como-empezar", "#contacto"];

export function Nav() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400 && !open);
    setSolid(v > 40);
  });

  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <motion.header
        className={`nav ${solid ? "is-solid" : ""}`}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <Anchor href="#inicio" className="nav__logo" aria-label={t.nav.home}><Logo /></Anchor>
        <div className="nav__right">
          <LangSwitch className="nav__lang" />
          <a className="btn btn--primary btn--sm nav__cta" href={wa(t.misc.waEval)} target="_blank" rel="noopener">
            {t.nav.cta}
          </a>
          <button className={`menu-btn ${open ? "is-open" : ""}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.nav.closeAria : t.nav.open}>
            <span className="menu-btn__label">{open ? t.nav.close : t.nav.menu}</span>
            <span className="menu-btn__icon"><i /><i /></span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="menu__links">
              {HREFS.map((href, i) => (
                <span className="mask" key={href}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.05 }}
                  >
                    <Anchor href={href} onClick={() => setOpen(false)}>
                      <small>0{i + 1}</small>{t.nav.links[i]}
                    </Anchor>
                  </motion.span>
                </span>
              ))}
            </nav>
            <motion.div className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} exit={{ opacity: 0 }}>
              <Socials />
              <LangSwitch className="menu__lang" />
              <a href={SOCIAL.whatsapp} target="_blank" rel="noopener">+1 (786) 546-5851</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Socials({ className = "" }) {
  return (
    <div className={`socials ${className}`}>
      <a href={SOCIAL.instagram} target="_blank" rel="noopener" aria-label="Instagram"><FaInstagram /></a>
      <a href={SOCIAL.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><FaWhatsapp /></a>
      <a href={SOCIAL.facebook} target="_blank" rel="noopener" aria-label="Facebook"><FaFacebookF /></a>
      <a href={SOCIAL.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><FaTiktok /></a>
    </div>
  );
}

/* ---------- Barra de progreso de scroll ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

/* ---------- Cinta que reacciona a la velocidad del scroll ---------- */
const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export function VelocityMarquee({ items, baseVelocity = -3, boost = 5, className = "" }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, boost], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = items.map((t, i) => (
    <span key={i} className="marquee__item">{t}<b>✦</b></span>
  ));
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <motion.div className="marquee__track" style={{ x }}>
        {row}{row}{row}{row}
      </motion.div>
    </div>
  );
}

/* ---------- Botones flotantes: volver arriba + WhatsApp ---------- */
export function FloatingActions() {
  const t = useT();
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 500));
  const ring = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floating">
      <AnimatePresence>
        {show && (
          <motion.button
            key="top"
            type="button"
            className="to-top"
            onClick={toTop}
            aria-label={t.misc.toTop}
            title={t.misc.toTop}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="to-top__ring" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" className="to-top__track" />
              <motion.circle cx="26" cy="26" r="24" className="to-top__bar" style={{ pathLength: ring }} />
            </svg>
            <FiArrowUp />
          </motion.button>
        )}
        {show && (
          <motion.a
            key="wa"
            className="wa-float"
            href={wa(t.misc.waMsg)}
            target="_blank"
            rel="noopener"
            aria-label={t.misc.waAria}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <FaWhatsapp />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
