import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Eyebrow, SplitReveal, ease, useMedia } from "./ui.jsx";
import { wa } from "../config.js";
import { useT } from "../i18n.jsx";

/* En celular Transform va primero (es el plan destacado) */
const PLANS = [
  { name: "Start" },
  { name: "Transform", featured: true },
  { name: "VIP" },
];
const MOBILE_ORDER = ["Transform", "Start", "VIP"];

function PlanCard({ p, i, t }) {
  return (
    <motion.article
      className={`plan ${p.featured ? "plan--featured" : ""}`}
      initial={{ opacity: 0, y: 80, rotateX: 25 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease, delay: i * 0.12 }}
      whileHover={{ y: -10 }}
    >
      <div className="plan__inner">
        <h3>{p.name}</h3>
        <ul>
          {t.plans[p.name].map((it, j) => (
            <motion.li
              key={it}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.35 + j * 0.08 }}
            >
              <FiCheck /> {it}
            </motion.li>
          ))}
        </ul>
        <a
          className={`btn btn--block ${p.featured ? "btn--primary" : "btn--glass"}`}
          href={wa(t.wa(p.name.toUpperCase()))}
          target="_blank"
          rel="noopener"
        >
          {t.choose} {p.name}
        </a>
      </div>
    </motion.article>
  );
}

/* Celular: cada plan entra desde un lado (alternando) siguiendo el scroll; si subes, se devuelve */
function SlideItem({ p, i, t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const side = i % 2 ? 1 : -1;
  const x = useTransform(scrollYProgress, [0, 1], [`${side * 70}%`, "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [side * 10, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  return (
    <motion.div ref={ref} className="plans-slide__item" style={{ x, rotate, scale, opacity }}>
      <PlanCard p={p} i={0} t={t} />
    </motion.div>
  );
}

function MobilePlans({ t }) {
  const plans = MOBILE_ORDER.map((name) => PLANS.find((p) => p.name === name));
  return (
    <div className="plans-slide">
      {plans.map((p, i) => <SlideItem key={p.name} p={p} i={i} t={t} />)}
    </div>
  );
}

export default function Online() {
  const t = useT().online;
  const phone = useMedia("(max-width: 600px)");
  return (
    <section className="section online" id="online">
      <div className="container">
        <div className="online__head">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal as="h2" className="h2" text={t.title} />
        </div>

        {phone ? (
          <MobilePlans t={t} />
        ) : (
          <div className="plans">
            {PLANS.map((p, i) => <PlanCard key={p.name} p={p} i={i} t={t} />)}
          </div>
        )}
      </div>
    </section>
  );
}
