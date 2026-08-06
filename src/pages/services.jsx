"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Award,
  Car,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Clock,
  ConciergeBell,
  Flame,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

const PHONE_NUMBER = "9866255533";
const DISPLAY_PHONE = "98662 55533";
const COUNTRY_CODE = "91";

const PHONE_LINK = `tel:+${COUNTRY_CODE}${PHONE_NUMBER}`;

const WHATSAPP_LINK = `https://wa.me/${COUNTRY_CODE}${PHONE_NUMBER}?text=${encodeURIComponent(
  "Hello Green Valley Food One, I would like to know more."
)}`;

const EXPERIENCES = {
  restaurant: {
    label: "Restaurant",
    hours: "Open 11 AM — 11 PM",
    tag: "Andhra Cuisine · Family Dining",
    title: "Green Valley Restaurant",
    copy:
      "Enjoy authentic Andhra flavours, traditional meals, biryanis, curries, and delicious dishes prepared fresh for every guest.",
    img: "/images/restaurant-dining.jpg",
    stats: [
      {
        value: "60+",
        label: "Dishes",
        sub: "Traditional and modern flavours.",
      },
      {
        value: "100%",
        label: "Fresh",
        sub: "Prepared with quality ingredients.",
      },
      {
        value: "4.8★",
        label: "Guest Love",
        sub: "Loved by our customers.",
      },
    ],
  },

  cafe: {
    label: "Café",
    hours: "Open 8 AM — 10 PM",
    tag: "Coffee · Snacks · Conversations",
    title: "Green Valley Café",
    copy:
      "Take a break with freshly brewed coffee, refreshing beverages, desserts, and light snacks in a comfortable atmosphere.",
    img: "/images/cafe-interior.jpg",
    stats: [
      {
        value: "100%",
        label: "Fresh Coffee",
        sub: "Brewed with care every day.",
      },
      {
        value: "25+",
        label: "Cafe Items",
        sub: "Coffee, snacks and desserts.",
      },
      {
        value: "4.8★",
        label: "Guest Love",
        sub: "A place to relax and connect.",
      },
    ],
  },
};

const SERVICES = [
  {
    icon: UtensilsCrossed,
    title: "Authentic Dining",
    copy:
      "Enjoy carefully prepared Andhra dishes and restaurant favourites made with traditional flavours.",
    img: "/images/andhra-meals.jpg",
  },
  {
    icon: Coffee,
    title: "Freshly Brewed Coffee",
    copy:
      "Relax with aromatic coffee prepared from carefully selected beans and served fresh.",
    img: "/images/filter-coffee.jpg",
  },
  {
    icon: Flame,
    title: "Freshly Prepared Food",
    copy:
      "Every order is prepared with attention to freshness, taste, cleanliness, and quality.",
    img: "/images/restaurant-kitchen.jpg",
  },
  {
    icon: Leaf,
    title: "Quality Ingredients",
    copy:
      "We choose fresh and reliable ingredients to maintain the flavour and quality of every dish.",
    img: "/images/fresh-ingredients.jpg",
  },
  {
    icon: Sparkles,
    title: "Comfortable Ambience",
    copy:
      "A clean, calm, and welcoming space for families, friends, conversations, and celebrations.",
    img: "/images/cafe-seating.jpg",
  },
  {
    icon: Star,
    title: "Warm Hospitality",
    copy:
      "Our team is committed to making every visit comfortable, enjoyable, and memorable.",
    img: "/images/restaurant-service.jpg",
  },
];

const STANDARDS = [
  {
    icon: Award,
    title: "Skilled & Experienced Team",
    copy: "Trained cooks and staff who know the craft — no shortcuts.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Kitchen Hygiene",
    copy: "Sanitised prep stations and hygiene checks, every single shift.",
  },
  {
    icon: Sparkles,
    title: "Spotless Dining & Café",
    copy: "Tables, seating, and counters reset before every guest sits down.",
  },
  {
    icon: ConciergeBell,
    title: "Attentive Table Service",
    copy: "Orders taken promptly, and checked on without being asked twice.",
  },
  {
    icon: Truck,
    title: "On-Time Delivery",
    copy: "Orders dispatched fast and tracked until they reach your door.",
  },
  {
    icon: Package,
    title: "Secure, Careful Packing",
    copy:
      "Leak-proof, sealed packaging so food travels the way it left the kitchen.",
  },
  {
    icon: Smile,
    title: "Respectful Hospitality",
    copy:
      "Every guest greeted, heard, and served with patience and courtesy.",
  },
  {
    icon: Car,
    title: "On-Site Parking",
    copy: "Free, easy parking right outside for two- and four-wheelers.",
  },
];

const HERO_SLIDES = [
  {
    src: "/images/restaurant-dining.jpg",
    alt: "Green Valley restaurant dining area",
  },
  {
    src: "/images/cafe-interior.jpg",
    alt: "Green Valley cafe interior",
  },
  {
    src: "/images/coffee-and-dessert.jpg",
    alt: "Coffee and dessert at Green Valley",
  },
];

const AMBIANCE = [
  "/images/cafe-seating.jpg",
  "/images/filter-coffee.jpg",
  "/images/andhra-meals.jpg",
  "/images/restaurant-dining.jpg",
];

const AUTOPLAY_MS = 5000;

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dotsRef = useRef([]);

  const goTo = useCallback((slideIndex) => {
    setIndex((slideIndex + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const next = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const previous = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (paused || reducedMotion) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleDotKeyDown = (event, currentIndex) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      const nextIndex = (currentIndex + 1) % HERO_SLIDES.length;

      goTo(nextIndex);
      dotsRef.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      const previousIndex =
        (currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;

      goTo(previousIndex);
      dotsRef.current[previousIndex]?.focus();
    }
  };

  return (
    <div className="relative">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4/5" }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Green Valley restaurant and cafe photos"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-[900ms] ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {HERO_SLIDES.map((slide, slideIndex) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className="h-full w-full flex-shrink-0 object-cover"
              loading={slideIndex === 0 ? "eager" : "lazy"}
              fetchPriority={slideIndex === 0 ? "high" : "auto"}
              decoding="async"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={previous}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "rgba(246,241,231,0.9)",
            color: "#1F3A2A",
            outlineColor: "#C7A339",
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "rgba(246,241,231,0.9)",
            color: "#1F3A2A",
            outlineColor: "#C7A339",
          }}
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((slide, slideIndex) => (
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
              aria-label={`Show photo ${slideIndex + 1}`}
              aria-current={slideIndex === index}
              className="h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                width: slideIndex === index ? 24 : 10,
                background:
                  slideIndex === index
                    ? "#F6F1E7"
                    : "rgba(246,241,231,0.5)",
                outlineColor: "#C7A339",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GreenValleyServices() {
  const [activeTab, setActiveTab] = useState("restaurant");
  const activeExperience = EXPERIENCES[activeTab];

  return (
    <main
      className="min-h-screen w-full overflow-hidden"
      style={{
        background: "#F6F1E7",
        color: "#20241F",
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Work+Sans:wght@300;400;500;600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }

        .eyebrow {
          letter-spacing: 0.2em;
        }

        .tab-btn,
        .service-card,
        .service-image,
        .gallery-image,
        .standard-card,
        .standard-icon {
          transition: all 0.35s ease;
        }

        .service-card:hover {
          transform: translateY(-6px);
          border-color: #C7A339 !important;
        }

        .service-card:hover .service-image {
          transform: scale(1.06);
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.06);
        }

        .standard-card:hover {
          transform: translateY(-4px);
          border-color: #C7A339 !important;
          box-shadow: 0 12px 24px rgba(31,58,42,0.08);
        }

        .standard-card:hover .standard-icon {
          background: #1F3A2A !important;
        }

        .standard-card:hover .standard-icon svg {
          color: #F6F1E7 !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .tab-btn,
          .service-card,
          .service-image,
          .gallery-image,
          .standard-card,
          .standard-icon {
            transition: none !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center px-6 py-6 md:px-10">
        <a
          href="/"
          className="font-display text-xl"
          style={{ color: "#1F3A2A" }}
        >
          Green Valley
        </a>
      </nav>

      {/* Hero */}
      <header className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pb-24 md:pt-12">
        <div>
          <p
            className="eyebrow mb-5 text-xs uppercase"
            style={{ color: "#C7A339" }}
          >
            Fresh flavours · Warm hospitality
          </p>

          <h1
            className="font-display mb-6 text-5xl leading-[1.05] md:text-7xl"
            style={{ color: "#1F3A2A" }}
          >
            A place for
            <br />
            <span className="italic">great taste.</span>
          </h1>

          <p
            className="mb-8 max-w-md text-base leading-relaxed"
            style={{ color: "rgba(32,36,31,0.7)" }}
          >
            Welcome to Green Valley Food One — a welcoming restaurant and café
            serving authentic food, freshly brewed coffee, and memorable
            experiences in Santhamaguluru.
          </p>

          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "rgba(32,36,31,0.65)" }}
          >
            <Star size={15} color="#C7A339" fill="#C7A339" />
            4.8 guest rating
            <span style={{ color: "rgba(32,36,31,0.3)" }}>·</span>
            <Clock size={15} />
            Open today
          </div>
        </div>

        <HeroSlider />
      </header>

      {/* Standards */}
      <section
        id="standards"
        className="mx-auto max-w-6xl border-t px-6 py-16 md:px-10 md:py-20"
        style={{ borderColor: "rgba(31,58,42,0.1)" }}
      >
        <p
          className="eyebrow mb-3 text-xs uppercase"
          style={{ color: "#C7A339" }}
        >
          Beyond the menu
        </p>

        <h2
          className="font-display mb-2 text-3xl md:text-4xl"
          style={{ color: "#1F3A2A" }}
        >
          Care in every detail.
        </h2>

        <p
          className="mb-10 max-w-lg text-sm leading-relaxed"
          style={{ color: "rgba(32,36,31,0.65)" }}
        >
          What you notice beyond the food — a trained team, a clean space,
          careful packing, and someone who treats you well from the door to
          the parking lot.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {STANDARDS.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="standard-card rounded-xl border p-5"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(31,58,42,0.1)",
              }}
            >
              <div
                className="standard-icon mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(199,163,57,0.15)" }}
              >
                <Icon size={18} strokeWidth={1.75} color="#1F3A2A" />
              </div>

              <h3
                className="font-display mb-1.5 text-base leading-snug"
                style={{ color: "#1F3A2A" }}
              >
                {title}
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(32,36,31,0.6)" }}
              >
                {copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant and Cafe */}
      <section
        id="restaurant"
        className="mx-auto max-w-6xl border-t px-6 py-16 md:px-10 md:py-20"
        style={{ borderColor: "rgba(31,58,42,0.1)" }}
      >
        <p
          className="eyebrow mb-3 text-xs uppercase"
          style={{ color: "#C7A339" }}
        >
          Restaurant and café
        </p>

        <h2
          className="font-display mb-8 text-3xl md:text-4xl"
          style={{ color: "#1F3A2A" }}
        >
          Choose your experience.
        </h2>

        <div className="mb-10 flex gap-3">
          {Object.entries(EXPERIENCES).map(([key, experience]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className="tab-btn rounded-full border px-5 py-2.5 text-sm"
              style={{
                background:
                  activeTab === key ? "#1F3A2A" : "transparent",
                color:
                  activeTab === key ? "#F6F1E7" : "#1F3A2A",
                borderColor: "#1F3A2A",
              }}
            >
              {experience.label}
            </button>
          ))}
        </div>

        <div
          id="cafe"
          className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative">
            <img
              src={activeExperience.img}
              alt={activeExperience.title}
              className="w-full rounded-2xl object-cover"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-xs"
                style={{
                  background: "rgba(246,241,231,0.95)",
                  color: "#1F3A2A",
                }}
              >
                {activeExperience.hours}
              </span>

              <span
                className="rounded-full px-3 py-1.5 text-xs"
                style={{
                  background: "rgba(246,241,231,0.95)",
                  color: "#1F3A2A",
                }}
              >
                {activeExperience.tag}
              </span>
            </div>
          </div>

          <div>
            <h3
              className="font-display mb-3 text-2xl md:text-3xl"
              style={{ color: "#1F3A2A" }}
            >
              {activeExperience.title}
            </h3>

            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ color: "rgba(32,36,31,0.7)" }}
            >
              {activeExperience.copy}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {activeExperience.stats.map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-display text-2xl"
                    style={{ color: "#1F3A2A" }}
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-medium">
                    {stat.label}
                  </p>

                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "rgba(32,36,31,0.55)" }}
                  >
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-16 md:py-20"
        style={{ background: "#1F3A2A" }}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p
            className="eyebrow mb-3 text-xs uppercase"
            style={{ color: "#C7A339" }}
          >
            What we offer
          </p>

          <h2
            className="font-display mb-10 text-3xl md:text-4xl"
            style={{ color: "#F6F1E7" }}
          >
            Made for food lovers.
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, copy, img }) => (
              <div
                key={title}
                className="service-card overflow-hidden rounded-xl"
                style={{
                  background: "rgba(246,241,231,0.06)",
                  border: "1px solid rgba(246,241,231,0.12)",
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="service-image h-full w-full object-cover"
                    loading="lazy"
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(31,58,42,0.85), transparent)",
                    }}
                  />

                  <div
                    className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "#C7A339" }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.75}
                      color="#1F3A2A"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="font-display mb-2 text-lg"
                    style={{ color: "#F6F1E7" }}
                  >
                    {title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(246,241,231,0.65)" }}
                  >
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20"
      >
        <p
          className="eyebrow mb-3 text-xs uppercase"
          style={{ color: "#C7A339" }}
        >
          A look inside
        </p>

        <h2
          className="font-display mb-10 text-3xl md:text-4xl"
          style={{ color: "#1F3A2A" }}
        >
          Around Green Valley.
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {AMBIANCE.map((image, index) => (
            <div
              key={image}
              className="gallery-item overflow-hidden rounded-xl"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src={image}
                alt={`Green Valley atmosphere ${index + 1}`}
                className="gallery-image h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-14"
        style={{ background: "#1F3A2A" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <h3
              className="font-display mb-2 text-2xl md:text-3xl"
              style={{ color: "#F6F1E7" }}
            >
              Come enjoy the Green Valley experience.
            </h3>

            <p
              className="text-sm"
              style={{ color: "rgba(246,241,231,0.6)" }}
            >
              Fresh food, great coffee, and warm hospitality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={PHONE_LINK}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
              style={{ color: "#F6F1E7" }}
              aria-label={`Call Green Valley Food One at ${DISPLAY_PHONE}`}
            >
              <Phone size={16} />
              {DISPLAY_PHONE}
            </a>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-4 py-2 transition-opacity hover:opacity-80"
              style={{
                background: "#25D366",
                color: "#FFFFFF",
              }}
              aria-label="Contact Green Valley Food One on WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl items-center gap-2 px-6 text-sm md:px-10">
          <MapPin size={16} color="#C7A339" />

          <span style={{ color: "rgba(246,241,231,0.6)" }}>
            Santhamaguluru, Andhra Pradesh
          </span>
        </div>
      </footer>
    </main>
  );
}