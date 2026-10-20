import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaInstagram } from "react-icons/fa6";
import { Counter, Eyebrow, FadeUp, RevealImage, SplitReveal, useMedia } from "./ui.jsx";
import { SOCIAL } from "../config.js";
import { useT } from "../i18n.jsx";

/* Frase que se "enciende" palabra por palabra al hacer scroll */
function ScrollQuote({ text, phone }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: phone ? ["start 92%", "end 62%"] : ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p className="scroll-quote" ref={ref}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
      ))}
    </p>
  );
}
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

export default function About() {
  const t = useT().about;
  const phone = useMedia("(max-width: 600px)");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], phone ? ["0%", "0%"] : ["30%", "-30%"]);

  return (
    <section className="section about" id="sobre-mi" ref={ref}>
      <div className="container about__grid">
        <div className="about__media">
          <RevealImage src="img/daf-exterior.webp" alt={t.altMain} className="about__main" />
          <motion.div
            className="about__float"
            style={{ y: floatY }}
            initial={phone ? { opacity: 0, x: 60, rotate: 3 } : false}
            whileInView={phone ? { opacity: 1, x: 0, rotate: 0 } : undefined}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <RevealImage src="img/daf-2005-2026.webp" alt={t.altTransf} strength={4} />
            <span className="about__chip about__chip--before" aria-hidden="true">{t.before}</span>
            <span className="about__chip about__chip--after" aria-hidden="true">{t.today}</span>
            <span className="about__float-tag">{t.tag}</span>
          </motion.div>
        </div>

        <div className="about__copy">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal className="h2" text={t.title} />
          <FadeUp as="p" className="lead">{t.p1}</FadeUp>
          <FadeUp as="p" delay={0.1}>{t.p2}</FadeUp>

          <div className="years">
            <div><Counter from={1990} to={2005} className="years__num" /><span>{t.before}</span></div>
            <motion.div className="years__arrow" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.3 }} />
            <div><Counter from={2005} to={2026} duration={2.4} className="years__num years__num--blue" /><span>{t.today}</span></div>
          </div>

          <ScrollQuote text={t.quote} phone={phone} />

          <FadeUp>
            <a className="btn btn--glass" href={SOCIAL.instagram} target="_blank" rel="noopener"><FaInstagram /> @daf.inthegym</a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
