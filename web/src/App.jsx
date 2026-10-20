import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { ReadyContext } from "./components/ui.jsx";
import { FloatingActions, Nav, ScrollProgress, VelocityMarquee } from "./components/Chrome.jsx";
import Preloader from "./components/Preloader.jsx";
import { LangProvider, useT } from "./i18n.jsx";
import { MobileActionBar, useTouchFeedback } from "./components/MobileUX.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Steps from "./components/Steps.jsx";
import Transform90 from "./components/Transform90.jsx";
import Online from "./components/Online.jsx";
import Results from "./components/Results.jsx";
import Instagram from "./components/Instagram.jsx";
import Topics from "./components/Topics.jsx";
import { Contact, Faq, Footer } from "./components/Contact.jsx";

export default function App({ initialLang }) {
  return (
    <LangProvider initial={initialLang}>
      <Site />
    </LangProvider>
  );
}

function Site() {
  const t = useT();
  useTouchFeedback();
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);

  useEffect(() => {
    if (loading) window.__lenis?.stop(); else window.__lenis?.start();
    document.documentElement.classList.toggle("is-loading", loading);
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <ReadyContext.Provider value={!loading}>
        <AnimatePresence>{loading && <Preloader key="pre" onDone={done} />}</AnimatePresence>
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <VelocityMarquee items={t.marquee1} baseVelocity={-1.4} boost={2} />
          {/* Orden pensado para convertir: oferta → prueba → quién → detalles → cómo empezar → dudas → contacto */}
          <Services />
          <Results />
          <About />
          <Transform90 />
          <VelocityMarquee className="marquee--outline" baseVelocity={3} items={t.marquee2} />
          <Online />
          <Instagram />
          <Topics />
          <Steps />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <FloatingActions />
        <MobileActionBar />
      </ReadyContext.Provider>
    </MotionConfig>
  );
}
