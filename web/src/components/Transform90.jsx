import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { Eyebrow, FadeUp, Magnetic, RevealImage, SplitReveal, ease, useMedia } from "./ui.jsx";
import { wa } from "../config.js";
import { useT } from "../i18n.jsx";

function Pain({ text, i, progress, total, phone }) {
  if (phone) {
    // Celular: cada punto entra deslizándose y el check "salta" al aparecer
    return (
      <motion.li
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.7, ease }}
      >
        <motion.span
          className="pain__check"
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.25 }}
        ><FiCheck /></motion.span>
        <span className="pain__n">{String(i + 1).padStart(2, "0")}</span>
        {text}
      </motion.li>
    );
  }
  const start = i / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const check = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [0, 12]);
  return (
    <motion.li style={{ opacity, x }}>
      <motion.span className="pain__check" style={{ scale: check }}><FiCheck /></motion.span>
      <span className="pain__n">{String(i + 1).padStart(2, "0")}</span>
      {text}
    </motion.li>
  );
}

function Phase({ p, i, progress, total, phone }) {
  if (phone) {
    // Celular: las tarjetas entran desde abajo con un leve giro y la barra se llena
    return (
      <div className="phase-wrap">
        <motion.article
          className="phase"
          initial={{ opacity: 0, y: 70, scale: 0.94, rotate: i % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="phase__num">{String(i + 1).padStart(2, "0")}</div>
          <div className="phase__body">
            <p className="phase__days">{p.days}</p>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
          <div className="phase__bar">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: `${((i + 1) / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: 0.4 }}
            />
          </div>
        </motion.article>
      </div>
    );
  }
  const targetScale = 1 - (total - 1 - i) * 0.05;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  return (
    <div className="phase-wrap" style={{ top: `calc(14vh + ${i * 34}px)` }}>
      <motion.article className="phase" style={{ scale }}>
        <div className="phase__num">{String(i + 1).padStart(2, "0")}</div>
        <div className="phase__body">
          <p className="phase__days">{p.days}</p>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </div>
        <div className="phase__bar"><span style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
      </motion.article>
    </div>
  );
}

export default function Transform90() {
  const t = useT().t90;
  const phone = useMedia("(max-width: 860px)");
  const painsRef = useRef(null);
  const { scrollYProgress: painP } = useScroll({ target: painsRef, offset: ["start 75%", "end 55%"] });
  const phasesRef = useRef(null);
  const { scrollYProgress: phaseP } = useScroll({ target: phasesRef, offset: ["start start", "end end"] });
  const bigRef = useRef(null);
  const { scrollYProgress: bigP } = useScroll({ target: bigRef, offset: ["start end", "end start"] });
  const bigX = useTransform(bigP, [0, 1], ["10%", "-40%"]);

  return (
    <section className="section t90" id="transformacion">
      <div className="t90__big" ref={bigRef} aria-hidden="true">
        <motion.span style={{ x: bigX }}>{t.bigWord} · {t.bigWord} · {t.bigWord}</motion.span>
      </div>

      <div className="container">
        <div className="t90__head">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal as="h2" className="h1" text={t.title} />
          <div className="t90__lead">
            <FadeUp as="p" className="lead">{t.lead}</FadeUp>
            <FadeUp as="p" delay={0.1}>
              {t.p1} <strong>{t.strong}</strong> {t.p2}
            </FadeUp>
          </div>
        </div>

        <div className="pains">
          <div className="pains__title">
            <SplitReveal as="h3" className="h3" text={t.painsTitle} />
            <FadeUp as="p">{t.painsFoot}</FadeUp>
          </div>
          <ul className="pains__list" ref={painsRef}>
            {t.pains.map((text, i) => <Pain key={i} text={text} i={i} progress={painP} total={t.pains.length} phone={phone} />)}
          </ul>
        </div>

        <div className="phases-head">
          <SplitReveal as="h3" className="h2" text={t.phasesTitle} />
          <FadeUp as="p" className="lead">{t.phasesLead}</FadeUp>
        </div>
        <div className="phases" ref={phasesRef}>
          {t.phases.map((p, i) => <Phase key={i} p={p} i={i} progress={phaseP} total={t.phases.length} phone={phone} />)}
        </div>

        <div className="gets">
          <div className="gets__media">
            <RevealImage src="img/grupo.webp" alt={t.groupAlt} />
          </div>
          <div>
            <Eyebrow>{t.getsEyebrow}</Eyebrow>
            <SplitReveal as="h3" className="h2" text={t.getsTitle} />
            <ul className="gets__list">
              {t.gets.map((g, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ duration: 0.8, ease, delay: i * 0.07 }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>{g}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="who">
          <FadeUp as="p" className="who__label">{t.whoLabel}</FadeUp>
          <div className="who__rows" aria-hidden="true">
            {[t.who.slice(0, Math.ceil(t.who.length / 2)), t.who.slice(Math.ceil(t.who.length / 2))].map((row, r) => (
              <div key={r} className={`who__row ${r ? "who__row--rev" : ""}`}>
                <div className="who__track">
                  {[...row, ...row, ...row].map((w, i) => <span key={i}>{w}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="who__chips">
            {t.who.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {w}
              </motion.span>
            ))}
          </div>
          <FadeUp className="who__cta">
            <p className="h3">{t.ctaText}<span className="accent">{t.ctaAccent}</span></p>
            <Magnetic>
              <a className="btn btn--primary btn--lg" href={wa(t.wa)} target="_blank" rel="noopener">
                {t.cta} <FiArrowUpRight />
              </a>
            </Magnetic>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
