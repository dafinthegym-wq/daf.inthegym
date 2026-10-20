import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Anchor, Eyebrow, FadeUp, SplitReveal, ease, useMedia } from "./ui.jsx";
import { useT } from "../i18n.jsx";

/* Los dos servicios: Transformación 90 días y Coaching online */
const SERVICES = [
  { n: "01", img: "img/grupo.webp", anchor: "#transformacion", featured: true },
  { n: "02", img: "img/daf-gym.webp", anchor: "#online" },
];

function Card({ s, i, progress, desktop }) {
  const t = useT().services;
  const copy = t.items[i];
  const side = i === 0 ? -1 : 1;
  // PC: las tarjetas llegan desde los lados, giradas en 3D, y se enderezan al bajar
  const x = useTransform(progress, [0, 0.5], [`${side * 22}%`, "0%"]);
  const rotateY = useTransform(progress, [0, 0.5], [side * -18, 0]);
  const rotateZ = useTransform(progress, [0, 0.5], [side * 4, 0]);
  const y = useTransform(progress, [0, 0.5, 1], [120, 0, -40]);
  const opacity = useTransform(progress, [0, 0.3], [0, 1]);
  const imgY = useTransform(progress, [0, 1], ["-12%", "12%"]);
  const imgScale = useTransform(progress, [0, 0.5], [1.35, 1.12]);
  const style = desktop ? { x, y, rotateY, rotate: rotateZ, opacity } : undefined;
  return (
    <motion.article
      className={`svc ${s.featured ? "svc--featured" : ""}`}
      style={style}
      initial={desktop ? false : { opacity: 0, y: 60 }}
      whileInView={desktop ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1, ease, delay: i * 0.12 }}
    >
      <div className="svc__img">
        <motion.img
          src={s.img}
          alt={copy.title}
          loading="lazy"
          style={desktop ? { y: imgY, scale: imgScale } : undefined}
          initial={desktop ? false : { scale: 1.35 }}
          whileInView={desktop ? undefined : { scale: 1.04 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 1.6, ease }}
        />
      </div>
      <div className="svc__shade" />
      <motion.span
        className="svc__n"
        initial={{ scale: 0, rotate: -30 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.4 }}
      >{s.n}</motion.span>
      {s.featured && <span className="svc__tag">{t.tag}</span>}
      <div className="svc__body">
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
        <ul className="svc__points">
          {copy.points.map((pt, j) => (
            <motion.li
              key={pt}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.3 + j * 0.08 }}
            >{pt}</motion.li>
          ))}
        </ul>
        <Anchor href={s.anchor} className="svc__link">{copy.cta} <FiArrowUpRight /></Anchor>
      </div>
    </motion.article>
  );
}

export default function Services() {
  const t = useT().services;
  const desktop = useMedia("(min-width: 1024px)");
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const bgWord = useTransform(scrollYProgress, [0, 1], ["20%", "-60%"]);
  return (
    <section className="section services" id="servicios">
      {desktop && <motion.div className="services__word" aria-hidden="true" style={{ x: bgWord }}>{t.bgWord}</motion.div>}
      <div className="container">
        <div className="svc-intro">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitReveal className="h2" text={t.title} />
          </div>
          <FadeUp as="p" className="lead">{t.lead}</FadeUp>
        </div>
        <div className="svc-list" ref={listRef}>{SERVICES.map((s, i) => <Card key={s.n} s={s} i={i} progress={progress} desktop={desktop} />)}</div>
      </div>
    </section>
  );
}
