import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { Eyebrow, SplitReveal, ease } from "./ui.jsx";
import { BEHOLD_FEED_URL, INSTAGRAM_POSTS, SOCIAL } from "../config.js";
import { useLang, useT } from "../i18n.jsx";

/* Convierte la respuesta de Behold (formato nuevo o antiguo) a una lista simple */
function fromBehold(data) {
  const list = Array.isArray(data) ? data : data.posts || [];
  return list
    .map((p) => ({
      image: p.sizes?.medium?.mediaUrl || (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl),
      url: p.permalink,
      caption: p.prunedCaption || p.caption || "",
    }))
    .filter((p) => p.image);
}

export default function Instagram() {
  const t = useT().insta;
  const { lang } = useLang();
  const manual = INSTAGRAM_POSTS.length > 0;
  const [posts, setPosts] = useState(manual ? INSTAGRAM_POSTS : null);

  useEffect(() => {
    if (manual || !BEHOLD_FEED_URL) return;
    fetch(BEHOLD_FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setPosts(fromBehold(d)))
      .catch(() => setPosts([]));
  }, [manual]);

  if (posts && posts.length === 0) return null;

  return (
    <section className="section insta" id="instagram">
      <div className="container">
        <div className="insta__head">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="h2" text="*@daf.inthegym*" />
          </div>
          <a className="btn btn--glass" href={SOCIAL.instagram} target="_blank" rel="noopener"><FaInstagram /> {t.follow}</a>
        </div>
      </div>

      <div className="reels">
        {(posts || Array.from({ length: 8 })).slice(0, 8).map((p, i) => {
          const caption = p && (typeof p.caption === "object" ? p.caption[lang] || p.caption.es : p.caption);
          return p ? (
            <motion.a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener"
              className="reel"
              initial={{ opacity: 0, y: 60, scale: 0.85, rotate: i % 2 ? 5 : -5 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              whileTap={{ scale: 0.96 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.9, ease, delay: (i % 2) * 0.12 }}
            >
              <img src={p.image} alt={caption ? caption.slice(0, 120) : t.alt} loading="lazy" />
              <span className="reel__shade" />
              <span className="reel__top"><FaInstagram /> {t.reel}</span>
              {caption && <span className="reel__caption">{caption}</span>}
              <span className="reel__go"><FiArrowUpRight /></span>
            </motion.a>
          ) : (
            <div key={i} className="reel reel--skeleton" />
          );
        })}
      </div>
    </section>
  );
}
