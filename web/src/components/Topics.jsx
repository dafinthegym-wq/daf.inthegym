import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Anchor, Eyebrow, FadeUp, SplitReveal, ease } from "./ui.jsx";
import { useT } from "../i18n.jsx";

/* "Entrenamiento personal en Miami y online": resumen de lo que trabaja DAF,
   con texto visible y enlaces a cada sección (ayuda a Google a entender de qué trata la web). */
export default function Topics() {
  const t = useT().topics;
  return (
    <section className="section topics" id="entrenamiento">
      <div className="container topics__grid">
        <div className="topics__copy">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal as="h2" className="h2" text={t.title} />
          {t.paragraphs.map((p, i) => (
            <FadeUp as="p" key={i} delay={i * 0.08} className={i === 0 ? "lead" : undefined}>{p}</FadeUp>
          ))}
        </div>
        <ul className="topics__list">
          {t.items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.6, ease, delay: (i % 2) * 0.06 }}
            >
              <Anchor href={it.href} className="topic">
                <span className="topic__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="topic__body">
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </span>
                <FiArrowUpRight className="topic__arrow" aria-hidden="true" />
              </Anchor>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
