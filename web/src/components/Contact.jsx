import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa6";
import { Anchor, Eyebrow, FadeUp, Logo, Magnetic, SplitReveal, ease, useMedia } from "./ui.jsx";
import { SOCIAL, wa } from "../config.js";
import { Socials } from "./Chrome.jsx";
import { useT } from "../i18n.jsx";

export function Faq() {
  const t = useT().faq;
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="preguntas">
      <div className="container faq__grid">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SplitReveal as="h2" className="h2" text={t.title} />
        </div>
        <div className="faq__list">
          {t.items.map(([q, a], i) => (
            <FadeUp key={i} delay={i * 0.06} className={`faq__item ${open === i ? "is-open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{q}</span>
                <motion.i animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.4, ease }}><FiPlus /></motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="faq__answer"
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormField({ i, children }) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.1 }}
    >
      {children}
    </motion.label>
  );
}

export function Contact() {
  const t = useT().contact;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const phone = useMedia("(max-width: 860px)");
  const scale = useTransform(scrollYProgress, [0, 0.7], phone ? [0.9, 1] : [0.85, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.7], phone ? [36, 0] : [80, 0]);
  const [error, setError] = useState(false);
  const [service, setService] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const name = f.nombre.value.trim();
    if (!name) { setError(true); f.nombre.focus(); return; }
    setError(false);
    window.open(wa(t.message(name, t.services[service], f.meta.value.trim())), "_blank", "noopener");
  };

  return (
    <section className="contact" id="contacto" ref={ref}>
      <motion.div className="contact__panel" style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
        <div className="container contact__grid">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="h1" text={t.title} />
            <FadeUp as="p" className="lead">{t.lead}</FadeUp>
            <div className="contact__socials">
              {[
                [SOCIAL.whatsapp, <FaWhatsapp />, "WhatsApp", "+1 (786) 546-5851", "wa"],
                [SOCIAL.instagram, <FaInstagram />, "Instagram", "@daf.inthegym", "ig"],
                [SOCIAL.facebook, <FaFacebookF />, "Facebook", "DAF", "fb"],
                [SOCIAL.tiktok, <FaTiktok />, "TikTok", "@daf_fitness", "tt"],
              ].map(([href, icon, label, sub, k], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: i % 2 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                >
                  <a className={`social social--${k}`} href={href} target="_blank" rel="noopener">
                    <motion.i
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.3 + i * 0.08 }}
                    >{icon}</motion.i>
                    <span>{label}<small>{sub}</small></span><FiArrowUpRight className="social__arrow" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          <FadeUp>
            <form className="form" onSubmit={submit} noValidate>
              <h3>{t.formTitle}</h3>
              <p>{t.formHint}</p>
              <FormField i={0}>{t.name}<input name="nombre" autoComplete="name" placeholder={t.namePh} /></FormField>
              <FormField i={1}>{t.interest}
                <select name="servicio" value={service} onChange={(e) => setService(+e.target.value)}>
                  {t.services.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </FormField>
              <FormField i={2}>{t.goal}<textarea name="meta" rows="3" placeholder={t.goalPh} /></FormField>
              <Magnetic strength={0.15}>
                <button type="submit" className="btn btn--primary btn--lg btn--block"><FaWhatsapp /> {t.submit}</button>
              </Magnetic>
              <p className="form__error" role="alert">{error ? t.error : ""}</p>
            </form>
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}

const FOOTER_HREFS = ["#servicios", "#resultados", "#sobre-mi", "#transformacion", "#online", "#preguntas", "#contacto"];

export function Footer() {
  const all = useT();
  const t = all.footer;
  return (
    <footer className="footer">
      <div className="container footer__top">
        <Anchor href="#inicio" aria-label={all.nav.home}><Logo /></Anchor>
        <nav className="footer__links">
          {FOOTER_HREFS.map((href, i) => <Anchor key={href} href={href}>{t.links[i]}</Anchor>)}
        </nav>
        <Socials />
      </div>
      <div className="footer__word" aria-hidden="true">
        <motion.span initial={{ y: "100%" }} whileInView={{ y: "0%" }} viewport={{ once: true }} transition={{ duration: 1.4, ease }}>
          DAF<b>.</b>INTHEGYM
        </motion.span>
      </div>
      <p className="container footer__legal">
        © {new Date().getFullYear()} daf.inthegym. {t.legal}
      </p>
    </footer>
  );
}
