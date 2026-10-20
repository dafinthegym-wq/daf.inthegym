import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Eyebrow, FadeUp, SplitReveal, ease, useMedia } from "./ui.jsx";
import { TESTIMONIALS } from "../config.js";
import { useT } from "../i18n.jsx";

const RESULTS = ["img/resultado-eilen.webp", "img/resultado-sydney.webp", "img/resultado-genesis.webp", "img/resultado-dia21.webp"];
const N = RESULTS.length;

function Frame({ src, alt }) {
  return (
    <div className="result__frame">
      <img className="result__bg" src={src} alt="" aria-hidden="true" loading="lazy" draggable="false" />
      <img className="result__img" src={src} alt={alt} loading="lazy" draggable="false" />
    </div>
  );
}

/* ---------- Celular: tarjetas que se apilan al bajar ----------
   Cada tarjeta se queda "pegada" arriba (position: sticky, lo hace el navegador,
   así que va fluido en cualquier teléfono) y la siguiente sube y la cubre.
   La que queda debajo se encoge y oscurece ligeramente. */
function StackCard({ src, alt, name, i, progress }) {
  const start = i / N;
  const scale = useTransform(progress, [start, 1], [1, 1 - (N - 1 - i) * 0.045]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / N)], [0, i < N - 1 ? 0.45 : 0]);
  return (
    <div className="stack__item" style={{ top: `calc(84px + ${i * 14}px)` }}>
      <motion.figure
        className="stack__card"
        style={{ scale }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 0.7, ease }}
      >
        <Frame src={src} alt={alt} />
        <motion.span className="stack__dim" style={{ opacity: dim }} />
        <figcaption>
          <span className="stack__num">{String(i + 1).padStart(2, "0")}<small>/{String(N).padStart(2, "0")}</small></span>
          <span className="stack__name">{name}</span>
        </figcaption>
      </motion.figure>
    </div>
  );
}

function MobileStack({ t }) {
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 84px", "end end"] });
  return (
    <section className="section results results--stack" id="resultados">
      <div className="container">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <SplitReveal as="h2" className="h2" text={t.title} />
        <FadeUp as="p" className="results__note">{t.note}</FadeUp>
        <div className="stack" ref={list}>
          {RESULTS.map((src, i) => (
            <StackCard key={src} src={src} alt={`${t.alt}: ${t.names[i]}`} name={t.names[i]} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PC y tablet: fila que se desplaza en horizontal al hacer scroll ---------- */
function HorizontalTrack({ t }) {
  const section = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => setDist(Math.max(track.current.scrollWidth - window.innerWidth, 0));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -dist]), { stiffness: 120, damping: 30, mass: 0.3 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="results" id="resultados" ref={section} style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="results__sticky">
        <div className="container results__head">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="h2" text={t.title} />
          </div>
          <FadeUp as="p" className="results__note">{t.note}</FadeUp>
        </div>

        <motion.div className="results__track" ref={track} style={{ x }}>
          {RESULTS.map((src, i) => (
            <figure key={src} className="result">
              <Frame src={src} alt={`${t.alt}: ${t.names[i]}`} />
              <figcaption><span>{String(i + 1).padStart(2, "0")}</span>{t.names[i]}</figcaption>
            </figure>
          ))}
        </motion.div>

        <div className="container results__progress"><motion.span style={{ scaleX: bar }} /></div>
      </div>
    </section>
  );
}

export default function Results() {
  const t = useT().results;
  const phone = useMedia("(max-width: 600px)");

  return (
    <>
      {phone ? <MobileStack t={t} /> : <HorizontalTrack t={t} />}

      {TESTIMONIALS.length > 0 && (
        <section className="section testimonials-wrap">
          <div className="container testimonials">
            {TESTIMONIALS.map((item, i) => (
              <FadeUp key={i} className="testimonial" delay={i * 0.1}>
                <div className="testimonial__stars">★★★★★</div>
                <blockquote>“{item.quote}”</blockquote>
                <cite>{item.name}{item.detail && <small>{item.detail}</small>}</cite>
              </FadeUp>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
