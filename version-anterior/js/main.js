/* =========================================================
   DAF · daf.inthegym — interacciones y animaciones
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = window.DAF_CONFIG || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.classList.add("js");
  window.addEventListener("load", function () { document.body.classList.add("is-loaded"); });
  // por si la carga de imágenes tarda, arrancamos el hero igual
  setTimeout(function () { document.body.classList.add("is-loaded"); }, 400);

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll("[data-delay]").forEach(function (el) {
    el.style.setProperty("--d", el.getAttribute("data-delay") + "ms");
  });
  document.querySelectorAll(".reveal-stagger").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      if (entry.target.hasAttribute("data-count")) countUp(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Contadores ---------- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  // contadores sueltos (fuera de grupos reveal)
  document.querySelectorAll("[data-count]").forEach(function (el) {
    if (!el.closest(".reveal, .reveal-stagger")) revealObserver.observe(el);
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // sección activa
  var navLinks = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = "#" + entry.target.id;
      navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Scroll: progreso, nav, parallax, timeline ---------- */
  var progressBar = document.querySelector(".progress span");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var parallaxImgs = Array.prototype.slice.call(document.querySelectorAll("[data-parallax-img]"));
  var timeline = document.getElementById("timeline");
  var timelineFill = timeline && timeline.querySelector(".timeline__line span");
  var phases = timeline ? Array.prototype.slice.call(timeline.querySelectorAll(".phase")) : [];
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    if (progressBar) progressBar.style.transform = "scaleX(" + (docH > 0 ? y / docH : 0) + ")";

    nav.classList.toggle("is-scrolled", y > 20);
    if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y > lastY && y > 600);
    lastY = y;

    if (!reduceMotion) {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      parallaxImgs.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 aprox.
        img.style.transform = "scale(1.12) translate3d(0," + (p * -5).toFixed(2) + "%,0)";
      });
    }

    if (timeline) {
      var tr = timeline.getBoundingClientRect();
      var progress = Math.min(Math.max((vh * 0.75 - tr.top) / tr.height, 0), 1);
      var vertical = window.matchMedia("(max-width: 920px)").matches;
      timelineFill.style.transform = (vertical ? "scaleY(" : "scaleX(") + progress + ")";
      phases.forEach(function (ph, i) {
        ph.classList.toggle("is-lit", progress >= (vertical ? i / phases.length + 0.05 : i / phases.length + 0.02));
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Tilt en tarjetas + brillo que sigue al mouse ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        var base = card.classList.contains("plan--featured") ? "scale(1.04) " : "";
        card.style.transform = base + "perspective(900px) rotateX(" + ((0.5 - y) * 8).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });

    /* botones magnéticos */
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.3 + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------- Formulario → WhatsApp ---------- */
  var phone = CONFIG.whatsapp || "17865465851";
  var form = document.getElementById("contactForm");
  var select = document.getElementById("serviceSelect");
  var formError = document.getElementById("formError");

  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var wanted = link.getAttribute("data-service");
      Array.prototype.forEach.call(select.options, function (o) { if (o.text === wanted) select.value = o.value; });
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.nombre.value.trim();
    if (!name) {
      formError.textContent = "Escribe tu nombre para poder saludarte.";
      form.nombre.focus();
      return;
    }
    formError.textContent = "";
    var msg = "Hola DAF! Soy " + name + ".\n" +
      "Me interesa: " + form.servicio.value + "." +
      (form.meta.value.trim() ? "\nMi meta: " + form.meta.value.trim() : "") +
      "\nQuiero agendar mi evaluación gratis.";
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  /* ---------- Testimonios ---------- */
  var testimonials = CONFIG.testimonials || [];
  if (testimonials.length) {
    var wrap = document.getElementById("testimonials");
    var track = document.getElementById("testimonialsTrack");
    testimonials.forEach(function (t) {
      var card = document.createElement("article");
      card.className = "testimonial";
      card.innerHTML = '<div class="testimonial__stars" aria-label="5 estrellas">★★★★★</div><blockquote></blockquote><cite><span></span><small></small></cite>';
      card.querySelector("blockquote").textContent = "“" + t.quote + "”";
      card.querySelector("cite span").textContent = t.name || "";
      card.querySelector("cite small").textContent = t.detail || "";
      track.appendChild(card);
    });
    wrap.hidden = false;
    var scrollBy = function (dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" }); };
    document.getElementById("tPrev").addEventListener("click", function () { scrollBy(-1); });
    document.getElementById("tNext").addEventListener("click", function () { scrollBy(1); });
  }

  /* ---------- Feed de Instagram ---------- */
  var ig = CONFIG.instagram || {};
  var grid = document.getElementById("instaGrid");
  var total = ig.postsToShow || 8;
  var profile = ig.profileUrl || "https://www.instagram.com/daf.inthegym/";

  var FALLBACK = [
    "assets/img/daf-exterior.jpg", "assets/img/grupo.jpg", "assets/img/daf-gym.jpg", "assets/img/sesion-parque.jpg",
    "assets/img/daf-retrato.jpg", "assets/img/resultado-eilen.jpg", "assets/img/daf-2005-2024.jpg", "assets/img/resultado-sydney.jpg"
  ].map(function (src) { return { image: src, url: profile, caption: "Ver en Instagram", type: "IMAGE" }; });

  function skeletons() {
    grid.innerHTML = "";
    for (var i = 0; i < total; i++) { var s = document.createElement("div"); s.className = "ig-skeleton"; grid.appendChild(s); }
  }

  function render(posts) {
    grid.innerHTML = "";
    grid.classList.add("reveal-stagger");
    posts.slice(0, total).forEach(function (p, i) {
      var a = document.createElement("a");
      a.className = "ig-post";
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.style.setProperty("--i", i);
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.caption ? p.caption.slice(0, 120) : "Publicación de Instagram de @daf.inthegym";
      img.loading = "lazy";
      a.appendChild(img);
      if (p.type === "VIDEO" || p.type === "CAROUSEL_ALBUM") {
        var badge = document.createElement("i");
        badge.className = "ig-post__type fa-solid " + (p.type === "VIDEO" ? "fa-play" : "fa-clone");
        a.appendChild(badge);
      }
      var over = document.createElement("div");
      over.className = "ig-post__over";
      over.innerHTML = '<i class="fa-brands fa-instagram"></i><span></span>';
      over.querySelector("span").textContent = p.caption || "";
      a.appendChild(over);
      grid.appendChild(a);
    });
    revealObserver.observe(grid);
  }

  function fromBehold(data) {
    var list = Array.isArray(data) ? data : (data.posts || []);
    return list.map(function (p) {
      var sizes = p.sizes || {};
      var img = (sizes.medium && sizes.medium.mediaUrl) || (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl) || p.mediaUrl;
      return { image: img, url: p.permalink, caption: p.prunedCaption || p.caption || "", type: p.mediaType };
    });
  }

  function fromGraph(data) {
    return (data.data || []).map(function (p) {
      return { image: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url, url: p.permalink, caption: p.caption || "", type: p.media_type };
    });
  }

  function loadFeed(url, mapper) {
    skeletons();
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var posts = mapper(data).filter(function (p) { return p.image; });
        render(posts.length ? posts : FALLBACK);
      })
      .catch(function () { render(FALLBACK); });
  }

  if (grid) {
    if (ig.beholdFeedUrl) {
      loadFeed(ig.beholdFeedUrl, fromBehold);
    } else if (ig.elfsightAppId) {
      grid.classList.add("insta__grid--widget");
      grid.style.display = "block";
      grid.innerHTML = '<div class="elfsight-app-' + ig.elfsightAppId.replace(/[^\w-]/g, "") + '" data-elfsight-app-lazy></div>';
      var s = document.createElement("script");
      s.src = "https://static.elfsight.com/platform/platform.js";
      s.async = true;
      document.body.appendChild(s);
    } else if (ig.graphAccessToken) {
      loadFeed("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=" + total +
        "&access_token=" + encodeURIComponent(ig.graphAccessToken), fromGraph);
    } else {
      render(FALLBACK);
    }
  }
})();
