import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowUpRight, FiCalendar, FiMessageCircle, FiTrendingUp } from "react-icons/fi";
import { Eyebrow, FadeUp, Magnetic, SplitReveal, ease } from "./ui.jsx";
import { wa } from "../config.js";
import { useT } from "../i18n.jsx";

const ICONS = [FiCalendar, FiMessageCircle, FiTrendingUp];

/* "Cómo empezar": 3 pasos unidos por una línea que se dibuja al hacer scroll */
export default function Steps() {
  const all = useT();
  const t = all.steps;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="section steps" id="como-empezar">
      <div className="container">
        <div className="steps__head">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal as="h2" className="h2" text={t.title} />
        </div>

        <div className="steps__list" ref={ref}>
          <div className="steps__line" aria-hidden="true"><motion.span style={{ scaleX: line, scaleY: line }} /></div>
          {t.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <motion.article
                key={i}
                className="step"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.15 }}
              >
                <motion.div
                  className="step__icon"
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.25 + i * 0.15 }}
                >
                  <Icon />
                  <span className="step__n">{i + 1}</span>
                </motion.div>
                <div className="step__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <FadeUp className="steps__cta">
          <Magnetic>
            <a className="btn btn--primary btn--lg" href={wa(all.misc.waEval)} target="_blank" rel="noopener">
              {t.cta} <FiArrowUpRight />
            </a>
          </Magnetic>
          <p>{t.ctaNote}</p>
        </FadeUp>
      </div>
    </section>
  );
}
