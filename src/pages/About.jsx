"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ---------------------------------------------------------------
   Hero slider
   - Crossfades (opacity/transform only) so it never triggers layout,
     and stays smooth even on low-power devices.
   - Autoplay pauses on hover, focus, tab-blur, and when the user
     has requested reduced motion (prefers-reduced-motion).
   - Fully keyboard operable: dots are real buttons with aria-labels
     and aria-current; arrow keys move focus between them.
   - Only the active slide's image is eager/priority-loaded; the
     rest are lazy, so first paint cost stays the same as a single
     hero image.
------------------------------------------------------------------ */

const SLIDES = [
  {
    src: "/images/hero-restaurant.jpg",
    alt: "Green Valley Food One dining room, warm light over wooden tables",
  },
  {
    src: "/images/hero-coffee.jpg",
    alt: "Barista pouring freshly brewed coffee at Green Valley Food One",
  },
  {
    src: "/images/hero-dish.jpg",
    alt: "A signature dish plated at Green Valley Food One",
  },
];

const AUTOPLAY_MS = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef(null);
  const dotsRef = useRef([]);

  const goTo = useCallback((i) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (paused || reducedMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, reducedMotion]);

  // Pause autoplay when the tab isn't visible, to avoid wasted work.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onDotKeyDown = (e, i) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (i + 1) % SLIDES.length;
      goTo(next);
      dotsRef.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (i - 1 + SLIDES.length) % SLIDES.length;
      goTo(prev);
      dotsRef.current[prev]?.focus();
    }
  };

  return (
    <div
      className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-valley-ink/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Green Valley Food One gallery"
    >
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
        />
      ))}

      {/* Dot controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            ref={(el) => (dotsRef.current[i] = el)}
            type="button"
            onClick={() => goTo(i)}
            onKeyDown={(e) => onDotKeyDown(e, i)}
            aria-label={`Show slide ${i + 1} of ${SLIDES.length}: ${slide.alt}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valley-clay ${
              i === index ? "w-6 bg-valley-ivory" : "w-2.5 bg-valley-ivory/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Scroll reveal
   - Cheap, dependency-free IntersectionObserver fade/rise.
   - No-ops (renders content immediately, fully visible) when the
     user prefers reduced motion, so nothing ever depends on JS
     running for content to appear.
------------------------------------------------------------------ */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">
            About us
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            Crafted with care. Served with excellence.
          </h1>
          <p className="text-valley-ink/75 leading-relaxed mb-4">
            Welcome to Green Valley Food One, a place where great coffee and
            delicious food come together to create a warm and memorable dining
            experience. We are committed to serving quality meals, refreshing
            beverages, and authentic flavors with consistency and care.
          </p>
          <p className="text-valley-ink/75 leading-relaxed">
            What began as a humble vision has grown into a welcoming space for
            coffee lovers, families, and food enthusiasts. Whether you visit us
            for a freshly brewed coffee, a quick bite, or a full meal, Green
            Valley Food One is designed to make every moment enjoyable.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <HeroSlider />
        </Reveal>
      </section>

      <section className="bg-valley-ivory border-y border-valley-ink/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            [
              "Quality ingredients",
              "We use carefully selected ingredients to ensure fresh taste and consistency.",
            ],
            [
              "Freshly brewed coffee",
              "Our coffee is prepared with attention to aroma, flavor, and quality.",
            ],
            [
              "Authentic flavors",
              "Our menu reflects a balance of tradition, taste, and customer satisfaction.",
            ],
            [
              "Warm hospitality",
              "We believe every guest should feel welcomed and valued from the first visit.",
            ],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 100}>
              <h3 className="font-display text-lg mb-2">{title}</h3>
              <p className="text-sm text-valley-ink/70 leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <Reveal className="order-2 md:order-1">
          <img
            src="/images/owner-placeholder.jpg"
            alt="Owner of Green Valley Food One"
            className="rounded-sm w-full object-cover aspect-[4/5]"
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <Reveal delay={150} className="order-1 md:order-2">
          <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">
            About the owner
          </p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
            Mr. Venkateshwarlu
          </h2>
          <p className="text-valley-ink/75 leading-relaxed mb-4">
            Mr. Venkateshwarlu is the proud founder and guiding force behind
            Green Valley Food One. With a deep passion for hospitality and a
            strong commitment to quality, he envisioned a place where people
            could enjoy excellent food in a comfortable and welcoming
            atmosphere.
          </p>
          <p className="text-valley-ink/75 leading-relaxed mb-4">
            His approach focuses on customer satisfaction, cleanliness,
            consistency, and authentic taste. Under his leadership, Green Valley
            Food One continues to grow as a trusted destination for coffee,
            meals, and memorable dining experiences.
          </p>
          <p className="text-valley-ink/75 leading-relaxed">
            Placeholder text: You can add more details here about his journey,
            experience in the food business, inspiration behind the restaurant,
            and his vision for the future.
          </p>
        </Reveal>
      </section>

      <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 text-center">
        <Reveal>
          <p className="font-display text-2xl md:text-3xl italic leading-relaxed">
            &ldquo;At Green Valley Food One, every dish is prepared with care and
            served with pride.&rdquo;
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-valley-ink/60 mt-6">
            — Green Valley Food One
          </p>
        </Reveal>
      </section>
    </div>
  );
}