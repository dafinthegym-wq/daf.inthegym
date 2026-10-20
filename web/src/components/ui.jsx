import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

/* Indica cuándo terminó el preloader, para arrancar las animaciones del hero */
export const ReadyContext = createContext(false);
export const useReady = () => useContext(ReadyContext);

export function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

export function scrollToId(id) {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* Enlace interno con scroll suave */
export function Anchor({ href, children, onClick, ...rest }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        scrollToId(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* Texto que se revela palabra por palabra desde una máscara.
   "*palabra*" = color de acento · "|" = salto de línea */
export function SplitReveal({ text, as = "h2", className = "", delay = 0, stagger = 0.06, play }) {
  const Tag = motion[as];
  const tokens = text.split(" ");
  const controlled = play !== undefined;
  return (
    <Tag
      key={text /* al cambiar de idioma, el título se vuelve a montar y a animar */}
      className={className}
      initial="hidden"
      {...(controlled ? { animate: play ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, margin: "-12% 0px" } })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {tokens.map((tok, i) => {
        if (tok === "|") return <Fragment key={`br-${i}`}>{" "}<br /></Fragment>;
        const last = i === tokens.length - 1 || tokens[i + 1] === "|";
        const accent = tok.startsWith("*") && tok.endsWith("*");
        const word = accent ? tok.slice(1, -1) : tok;
        return (
          <Fragment key={`${tok}-${i}`}>
            <span className="mask">
              <motion.span
                className={accent ? "accent" : undefined}
                variants={{ hidden: { y: "115%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease } } }}
              >
                {word}
              </motion.span>
            </span>
            {last ? null : " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, y = 40, className = "", as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Imagen que se descubre con una cortina y luego hace parallax */
export function RevealImage({ src, alt, className = "", strength = 12, priority = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <motion.div
      ref={ref}
      className={`reveal-img ${className}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        style={{ y }}
        initial={{ scale: 1.5 }}
        whileInView={{ scale: 1 + strength / 50 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
      />
    </motion.div>
  );
}

/* Botón magnético: se pega al cursor */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

export function Counter({ from = 0, to, duration = 2, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, from, to, duration]);
  return (
    <span ref={ref} className={className}>
      {val}
    </span>
  );
}

export function Eyebrow({ children }) {
  return (
    <FadeUp as="p" className="eyebrow" y={16}>
      <motion.span
        className="eyebrow__line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
      /> {children}
    </FadeUp>
  );
}

export function LogoMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lmg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3FB0FF" />
          <stop offset="1" stopColor="#1257E6" />
        </linearGradient>
      </defs>
      <path d="M22 22.5 L20.5 13 L27 17.5 L32.5 9.5 L37.5 17.5 L44.5 13 L42.5 22.5 Z" fill="url(#lmg)" />
      <rect x="3" y="31" width="11" height="3.2" rx="1.6" fill="url(#lmg)" />
      <rect x="5" y="38.4" width="8" height="3.2" rx="1.6" fill="url(#lmg)" opacity=".8" />
      <rect x="7" y="45.8" width="5" height="3.2" rx="1.6" fill="url(#lmg)" opacity=".6" />
      <path fill="currentColor" fillRule="evenodd" d="M19.5 26 H38 C47 26 51.5 31.5 49.6 39.5 L49.2 41.2 C47.4 49 41.4 54 33 54 H13.2 Z M27.8 33.5 L24.7 46.5 H31.6 C35.6 46.5 38.4 44.3 39.3 40.6 L39.6 39.3 C40.4 35.6 38.8 33.5 35 33.5 Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark className="logo__mark" />
      <span className="logo__word">
        DAF<i>.</i>
        <small>INTHEGYM</small>
      </span>
    </span>
  );
}
