import { createContext, useContext, useEffect, useState } from "react";

/* =========================================================
   TEXTOS DE LA PÁGINA — español (es) e inglés (en)
   Para cambiar un texto, edítalo aquí en los dos idiomas.
   En los títulos: "*palabra*" = color azul · "|" = salto de línea
   ========================================================= */
export const STRINGS = {
  es: {
    meta: { title: "Entrenador Personal en Miami · Transformación 90 Días | DAF" },
    preloader: { label: "Cargando", tagline: "Tú pones el trabajo. Yo construyo el plan.", words: ["Sin miedo", "90 días", "Resultados reales", "Tu plan"] },
    nav: {
      links: ["Servicios", "Resultados", "Sobre mí", "90 días", "Online", "Cómo empezar", "Contacto"],
      cta: "Evaluación gratis", menu: "Menú", close: "Cerrar", open: "Abrir menú", closeAria: "Cerrar menú", home: "Inicio",
    },
    hero: {
      kicker: "Entrenador personal · Miami & Online",
      rows: [["Tú pones", "el trabajo."], ["Yo construyo", "el plan."]],
      lead: "La Transformación de 90 días para mujeres de 30+ y coaching online, con nutrición incluida. Hecho para ti — no sacado de una plantilla.",
      cta: "Agenda mi evaluación gratis", cta2: "Ver servicios",
      alt: "Gimnasio moderno con pesas y máquinas de entrenamiento",
      chips: ["Nutrición incluida", "Check-ins cada semana", "Miami & Online"],
      badge1: ["90 días", "para transformarte"],
    },
    marquee1: ["Sin miedo", "90 días", "Resultados reales", "Nutrición incluida", "Check-ins cada semana"],
    marquee2: ["Start", "Transform", "VIP", "Online"],
    about: {
      eyebrow: "Mi propia historia",
      title: "Yo tampoco | *empecé* *aquí.*",
      p1: "Sé lo que es mirarse al espejo y no reconocer a la persona que está ahí — y volver a empezar un lunes por décima vez.",
      p2: "Lo que cambió no fue la fuerza de voluntad. Fue por fin seguir un plan el tiempo suficiente para que funcionara, y tener a alguien que me lo hiciera cumplir.",
      before: "Antes", today: "Hoy", tag: "Mi transformación",
      quote: "Mi trabajo es construir el plan que encaje con la vida que de verdad tienes — y estar encima de él contigo.",
      altMain: "DAF, entrenador personal en Miami, entrenando al aire libre", altTransf: "Transformación física de DAF: antes (2005) y hoy (2026)",
    },
    services: {
      eyebrow: "Servicios de entrenamiento",
      title: "Dos formas de | *entrenar* *conmigo.*",
      lead: "La Transformación de 90 días para mujeres de 30+, o el coaching online desde donde estés. Todo construido en torno a tu vida.",
      tag: "Programa estrella",
      bgWord: "Transformación · Online · Transformación · Online",
      items: [
        { title: "Transformación 90 días", text: "Para mujeres de 30+. Por fin pierde la grasa abdominal y recupera tu energía. Tres fases. Treinta días cada una.", points: ["Nutrición según tu horario real", "Entrenamientos de 45 minutos", "Check-in y ajuste cada semana"], cta: "Ver el programa" },
        { title: "Coaching online", text: "Entrena conmigo estés donde estés. Tres niveles para elegir cuánto acompañamiento necesitas: Start, Transform y VIP.", points: ["Rutina y guía nutricional", "Check-ins y corrección de ejercicios", "Coaching 1:1 y videollamadas (VIP)"], cta: "Ver planes" },
      ],
    },
    steps: {
      eyebrow: "Cómo empezar",
      title: "Tres pasos para | *empezar.*",
      items: [
        { title: "Agenda tu evaluación gratis", text: "Escríbeme por WhatsApp o llena el formulario. La llamada es gratis y sin compromiso." },
        { title: "Repasamos tu caso", text: "Hablamos de tu meta, tu historial y tu horario, y te digo con honestidad qué programa es para ti. Si no lo es, te lo digo." },
        { title: "Recibes tu plan y empezamos", text: "Tu plan se construye alrededor de tu vida — tu horario y la comida que de verdad comes — y se ajusta según tu progreso." },
      ],
      cta: "Agenda mi evaluación gratis",
      ctaNote: "Gratis y sin compromiso.",
    },
    t90: {
      eyebrow: "Para mujeres de 30+ · Miami",
      title: "Transformación | *90* *días*",
      lead: "Por fin pierde la grasa abdominal y recupera tu energía. En 90 días.",
      p1: "Ya hiciste las dietas, las clases de las 6am, las apps. Funcionaron tres semanas y después tu cuerpo dejó de responder.",
      strong: "No eres floja y nada está roto.",
      p2: "Simplemente nunca tuviste un plan hecho para el cuerpo que tienes hoy.",
      bigWord: "90 días",
      painsTitle: "¿Te suena? | Esto es para ti si…",
      painsFoot: "Si dijiste que sí a tres o más — eres exactamente para quien se creó esto.",
      pains: [
        "Ya perdiste peso antes y recuperaste cada libra.",
        "La grasa abdominal no se mueve por más poco que comas.",
        "Vives a base de café y te desplomas a las 3pm.",
        "Tu ropa te queda distinta que hace dos años.",
        "No tienes dos horas al día para un gym.",
        "Ya te cansaste de planes de comida que ignoran tu familia y tu trabajo.",
        "Quieres a alguien que de verdad esté pendiente de ti — no una app.",
      ],
      phasesTitle: "Tres fases. | *Treinta* *días* *cada* *una.*",
      phasesLead: "Después de los 30, las palancas que de verdad mueven la grasa abdominal son músculo, sueño y constancia — en ese orden.",
      phases: [
        { days: "Días 1–30", title: "Reinicio", text: "Primero ordenamos comida, sueño e hidratación, y te ponemos a moverte con buena técnica. Aquí baja la hinchazón y vuelve la energía." },
        { days: "Días 31–60", title: "Reconstrucción", text: "Trabajo de fuerza que reforma en lugar de solo reducir. Tu plan se ajusta cada semana según lo que tu cuerpo está haciendo de verdad." },
        { days: "Días 61–90", title: "Consolidación", text: "La parte que todos los demás programas se saltan: que se mantenga. Terminas sabiendo cómo comer, entrenar y viajar sin perder lo que lograste." },
      ],
      getsEyebrow: "Lo que recibes",
      getsTitle: "Todo construido en torno a *tu* *vida.*",
      gets: [
        "Plan de nutrición según tu horario real",
        "Entrenamiento que terminas en 45 minutos",
        "Check-in y ajuste de plan cada semana",
        "Corrección de técnica para que nada te duela",
        "Coaching de energía, sueño y estrés",
        "Acceso directo a tu coach por WhatsApp",
      ],
      groupAlt: "Clientas de DAF después de una sesión de entrenamiento en Miami",
      whoLabel: "Con quién trabajo",
      who: [
        "Mujeres que quieren perder grasa abdominal", "Mamás ocupadas sin horas de sobra", "Mujeres que vuelven después de años sin entrenar",
        "Profesionales ocupadas", "Mamás en posparto", "Principiantes totales", "Mujeres de 50+", "Cualquiera cansada de empezar de cero",
      ],
      ctaText: "Si tú pones el trabajo — ", ctaAccent: "yo construyo el plan.",
      cta: "Agenda mi evaluación gratis", wa: "Hola DAF! Me interesa la Transformación de 90 días.",
    },
    online: {
      eyebrow: "Coaching online",
      title: "Entrena conmigo | *desde* *donde* *estés.*",
      choose: "Elegir",
      wa: (plan) => `Hola DAF! Me interesa el plan ${plan}. ¿Me das más información?`,
      plans: {
        Start: ["Rutina", "Guía básica de alimentación", "Comunidad", "Seguimiento mensual"],
        Transform: ["Rutina personalizada", "Guía nutricional", "Check-in semanal", "Corrección de ejercicios", "Comunidad"],
        VIP: ["Coaching 1:1", "Plan personalizado", "Check-ins frecuentes", "Videollamadas"],
      },
    },
    results: {
      eyebrow: "Resultados reales de clientas",
      title: "Mujeres que dejaron de | *empezar* *de* *cero.*",
      note: "Clientas reales, usadas con permiso. Los resultados varían de una persona a otra.",
      names: ["Eilen, madre de 3", "Sydney", "Génesis", "Día 1 vs. día 21"],
      alt: "Antes y después de clienta de la Transformación 90 días",
      hint: "Sigue bajando para ver cada resultado",
    },
    insta: { eyebrow: "Instagram", follow: "Seguir", reel: "Reel", alt: "Publicación de @daf.inthegym" },
    topics: {
      eyebrow: "Entrenamiento personal",
      title: "Entrenamiento personal en | *Miami* *y* *online.*",
      paragraphs: [
        "Soy DAF, entrenador personal en Miami. Ayudo a mujeres de 30+ a bajar de peso y perder grasa abdominal, ganar fuerza y recuperar su energía con un plan de entrenamiento y nutrición hecho para su vida real — no sacado de una plantilla.",
        "Puedes entrenar conmigo de dos formas: con la Transformación de 90 días en Miami, o con coaching online desde cualquier lugar. En ambas tu plan se construye después de mirar tu horario, tu historial y lo que de verdad vas a comer, y se ajusta según tu progreso.",
      ],
      items: [
        { title: "Bajar de peso y grasa abdominal", text: "Músculo, sueño y constancia: las palancas que de verdad mueven la grasa abdominal después de los 30 — sin dietas extremas.", href: "#transformacion" },
        { title: "Entrenamiento de fuerza", text: "Trabajo de fuerza que reforma en lugar de solo reducir, en entrenamientos de 45 minutos.", href: "#transformacion" },
        { title: "Plan de nutrición", text: "Nutrición según tu horario real y con la comida que ya comes, incluyendo lo que come tu familia.", href: "#transformacion" },
        { title: "Entrenamiento para mujeres de 30+", text: "Un programa pensado para el cuerpo, el horario y el estrés de una mujer de más de 30.", href: "#transformacion" },
        { title: "Principiantes y regreso al gym", text: "Para empezar desde cero o volver después de años sin entrenar. Ponerte en forma es mi trabajo.", href: "#preguntas" },
        { title: "Entrenamiento posparto", text: "Con el alta de tu doctor, empiezas con una progresión distinta y de ahí construimos.", href: "#preguntas" },
        { title: "Coaching fitness online", text: "Rutina, guía nutricional y seguimiento desde donde estés: planes Start, Transform y VIP.", href: "#online" },
        { title: "Técnica sin dolor", text: "Corrección de técnica para que entrenes seguro y nada te duela.", href: "#transformacion" },
        { title: "Energía, sueño y estrés", text: "Coaching de hábitos para que dejes de vivir a base de café y desplomarte a las 3pm.", href: "#transformacion" },
        { title: "Seguimiento cada semana", text: "Check-in y ajuste del plan cada semana, con acceso directo a tu coach por WhatsApp.", href: "#como-empezar" },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Antes de | *agendar.*",
      items: [
        ["Ya lo intenté todo. ¿Por qué esto sería diferente?", "Porque nada de lo que recibes es genérico. Tu plan se construye después de mirar tu horario, tu historial, tus lesiones y la comida que de verdad vas a comer — y luego se ajusta cada semana, en vez de entregártelo una sola vez."],
        ["¿Tengo que estar en forma para empezar?", "No. La mayoría de mis clientas empiezan después de años sin entrenar. Ponerte en forma es mi trabajo, no tu requisito de entrada."],
        ["¿Tengo que dejar la comida que me gusta?", "No. Un plan que odias es un plan que abandonas. Tu nutrición se construye alrededor de comida que ya comes, incluyendo lo que come tu familia."],
        ["Acabo de tener un bebé. ¿Puedo entrar?", "Sí, una vez que tengas el alta de tu doctor. Las clientas en posparto empiezan con una progresión distinta y de ahí construimos."],
        ["¿Qué pasa en la llamada de evaluación gratis?", "Repasamos tu meta, tu historial y tu horario, y te digo con honestidad si el programa es lo correcto para ti. Si no lo es, te lo digo."],
        ["¿El coaching online sirve si no vivo en Miami?", "Sí. El coaching online es para entrenar conmigo desde donde estés, con rutina, guía nutricional y seguimiento según el plan que elijas: Start, Transform o VIP."],
        ["¿Cuánto dura cada entrenamiento?", "Los entrenamientos de la Transformación de 90 días están pensados para que los termines en 45 minutos. No necesitas dos horas al día."],
        ["¿El programa incluye plan de nutrición?", "Sí. Recibes un plan de nutrición según tu horario real, construido alrededor de la comida que ya comes, y se ajusta en los check-ins."],
        ["¿Qué diferencia hay entre los planes online Start, Transform y VIP?", "Start incluye rutina, guía básica de alimentación, comunidad y seguimiento mensual. Transform suma rutina personalizada, guía nutricional, check-in semanal y corrección de ejercicios. VIP es coaching 1:1 con plan personalizado, check-ins frecuentes y videollamadas."],
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "Dame | *90* *días.*",
      lead: "Ya sabes cómo se siente otro año empezando de cero. La llamada de evaluación es gratis y sin compromiso. En el peor de los casos, te vas con una respuesta clara sobre tu propio cuerpo.",
      formTitle: "Agenda mi evaluación gratis", formHint: "Te respondo por WhatsApp.",
      name: "Nombre", namePh: "Tu nombre", interest: "¿Qué te interesa?", goal: "Tu meta", goalPh: "Cuéntame qué quieres lograr",
      submit: "Enviar por WhatsApp", error: "Escribe tu nombre para poder saludarte.",
      services: ["Transformación 90 días", "Online · Start", "Online · Transform", "Online · VIP", "Aún no lo sé"],
      message: (name, service, goal) => `Hola DAF! Soy ${name}.\nMe interesa: ${service}.${goal ? `\nMi meta: ${goal}` : ""}\nQuiero agendar mi evaluación gratis.`,
    },
    footer: {
      links: ["Servicios", "Resultados", "Sobre mí", "90 días", "Online", "Preguntas", "Contacto"],
      legal: "Los resultados varían y dependen del esfuerzo y la constancia de cada persona. Este programa es coaching y educación, no consejo médico. Consulta a tu doctor antes de comenzar cualquier plan de nutrición o ejercicio.",
    },
    misc: {
      waAria: "Escríbeme por WhatsApp", waMsg: "Hola DAF! Quiero más información.", waEval: "Hola DAF! Quiero agendar mi evaluación gratis.",
      toTop: "Volver arriba", langLabel: "Idioma",
      sections: ["Servicios", "Resultados", "Sobre mí", "Transformación 90 días", "Coaching online", "Instagram", "Entrenamiento", "Cómo empezar", "Preguntas", "Contacto"],
      swipe: "Desliza para ver los planes",
    },
  },

  en: {
    meta: { title: "Personal Trainer in Miami · 90-Day Transformation | DAF" },
    preloader: { label: "Loading", tagline: "You put in the work. I build the plan.", words: ["No fear", "90 days", "Real results", "Your plan"] },
    nav: {
      links: ["Services", "Results", "About", "90 days", "Online", "How to start", "Contact"],
      cta: "Free assessment", menu: "Menu", close: "Close", open: "Open menu", closeAria: "Close menu", home: "Home",
    },
    hero: {
      kicker: "Personal trainer · Miami & Online",
      rows: [["You put in", "the work."], ["I build", "the plan."]],
      lead: "The 90-Day Transformation for women 30+ and online coaching, nutrition included. Made for you — not pulled from a template.",
      cta: "Book my free assessment", cta2: "See services",
      alt: "Modern gym with weights and training machines",
      chips: ["Nutrition included", "Weekly check-ins", "Miami & Online"],
      badge1: ["90 days", "to transform"],
    },
    marquee1: ["No fear", "90 days", "Real results", "Nutrition included", "Weekly check-ins"],
    marquee2: ["Start", "Transform", "VIP", "Online"],
    about: {
      eyebrow: "My own story",
      title: "I didn't start | *here* *either.*",
      p1: "I know what it's like to look in the mirror and not recognize the person staring back — and to start over on a Monday for the tenth time.",
      p2: "What changed wasn't willpower. It was finally sticking to a plan long enough for it to work, and having someone hold me to it.",
      before: "Before", today: "Today", tag: "My transformation",
      quote: "My job is to build the plan that fits the life you actually have — and stay on top of it with you.",
      altMain: "DAF, personal trainer in Miami, training outdoors", altTransf: "DAF's body transformation: before (2005) and today (2026)",
    },
    services: {
      eyebrow: "Training services",
      title: "Two ways to | *train* *with* *me.*",
      lead: "The 90-Day Transformation for women 30+, or online coaching from wherever you are. Everything built around your life.",
      tag: "Flagship program",
      bgWord: "Transformation · Online · Transformation · Online",
      items: [
        { title: "90-Day Transformation", text: "For women 30+. Finally lose the belly fat and get your energy back. Three phases. Thirty days each.", points: ["Nutrition built around your real schedule", "45-minute workouts", "Weekly check-in and adjustments"], cta: "See the program" },
        { title: "Online coaching", text: "Train with me wherever you are. Three levels so you choose how much support you need: Start, Transform and VIP.", points: ["Workouts and nutrition guide", "Check-ins and exercise correction", "1:1 coaching and video calls (VIP)"], cta: "See plans" },
      ],
    },
    steps: {
      eyebrow: "How to start",
      title: "Three steps to | *get* *started.*",
      items: [
        { title: "Book your free assessment", text: "Message me on WhatsApp or fill out the form. The call is free and no-commitment." },
        { title: "We go over your situation", text: "We talk about your goal, your history and your schedule, and I'll tell you honestly which program is right for you. If none is, I'll tell you." },
        { title: "Get your plan and start", text: "Your plan is built around your life — your schedule and the food you actually eat — and adjusted as you progress." },
      ],
      cta: "Book my free assessment",
      ctaNote: "Free and no-commitment.",
    },
    t90: {
      eyebrow: "For women 30+ · Miami",
      title: "*90-day* | transformation",
      lead: "Finally lose the belly fat and get your energy back. In 90 days.",
      p1: "You've done the diets, the 6am classes, the apps. They worked for three weeks and then your body stopped responding.",
      strong: "You're not lazy and nothing is broken.",
      p2: "You just never had a plan built for the body you have today.",
      bigWord: "90 days",
      painsTitle: "Sound familiar? | This is for you if…",
      painsFoot: "If you said yes to three or more — this was made exactly for you.",
      pains: [
        "You've lost weight before and gained back every pound.",
        "The belly fat won't budge no matter how little you eat.",
        "You run on coffee and crash at 3pm.",
        "Your clothes fit differently than they did two years ago.",
        "You don't have two hours a day for the gym.",
        "You're tired of meal plans that ignore your family and your job.",
        "You want someone who actually keeps an eye on you — not an app.",
      ],
      phasesTitle: "Three phases. | *Thirty* *days* *each.*",
      phasesLead: "After 30, the levers that actually move belly fat are muscle, sleep and consistency — in that order.",
      phases: [
        { days: "Days 1–30", title: "Reset", text: "First we sort out food, sleep and hydration, and get you moving with good technique. This is where the bloating goes down and your energy comes back." },
        { days: "Days 31–60", title: "Rebuild", text: "Strength work that reshapes instead of just shrinking. Your plan is adjusted every week based on what your body is actually doing." },
        { days: "Days 61–90", title: "Lock it in", text: "The part every other program skips: making it last. You finish knowing how to eat, train and travel without losing what you achieved." },
      ],
      getsEyebrow: "What you get",
      getsTitle: "Everything built around *your* *life.*",
      gets: [
        "A nutrition plan based on your real schedule",
        "Workouts you finish in 45 minutes",
        "Weekly check-in and plan adjustment",
        "Technique correction so nothing hurts",
        "Energy, sleep and stress coaching",
        "Direct access to your coach on WhatsApp",
      ],
      groupAlt: "DAF's clients after a training session in Miami",
      whoLabel: "Who I work with",
      who: [
        "Women who want to lose belly fat", "Busy moms with no hours to spare", "Women coming back after years without training",
        "Busy professionals", "Postpartum moms", "Total beginners", "Women 50+", "Anyone tired of starting over",
      ],
      ctaText: "If you put in the work — ", ctaAccent: "I'll build the plan.",
      cta: "Book my free assessment", wa: "Hi DAF! I'm interested in the 90-Day Transformation.",
    },
    online: {
      eyebrow: "Online coaching",
      title: "Train with me | *wherever* *you* *are.*",
      choose: "Choose",
      wa: (plan) => `Hi DAF! I'm interested in the ${plan} plan. Can you tell me more?`,
      plans: {
        Start: ["Workout routine", "Basic nutrition guide", "Community", "Monthly follow-up"],
        Transform: ["Personalized workouts", "Nutrition guide", "Weekly check-in", "Exercise correction", "Community"],
        VIP: ["1:1 coaching", "Personalized plan", "Frequent check-ins", "Video calls"],
      },
    },
    results: {
      eyebrow: "Real client results",
      title: "Women who stopped | *starting* *over.*",
      note: "Real clients, shared with permission. Results vary from person to person.",
      names: ["Eilen, mother of 3", "Sydney", "Génesis", "Day 1 vs. day 21"],
      alt: "Before and after of a 90-Day Transformation client",
      hint: "Keep scrolling to see each result",
    },
    insta: { eyebrow: "Instagram", follow: "Follow", reel: "Reel", alt: "Post by @daf.inthegym" },
    topics: {
      eyebrow: "Personal training",
      title: "Personal training in | *Miami* *and* *online.*",
      paragraphs: [
        "I'm DAF, a personal trainer in Miami. I help women 30+ lose weight and belly fat, build strength and get their energy back with a training and nutrition plan built for their real life — not pulled from a template.",
        "You can train with me in two ways: the 90-Day Transformation in Miami, or online coaching from anywhere. Either way, your plan is built after looking at your schedule, your history and what you'll actually eat, and it's adjusted as you progress.",
      ],
      items: [
        { title: "Weight and belly fat loss", text: "Muscle, sleep and consistency: the levers that actually move belly fat after 30 — no extreme diets.", href: "#transformacion" },
        { title: "Strength training", text: "Strength work that reshapes instead of just shrinking, in 45-minute workouts.", href: "#transformacion" },
        { title: "Nutrition plan", text: "Nutrition built around your real schedule and the food you already eat, including your family's.", href: "#transformacion" },
        { title: "Training for women 30+", text: "A program designed for the body, schedule and stress of a woman over 30.", href: "#transformacion" },
        { title: "Beginners and getting back into it", text: "Start from zero or come back after years without training. Getting you in shape is my job.", href: "#preguntas" },
        { title: "Postpartum training", text: "Once your doctor clears you, you start with a different progression and we build from there.", href: "#preguntas" },
        { title: "Online fitness coaching", text: "Workouts, nutrition guide and follow-up wherever you are: Start, Transform and VIP plans.", href: "#online" },
        { title: "Pain-free technique", text: "Technique correction so you train safely and nothing hurts.", href: "#transformacion" },
        { title: "Energy, sleep and stress", text: "Habit coaching so you stop running on coffee and crashing at 3pm.", href: "#transformacion" },
        { title: "Weekly check-ins", text: "Weekly check-in and plan adjustment, with direct access to your coach on WhatsApp.", href: "#como-empezar" },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Before you | *book.*",
      items: [
        ["I've tried everything. Why would this be different?", "Because nothing you get is generic. Your plan is built after looking at your schedule, your history, your injuries and the food you'll actually eat — and then it's adjusted every week, instead of being handed to you once."],
        ["Do I need to be in shape to start?", "No. Most of my clients start after years without training. Getting you in shape is my job, not your entry requirement."],
        ["Do I have to give up the food I love?", "No. A plan you hate is a plan you quit. Your nutrition is built around food you already eat, including what your family eats."],
        ["I just had a baby. Can I join?", "Yes, once your doctor clears you. Postpartum clients start with a different progression and we build from there."],
        ["What happens on the free assessment call?", "We go over your goal, your history and your schedule, and I'll tell you honestly whether the program is right for you. If it isn't, I'll tell you."],
        ["Does online coaching work if I don't live in Miami?", "Yes. Online coaching is for training with me wherever you are, with workouts, a nutrition guide and follow-up depending on the plan you choose: Start, Transform or VIP."],
        ["How long is each workout?", "The 90-Day Transformation workouts are designed so you finish them in 45 minutes. You don't need two hours a day."],
        ["Does the program include a nutrition plan?", "Yes. You get a nutrition plan based on your real schedule, built around the food you already eat, and adjusted at your check-ins."],
        ["What's the difference between the Start, Transform and VIP online plans?", "Start includes a workout routine, a basic nutrition guide, community and monthly follow-up. Transform adds personalized workouts, a nutrition guide, weekly check-ins and exercise correction. VIP is 1:1 coaching with a personalized plan, frequent check-ins and video calls."],
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Give me | *90* *days.*",
      lead: "You already know what another year of starting over feels like. The assessment call is free and no-commitment. At worst, you walk away with a clear answer about your own body.",
      formTitle: "Book my free assessment", formHint: "I'll reply on WhatsApp.",
      name: "Name", namePh: "Your name", interest: "What are you interested in?", goal: "Your goal", goalPh: "Tell me what you want to achieve",
      submit: "Send via WhatsApp", error: "Please enter your name so I know who I'm talking to.",
      services: ["90-Day Transformation", "Online · Start", "Online · Transform", "Online · VIP", "Not sure yet"],
      message: (name, service, goal) => `Hi DAF! I'm ${name}.\nI'm interested in: ${service}.${goal ? `\nMy goal: ${goal}` : ""}\nI'd like to book my free assessment.`,
    },
    footer: {
      links: ["Services", "Results", "About", "90 days", "Online", "FAQ", "Contact"],
      legal: "Results vary and depend on each person's effort and consistency. This program is coaching and education, not medical advice. Check with your doctor before starting any nutrition or exercise plan.",
    },
    misc: {
      waAria: "Message me on WhatsApp", waMsg: "Hi DAF! I'd like more information.", waEval: "Hi DAF! I'd like to book my free assessment.",
      toTop: "Back to top", langLabel: "Language",
      sections: ["Services", "Results", "About", "90-Day Transformation", "Online coaching", "Instagram", "Training", "How to start", "Questions", "Contact"],
      swipe: "Swipe to see the plans",
    },
  },
};

/* ---------- Idioma activo ---------- */
const LangContext = createContext({ lang: "es", setLang: () => {} });

const isBot = () => typeof navigator !== "undefined" && /bot|crawl|spider|slurp|google|bing|lighthouse|facebookexternalhit|whatsapp/i.test(navigator.userAgent);
const urlLang = () => (window.location.pathname.replace(/\/+$/, "/").startsWith("/en/") || window.location.pathname === "/en" ? "en" : "es");

/* La dirección manda: "/" es español y "/en/" es inglés (así Google indexa cada idioma por separado).
   Para personas: si la abren por primera vez sin haber elegido idioma, se usa el idioma del teléfono/PC. */
function initialLang(fallback) {
  if (typeof window === "undefined") return fallback || "es";
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (fromQuery === "es" || fromQuery === "en") return fromQuery;
    if (urlLang() === "en") return "en";
    if (isBot()) return "es";
    const saved = localStorage.getItem("daf-lang");
    if (saved === "es" || saved === "en") return saved;
    return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
  } catch {
    return urlLang();
  }
}

export function LangProvider({ children, initial }) {
  const [lang, setLangState] = useState(() => initialLang(initial));
  const setLang = (l) => {
    try { localStorage.setItem("daf-lang", l); } catch { /* ignorar */ }
    setLangState(l);
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = STRINGS[lang].meta.title;
    // la dirección refleja el idioma (sin recargar la página)
    const want = lang === "en" ? "/en/" : "/";
    const here = window.location.pathname;
    if (here !== want && !(lang === "es" && here === "/index.html")) {
      const params = new URLSearchParams(window.location.search);
      params.delete("lang");
      const q = params.toString();
      window.history.replaceState(null, "", want + (q ? `?${q}` : "") + window.location.hash);
    }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = () => STRINGS[useContext(LangContext).lang];
