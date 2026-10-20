import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiArrowDown } from "react-icons/fi";
import { Anchor, Magnetic, SplitReveal, ease, useMedia, useReady } from "./ui.jsx";
import { wa } from "../config.js";
import { useT } from "../i18n.jsx";

/* Foto: Pexels #29224211 (foad shariyati) — licencia Pexels, uso libre y gratuito */
export default function Hero() {
  const ready = useReady();
  const t = useT().hero;
  const waEval = useT().misc.waEval;
  const ref = useRef(null);
  const phone = useMedia("(max-width: 860px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", phone ? "22%" : "14%"]);
  const line1 = useTransform(scrollYProgress, [0, 1], phone ? ["0%", "0%"] : ["0%", "-22%"]);
  const line2 = useTransform(scrollYProgress, [0, 1], phone ? ["0%", "0%"] : ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", phone ? "-10%" : "0%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], phone ? [1, 0.2] : [1, 0]);

  const show = (d = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: phone ? 0.7 : 1, ease, delay: phone ? d * 0.35 : d },
  });

  return (
    <section className="hero" id="inicio" ref={ref}>
      <motion.div
        className="hero__media"
        initial={phone ? { opacity: 0.35 } : { clipPath: "inset(12% 12% 12% 12% round 32px)" }}
        animate={ready ? (phone ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0% round 0px)" }) : {}}
        transition={{ duration: phone ? 1 : 1.6, ease: [0.76, 0, 0.24, 1] }}
      >
        <picture>
          <source media="(max-width: 860px)" srcSet="/img/hero-gym-sm.webp" width="900" height="1200" />
          <motion.img
            src="/img/hero-gym.webp"
            alt={t.alt}
            width="1600"
            height="2133"
            fetchpriority="high"
            decoding="async"
            style={{ scale: imgScale, y: imgY }}
            initial={{ scale: 1.4 }}
            animate={ready ? { scale: 1 } : {}}
            transition={{ duration: 2.2, ease }}
          />
        </picture>
        <div className="hero__shade" />
        <div className="hero__glow" aria-hidden="true" />
      </motion.div>

      <motion.div className="hero__content" style={{ opacity: fade, y: contentY }}>
        <motion.h1 className="hero__kicker" {...show(0.5)}>
          <span className="pulse" aria-hidden="true" /> {t.kicker}
        </motion.h1>

        <p className="hero__title">
          <motion.span className="hero__row" style={{ x: line1 }}>
            <SplitReveal as="span" text={t.rows[0][0]} play={ready} delay={phone ? 0.05 : 0.6} />{" "}
            <SplitReveal as="span" className="outline" text={t.rows[0][1]} play={ready} delay={phone ? 0.12 : 0.72} />
          </motion.span>{" "}
          <motion.span className="hero__row" style={{ x: line2 }}>
            <SplitReveal as="span" text={t.rows[1][0]} play={ready} delay={phone ? 0.19 : 0.84} />{" "}
            <SplitReveal as="span" className="blue" text={t.rows[1][1]} play={ready} delay={phone ? 0.26 : 0.96} />
          </motion.span>
        </p>

        <div className="hero__bottom">
          <motion.p className="hero__lead" {...show(1.2)}>
            {t.lead}
          </motion.p>
          <motion.div className="hero__ctas" {...show(1.35)}>
            <Magnetic>
              <a className="btn btn--primary btn--lg" href={wa(waEval)} target="_blank" rel="noopener">
                {t.cta} <FiArrowUpRight />
              </a>
            </Magnetic>
            <Anchor className="btn btn--glass btn--lg" href="#servicios">{t.cta2}</Anchor>
          </motion.div>
          <motion.ul className="hero__chips" {...show(1.5)}>
            {t.chips.map((c) => <li key={c}>{c}</li>)}
          </motion.ul>
        </div>
      </motion.div>

      <motion.div className="hero__scroll" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
        <span>Scroll</span>
        <motion.i animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}><FiArrowDown /></motion.i>
      </motion.div>
    </section>
  );
}
