"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Loader5 from "../components/Loader5";

const SLIDES = [
  {
    src: "/images/service32.jpg",
    alt: "Friendly service moment at Green Valley Food One",
  },
  {
    src: "/images/service46.jpg",
    alt: "Friendly service moment at Green Valley Food One",
  },
  {
    src: "/images/overview15.jpg",
    alt: "Green Valley Food One overview",
  },
];

const OWNER_SLIDES = [
  {
    src: "/images/overview6.jpg",
    alt: "Owner overseeing Green Valley Food One",
  },
  {
    src: "/images/overview14.jpg",
    alt: "Owner ensuring hospitality at Green Valley Food One",
  },
  {
    src: "/images/overview1.jpg",
    alt: "Owner and the Green Valley Food One experience",
  },
];

const AUTOPLAY_MS = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReduced(mediaQuery.matches);

    const handleChange = (event) => {
      setReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reduced;
}

function ImageSlider({ slides, ariaLabel }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef(null);
  const dotsRef = useRef([]);

  const goTo = useCallback(
    (slideIndex) => {
      setIndex((slideIndex + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || reducedMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((previousIndex) => {
        return (previousIndex + 1) % slides.length;
      });
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, slides.length]);

  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  const handleDotKeyDown = (event, currentIndex) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      const nextIndex =
        (currentIndex + 1) % slides.length;

      goTo(nextIndex);
      dotsRef.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      const previousIndex =
        (currentIndex - 1 + slides.length) % slides.length;

      goTo(previousIndex);
      dotsRef.current[previousIndex]?.focus();
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
      aria-label={ariaLabel}
    >
      {slides.map((slide, slideIndex) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{
            opacity: slideIndex === index ? 1 : 0,
          }}
          aria-hidden={
            slideIndex === index ? undefined : true
          }
          loading={slideIndex === 0 ? "eager" : "lazy"}
          fetchPriority={
            slideIndex === 0 ? "high" : "auto"
          }
          decoding="async"
        />
      ))}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            ref={(element) => {
              dotsRef.current[slideIndex] = element;
            }}
            type="button"
            onClick={() => goTo(slideIndex)}
            onKeyDown={(event) =>
              handleDotKeyDown(event, slideIndex)
            }
            aria-label={`Show slide ${slideIndex + 1} of ${
              slides.length
            }: ${slide.alt}`}
            aria-current={slideIndex === index}
            className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valley-clay ${
              slideIndex === index
                ? "w-6 bg-valley-ivory"
                : "w-2.5 bg-valley-ivory/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`will-change-transform transition-[opacity,transform] duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Loader5
          onComplete={() => setLoading(false)}
        />
      )}

      {!loading && (
        <div>
          <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <Reveal>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-valley-clay">
                About us
              </p>

              <h1 className="mb-6 font-display text-4xl leading-tight md:text-5xl">
                Crafted with care. Served with excellence.
              </h1>

              <p className="mb-4 leading-relaxed text-valley-ink/75">
                Welcome to Green Valley Food One, a place where great coffee
                and delicious food come together to create a warm and memorable
                dining experience. We are committed to serving quality meals,
                refreshing beverages, and authentic flavors with consistency
                and care.
              </p>

              <p className="leading-relaxed text-valley-ink/75">
                What began as a humble vision has grown into a welcoming space
                for coffee lovers, families, and food enthusiasts. Whether you
                visit us for a freshly brewed coffee, a quick bite, or a full
                meal, Green Valley Food One is designed to make every moment
                enjoyable.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <ImageSlider
                slides={SLIDES}
                ariaLabel="Green Valley Food One gallery"
              />
            </Reveal>
          </section>

          <section className="border-y border-valley-ink/10 bg-valley-ivory">
            <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-2 md:grid-cols-4 md:px-8">
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
              ].map(([title, body], itemIndex) => (
                <Reveal
                  key={title}
                  delay={itemIndex * 100}
                >
                  <h3 className="mb-2 font-display text-lg">
                    {title}
                  </h3>

                  <p className="text-sm leading-relaxed text-valley-ink/70">
                    {body}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
            <Reveal className="order-2 md:order-1">
              <ImageSlider
                slides={OWNER_SLIDES}
                ariaLabel="Owner of Green Valley Food One"
              />
            </Reveal>

            <Reveal
              delay={150}
              className="order-1 md:order-2"
            >
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-valley-clay">
                About the owner
              </p>

              <h2 className="mb-6 font-display text-3xl leading-tight md:text-4xl">
                Mr. Venkateshwarlu
              </h2>

              <p className="mb-4 leading-relaxed text-valley-ink/75">
                Mr. Sri Gadipudi Venkateswara Rao is the proud founder and
                guiding force behind Green Valley Food One. With a deep passion
                for hospitality and a strong commitment to quality, he
                envisioned a place where people could enjoy excellent food in a
                comfortable and welcoming atmosphere.
              </p>

              <p className="mb-4 leading-relaxed text-valley-ink/75">
                His approach focuses on customer satisfaction, cleanliness,
                consistency, and authentic taste. Under his leadership, Green
                Valley Food One continues to grow as a trusted destination for
                coffee, meals, and memorable dining experiences.
              </p>

              <p className="leading-relaxed text-valley-ink/75">
                He stays personally connected to the restaurant, often seen
                overseeing daily operations himself, welcoming guests, and
                listening closely to their feedback. This hands-on presence is
                what keeps the hospitality at Green Valley Food One genuine and
                consistent, visit after visit.
              </p>
            </Reveal>
          </section>

          <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
            <Reveal>
              <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
                &ldquo;At Green Valley Food One, every dish is prepared with
                care and served with pride.&rdquo;
              </p>

              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-valley-ink/60">
                — Green Valley Food One
              </p>
            </Reveal>
          </section>
        </div>
      )}
    </>
  );
}