"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loader3 from "../components/Loader3";

import {
  Award,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ConciergeBell,
  CreditCard,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Timer,
  Trash2,
  Truck,
  Users,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";

const PHONE_NUMBER = "9866255533";
const DISPLAY_PHONE = "98662 55533";
const COUNTRY_CODE = "91";

const PHONE_LINK = `tel:+${COUNTRY_CODE}${PHONE_NUMBER}`;

const WHATSAPP_LINK = `https://wa.me/${COUNTRY_CODE}${PHONE_NUMBER}?text=${encodeURIComponent(
  "Hello Green Valley Food One, I would like to know more."
)}`;

const COLORS = {
  green: "#1F3A2A",
  darkGreen: "#14291D",
  ivory: "#F6F1E7",
  gold: "#C7A339",
  clay: "#B9684B",
  ink: "#20241F",
  white: "#FFFFFF",
};

/* -------------------------------------------------------
   Image data
-------------------------------------------------------- */

const restaurantImages = [
  {
    src: "/images/cafe53.jpg",
    alt: "Green Valley restaurant dining area",
  },
  {
    src: "/images/cafe54.jpg",
    alt: "Restaurant seating area",
  },
  {
    src: "/images/cafe55.jpg",
    alt: "Restaurant dining tables",
  },
  {
    src: "/images/cafe57.jpg",
    alt: "Restaurant dining experience",
  },
  {
    src: "/images/cafe58.jpg",
    alt: "Comfortable restaurant seating",
  },
  {
    src: "/images/cafe59.jpg",
    alt: "Family dining area",
  },
  {
    src: "/images/cafe60.jpg",
    alt: "Restaurant tables and chairs",
  },
  {
    src: "/images/cafe61.jpg",
    alt: "Green Valley restaurant atmosphere",
  },
  {
    src: "/images/cafe62.jpg",
    alt: "Restaurant interior at Green Valley",
  },
  {
    src: "/images/restaurent1.jpg",
    alt: "Green Valley restaurant",
  },
];

const cafeImages = [
  {
    src: "/images/cafe1.jpg",
    alt: "Green Valley cafe",
  },
  {
    src: "/images/cafe2.jpg",
    alt: "Cafe seating",
  },
  {
    src: "/images/cafe3.jpg",
    alt: "Cafe atmosphere",
  },
  {
    src: "/images/cafe4.jpg",
    alt: "Coffee and cafe interior",
  },
  {
    src: "/images/cafe5.jpg",
    alt: "Green Valley cafe space",
  },
  {
    src: "/images/cafe6.jpg",
    alt: "Cafe table and seating",
  },
  {
    src: "/images/cafe7.jpg",
    alt: "Cafe dining area",
  },
  {
    src: "/images/cafe8.jpg",
    alt: "Cafe refreshments",
  },
];

const kitchenImages = [
  {
    src: "/images/out1.jpg",
    alt: "Green Valley kitchen",
  },
  {
    src: "/images/out2.jpg",
    alt: "Clean food preparation area",
  },
  {
    src: "/images/out7.jpg",
    alt: "Green Valley kitchen operations",
  },
];

const washroomImages = [
  {
    src: "/images/out3.jpg",
    alt: "Restaurant washroom",
  },
  {
    src: "/images/out4.jpg",
    alt: "Clean guest washroom",
  },
  {
    src: "/images/out5.jpg",
    alt: "Washroom facility",
  },
  {
    src: "/images/out6.jpg",
    alt: "Hygienic washroom",
  },
];

const serviceImages = [
  {
    src: "/images/cafe43.jpg",
    alt: "Professional Green Valley staff",
  },
  {
    src: "/images/cafe44.jpg",
    alt: "Friendly restaurant service",
  },
  {
    src: "/images/cafe45.jpg",
    alt: "Hospitality at Green Valley",
  },
  {
    src: "/images/cafe46.jpg",
    alt: "Staff serving customers",
  },
  {
    src: "/images/cafe47.jpg",
    alt: "Green Valley service",
  },
  {
    src: "/images/cafe48.jpg",
    alt: "Customer service at the restaurant",
  },
  {
    src: "/images/cafe49.jpg",
    alt: "Restaurant hospitality",
  },
  {
    src: "/images/cafe50.jpg",
    alt: "Green Valley team service",
  },
  {
    src: "/images/cafe51.jpg",
    alt: "Friendly dining service",
  },
  {
    src: "/images/cafe52.jpg",
    alt: "Professional restaurant service",
  },
  {
    src: "/images/service27.jpg",
    alt: "Green Valley customer service",
  },
  {
    src: "/images/service28.jpg",
    alt: "Restaurant team member",
  },
  {
    src: "/images/service29.jpg",
    alt: "Customer assistance",
  },
  {
    src: "/images/service30.jpg",
    alt: "Warm hospitality",
  },
];

const uniformImages = [
  {
    src: "/images/cafe42.jpg",
    alt: "Green Valley staff uniform",
  },
  {
    src: "/images/cafe43.jpg",
    alt: "Well-groomed restaurant staff",
  },
  {
    src: "/images/cafe47.jpg",
    alt: "Professional team uniform",
  },
];

const customerImages = [
  {
    src: "/images/service24.jpg",
    alt: "Green Valley customers",
  },
  {
    src: "/images/service25.jpg",
    alt: "Happy customers dining",
  },
  {
    src: "/images/service26.jpg",
    alt: "Customer experience at Green Valley",
  },
];

const heroSlides = [
  {
    src: restaurantImages[0].src,
    alt: restaurantImages[0].alt,
    label: "Comfortable dining",
  },
  {
    src: cafeImages[1].src,
    alt: cafeImages[1].alt,
    label: "Relaxed cafe moments",
  },
  {
    src: kitchenImages[0].src,
    alt: kitchenImages[0].alt,
    label: "Clean and careful preparation",
  },
  {
    src: serviceImages[1].src,
    alt: serviceImages[1].alt,
    label: "Warm hospitality",
  },
];

/* -------------------------------------------------------
   Page content
-------------------------------------------------------- */

const services = [
  {
    icon: UtensilsCrossed,
    title: "Quality Dining",
    text: "Enjoy fresh, tasty and carefully prepared food in a welcoming family-friendly environment.",
    image: restaurantImages[2].src,
  },
  {
    icon: Coffee,
    title: "Cafe Experience",
    text: "Relax with coffee, snacks, desserts and refreshing beverages in a comfortable cafe atmosphere.",
    image: cafeImages[3].src,
  },
  {
    icon: Timer,
    title: "Fast Service",
    text: "Our team takes orders promptly and serves food efficiently without compromising quality.",
    image: serviceImages[4].src,
  },
  {
    icon: HeartHandshake,
    title: "Warm Hospitality",
    text: "Every guest is welcomed with respect, kindness and a genuine smile.",
    image: serviceImages[1].src,
  },
  {
    icon: ShieldCheck,
    title: "Hygienic Kitchen",
    text: "Our kitchen follows careful cleanliness and food preparation practices during every shift.",
    image: kitchenImages[0].src,
  },
  {
    icon: Sparkles,
    title: "Clean Dining Space",
    text: "Tables, chairs, floors and serving areas are cleaned and maintained regularly.",
    image: restaurantImages[4].src,
  },
  {
    icon: Users,
    title: "Family Friendly",
    text: "A peaceful dining space suitable for individuals, families, friends and groups.",
    image: customerImages[1].src,
  },
  {
    icon: CreditCard,
    title: "Convenient Billing",
    text: "Fast and accurate billing with convenient payment options for our guests.",
    image: serviceImages[7].src,
  },
];

const standards = [
  {
    icon: Award,
    title: "Professional Staff",
    text: "Our staff are well-groomed, properly dressed and committed to professional service.",
  },
  {
    icon: BadgeCheck,
    title: "Fresh Ingredients",
    text: "We use fresh and quality ingredients to maintain consistent taste and quality.",
  },
  {
    icon: ShieldCheck,
    title: "Strict Hygiene",
    text: "We maintain cleanliness during food preparation, serving and restaurant maintenance.",
  },
  {
    icon: ConciergeBell,
    title: "Polite Communication",
    text: "Our team communicates courteously and assists customers with menu choices.",
  },
  {
    icon: Smile,
    title: "Customer Satisfaction",
    text: "We listen to feedback and continuously improve our services and guest experience.",
  },
  {
    icon: Car,
    title: "Parking Facility",
    text: "Convenient parking is available near the restaurant for two-wheelers and cars.",
  },
  {
    icon: Trash2,
    title: "Clean Washrooms",
    text: "Guest washrooms are maintained as clean, comfortable and hygienic facilities.",
  },
  {
    icon: Navigation,
    title: "Easy to Visit",
    text: "A convenient location for dining, coffee breaks, family meals and celebrations.",
  },
];

/* -------------------------------------------------------
   Helpers
-------------------------------------------------------- */

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

/* -------------------------------------------------------
   Auto Slider (flexible height via className, aspectRatio optional)
-------------------------------------------------------- */

function AutoSquareSlider({ images, interval = 3500, className = "", aspectRatio }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (images.length <= 1 || reducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, reducedMotion]);

  if (images.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div
        className={`flex h-full w-full ${
          reducedMotion
            ? ""
            : "transition-transform duration-700 ease-out"
        }`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image) => (
          <div
            key={image.src}
            className="relative h-full w-full shrink-0"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className="block h-2 rounded-full transition-all duration-300"
              style={{
                width: currentIndex === index ? 24 : 8,
                background:
                  currentIndex === index
                    ? COLORS.ivory
                    : "rgba(246,241,231,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Hero slider
-------------------------------------------------------- */

function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dotsRef = useRef([]);

  const goToSlide = useCallback((slideIndex) => {
    setCurrentIndex(
      (slideIndex + heroSlides.length) % heroSlides.length
    );
  }, []);

  const goNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goPrevious = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (paused || reducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  const handleDotKeyDown = (event, index) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      const nextIndex = (index + 1) % heroSlides.length;

      goToSlide(nextIndex);
      dotsRef.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      const previousIndex =
        (index - 1 + heroSlides.length) % heroSlides.length;

      goToSlide(previousIndex);
      dotsRef.current[previousIndex]?.focus();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-2xl"
        style={{ aspectRatio: "4 / 5" }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Green Valley Food One highlights"
      >
        <div
          className={`flex h-full ${
            reducedMotion
              ? ""
              : "transition-transform duration-[900ms] ease-out"
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.src}
              className="relative h-full w-full shrink-0"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-8 left-7 right-7">
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/70">
                  Green Valley Food One
                </p>

                <p className="font-display text-2xl text-white md:text-3xl">
                  {slide.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrevious}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
          style={{
            background: "rgba(246,241,231,0.9)",
            color: COLORS.green,
          }}
        >
          <ChevronLeft size={19} />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
          style={{
            background: "rgba(246,241,231,0.9)",
            color: COLORS.green,
          }}
        >
          <ChevronRight size={19} />
        </button>

        <div className="absolute bottom-5 right-7 flex gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              ref={(element) => {
                dotsRef.current[index] = element;
              }}
              onClick={() => goToSlide(index)}
              onKeyDown={(event) =>
                handleDotKeyDown(event, index)
              }
              aria-label={`Show slide ${index + 1}`}
              aria-current={currentIndex === index}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: currentIndex === index ? 26 : 10,
                background:
                  currentIndex === index
                    ? COLORS.ivory
                    : "rgba(246,241,231,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Main page
-------------------------------------------------------- */

export default function GreenValleyServices() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Loader3 onComplete={() => setLoading(false)} />
      )}

      {!loading && (
        <main
          className="min-h-screen overflow-hidden"
          style={{
            background: COLORS.ivory,
            color: COLORS.ink,
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Work+Sans:wght@300;400;500;600&display=swap');

            .font-display {
              font-family: 'Fraunces', serif;
            }

            .eyebrow {
              letter-spacing: 0.22em;
            }

            .service-card,
            .standard-card,
            .image-card,
            .feature-image {
              transition: transform 0.4s ease,
                box-shadow 0.4s ease,
                border-color 0.4s ease;
            }

            .service-card:hover,
            .standard-card:hover {
              transform: translateY(-7px);
              box-shadow: 0 18px 35px rgba(31, 58, 42, 0.12);
              border-color: #C7A339 !important;
            }

            .image-card:hover .feature-image {
              transform: scale(1.08);
            }

            .service-card:hover .service-card-image {
              transform: scale(1.08);
            }

            .service-card-image,
            .feature-image {
              transition: transform 0.7s ease;
            }

            @media (prefers-reduced-motion: reduce) {
              *,
              *::before,
              *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
              }
            }
          `}</style>

          {/* Hero */}
          <header className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-[1fr_0.85fr] md:px-10 md:pb-28 md:pt-16">
            <div>
              <p
                className="eyebrow mb-5 text-xs uppercase"
                style={{ color: COLORS.gold }}
              >
                Fresh flavours · Clean spaces · Warm hospitality
              </p>

              <h1
                className="font-display text-5xl leading-[1.05] md:text-7xl"
                style={{ color: COLORS.green }}
              >
                Every visit should
                <br />
                feel <span className="italic">special.</span>
              </h1>

              <p
                className="mt-7 max-w-xl text-base leading-8"
                style={{ color: "rgba(32,36,31,0.7)" }}
              >
                At Green Valley Food One, we are committed to providing an
                exceptional dining experience through outstanding hospitality,
                quality service, fresh food and a clean environment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="rounded-full px-6 py-3 text-sm font-medium transition hover:-translate-y-1"
                  style={{
                    background: COLORS.green,
                    color: COLORS.ivory,
                  }}
                >
                  Explore our services
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border px-6 py-3 text-sm font-medium transition hover:-translate-y-1"
                  style={{
                    borderColor: COLORS.green,
                    color: COLORS.green,
                  }}
                >
                  Contact us
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-5 text-sm text-black/60">
                <span className="flex items-center gap-2">
                  <Star size={16} fill={COLORS.gold} color={COLORS.gold} />
                  Guest-focused service
                </span>

                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} color={COLORS.gold} />
                  Hygiene first
                </span>
              </div>
            </div>

            <HeroSlider />
          </header>

          {/* Introduction */}
          <section
            className="border-y"
            style={{
              background: COLORS.green,
              borderColor: "rgba(246,241,231,0.1)",
            }}
          >
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 md:px-10 md:py-20">
              <div>
                <p
                  className="eyebrow text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Our promise
                </p>

                <h2
                  className="font-display mt-4 text-3xl md:text-4xl"
                  style={{ color: COLORS.ivory }}
                >
                  Care in every detail.
                </h2>
              </div>

              <p
                className="text-sm leading-8 md:col-span-2 md:max-w-2xl"
                style={{ color: "rgba(246,241,231,0.72)" }}
              >
                From the way our staff welcome you to the way our kitchen is
                maintained, every detail is designed to make your visit
                comfortable. We believe good food becomes even better when it
                is served with care, respect and genuine hospitality.
              </p>
            </div>
          </section>

          {/* Services */}
          <section
            id="services"
            className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
          >
            <div className="max-w-2xl">
              <p
                className="eyebrow mb-3 text-xs uppercase"
                style={{ color: COLORS.gold }}
              >
                What we provide
              </p>

              <h2
                className="font-display text-4xl md:text-5xl"
                style={{ color: COLORS.green }}
              >
                More than just a meal.
              </h2>

              <p className="mt-5 text-sm leading-7 text-black/60">
                Our services are built around food quality, cleanliness,
                comfort and a friendly guest experience.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(
                ({ icon: Icon, title, text, image }) => (
                  <article
                    key={title}
                    className="service-card overflow-hidden rounded-2xl border bg-white"
                    style={{ borderColor: "rgba(31,58,42,0.1)" }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="service-card-image h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <div
                        className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: COLORS.gold }}
                      >
                        <Icon size={19} color={COLORS.green} />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3
                        className="font-display text-xl"
                        style={{ color: COLORS.green }}
                      >
                        {title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-black/60">
                        {text}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>

          {/* Restaurant dining */}
          <section
            className="border-y"
            style={{
              background: "#EEE7D8",
              borderColor: "rgba(31,58,42,0.1)",
            }}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Restaurant dining
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.green }}
                >
                  Comfortable dining for every occasion.
                </h2>

                <p className="mt-6 text-sm leading-8 text-black/65">
                  Enjoy authentic Andhra flavours, traditional meals, biryanis,
                  curries and delicious dishes in a comfortable dining space.
                  Whether you visit alone, with family or with friends, our
                  restaurant is designed to make you feel welcome.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  {[
                    "Family-friendly atmosphere",
                    "Comfortable seating",
                    "Freshly prepared food",
                    "Polite table service",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-black/70"
                    >
                      <CheckCircle2
                        size={17}
                        color={COLORS.gold}
                        className="mt-0.5 shrink-0"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurant dining gallery: one static image left + auto-slider right */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl h-72 md:h-[420px]">
                  <img
                    src={restaurantImages[0].src}
                    alt={restaurantImages[0].alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <p className="absolute bottom-4 left-4 right-4 translate-y-3 text-sm text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {restaurantImages[0].alt}
                  </p>
                </div>

                <AutoSquareSlider
                  images={restaurantImages.slice(1)}
                  interval={3500}
                  className="h-72 md:h-[420px]"
                />
              </div>
            </div>
          </section>

          {/* Cafe */}
          <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl h-72 md:h-[420px]">
                  <img
                    src={cafeImages[0].src}
                    alt={cafeImages[0].alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <p className="absolute bottom-4 left-4 right-4 translate-y-3 text-sm text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {cafeImages[0].alt}
                  </p>
                </div>

                <AutoSquareSlider
                  images={cafeImages.slice(1)}
                  interval={3500}
                  className="h-72 md:h-[420px]"
                />
              </div>

              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Cafe experience
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.green }}
                >
                  Slow moments. Good coffee.
                </h2>

                <p className="mt-6 text-sm leading-8 text-black/65">
                  Take a break with freshly brewed coffee, refreshing
                  beverages, desserts and light snacks. Our cafe is a relaxed
                  space for conversations, quick breaks and peaceful evenings.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "Fresh coffee",
                    "Light snacks",
                    "Desserts",
                    "Relaxed atmosphere",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border px-4 py-2 text-xs"
                      style={{
                        borderColor: "rgba(31,58,42,0.2)",
                        color: COLORS.green,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Kitchen and hygiene */}
          <section
            className="border-y"
            style={{
              background: COLORS.darkGreen,
              borderColor: "rgba(246,241,231,0.1)",
            }}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Kitchen and hygiene
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.ivory }}
                >
                  Clean preparation. Consistent quality.
                </h2>

                <p
                  className="mt-6 text-sm leading-8"
                  style={{ color: "rgba(246,241,231,0.7)" }}
                >
                  We follow strict cleanliness practices during food
                  preparation, cooking and serving. Our team pays attention to
                  kitchen hygiene, fresh ingredients, clean preparation
                  surfaces and safe food handling.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Clean preparation and serving areas",
                    "Fresh ingredients used for every dish",
                    "Regular cleaning during restaurant operations",
                    "Careful food handling and presentation",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: "rgba(246,241,231,0.78)" }}
                    >
                      <CheckCircle2 size={17} color={COLORS.gold} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kitchen: single static image, no slider */}
              <div className="relative overflow-hidden rounded-2xl h-72 md:h-[450px]">
                <img
                  src={kitchenImages[0].src}
                  alt={kitchenImages[0].alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* Washrooms */}
          <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl h-72 md:h-[420px]">
                  <img
                    src={washroomImages[0].src}
                    alt={washroomImages[0].alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <p className="absolute bottom-4 left-4 right-4 translate-y-3 text-sm text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {washroomImages[0].alt}
                  </p>
                </div>

                <AutoSquareSlider
                  images={washroomImages.slice(1)}
                  interval={3500}
                  className="h-72 md:h-[420px]"
                />
              </div>

              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Guest facilities
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.green }}
                >
                  Clean washrooms for your comfort.
                </h2>

                <p className="mt-6 text-sm leading-8 text-black/65">
                  Clean and comfortable washrooms are an important part of a
                  good dining experience. Our guest facilities are regularly
                  checked and maintained to provide a hygienic environment for
                  every visitor.
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm text-black/70">
                  <Sparkles size={18} color={COLORS.gold} />
                  Regularly maintained guest facilities
                </div>
              </div>
            </div>
          </section>

          {/* Professional staff */}
          <section
            className="border-y"
            style={{
              background: "#EEE7D8",
              borderColor: "rgba(31,58,42,0.1)",
            }}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Professional team
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.green }}
                >
                  Friendly people make the difference.
                </h2>

                <p className="mt-6 text-sm leading-8 text-black/65">
                  Our waiters and team members wear neat uniforms, maintain
                  excellent hygiene and present themselves professionally. We
                  communicate politely, assist with menu choices and respond to
                  every request with patience.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "Neat uniforms",
                    "Excellent hygiene",
                    "Polite communication",
                    "Friendly assistance",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border px-4 py-2 text-xs"
                      style={{
                        borderColor: "rgba(31,58,42,0.2)",
                        color: COLORS.green,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <AutoSquareSlider
                images={uniformImages}
                interval={3500}
                aspectRatio="1 / 1"
                className="mx-auto w-full max-w-[420px]"
              />
            </div>
          </section>

          {/* Standards */}
          <section
            id="standards"
            className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
          >
            <div className="max-w-2xl">
              <p
                className="eyebrow mb-4 text-xs uppercase"
                style={{ color: COLORS.gold }}
              >
                Our service standards
              </p>

              <h2
                className="font-display text-4xl md:text-5xl"
                style={{ color: COLORS.green }}
              >
                Hospitality you can count on.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {standards.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="standard-card rounded-2xl border bg-white p-5 md:p-6"
                  style={{ borderColor: "rgba(31,58,42,0.1)" }}
                >
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "rgba(199,163,57,0.17)" }}
                  >
                    <Icon size={19} color={COLORS.green} />
                  </div>

                  <h3
                    className="font-display text-lg leading-snug"
                    style={{ color: COLORS.green }}
                  >
                    {title}
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-black/60">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Customers and parking */}
          <section
            className="border-y"
            style={{
              background: COLORS.green,
              borderColor: "rgba(246,241,231,0.1)",
            }}
          >
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Customer satisfaction
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.ivory }}
                >
                  Your experience matters to us.
                </h2>

                <p
                  className="mt-6 text-sm leading-8"
                  style={{ color: "rgba(246,241,231,0.7)" }}
                >
                  We value every customer's feedback and use suggestions and
                  reviews to continuously improve our food, service and dining
                  environment.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <HeartHandshake size={22} color={COLORS.gold} />

                  <span
                    className="text-sm"
                    style={{ color: "rgba(246,241,231,0.8)" }}
                  >
                    Every guest is welcomed with respect and care.
                  </span>
                </div>
              </div>

              <AutoSquareSlider
                images={customerImages}
                interval={3500}
                aspectRatio="1 / 1"
                className="mx-auto w-full max-w-[420px]"
              />
            </div>
          </section>

          {/* Parking and convenience */}
          <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="image-card group relative overflow-hidden rounded-[2rem]">
                <img
                  src="/images/hero-2.png"
                  alt="Green Valley parking zone"
                  loading="lazy"
                  className="feature-image h-[360px] w-full object-cover md:h-[450px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7">
                  <p className="eyebrow text-xs uppercase text-white/70">
                    Easy arrival
                  </p>

                  <p className="font-display mt-2 text-3xl text-white">
                    Convenient parking
                  </p>
                </div>
              </div>

              <div>
                <p
                  className="eyebrow mb-4 text-xs uppercase"
                  style={{ color: COLORS.gold }}
                >
                  Parking zone
                </p>

                <h2
                  className="font-display text-4xl leading-tight md:text-5xl"
                  style={{ color: COLORS.green }}
                >
                  Arrive comfortably. Dine peacefully.
                </h2>

                <p className="mt-6 text-sm leading-8 text-black/65">
                  Convenient parking makes it easier for individuals, families
                  and groups to visit Green Valley Food One without unnecessary
                  stress.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <div>
                    <Car size={21} color={COLORS.gold} />
                    <p className="mt-3 text-sm font-medium">
                      Two-wheeler parking
                    </p>
                  </div>

                  <div>
                    <Car size={21} color={COLORS.gold} />
                    <p className="mt-3 text-sm font-medium">
                      Car parking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section
            className="px-6 py-20 text-center md:px-10 md:py-28"
            style={{ background: COLORS.gold }}
          >
            <Utensils
              className="mx-auto"
              size={30}
              color={COLORS.green}
            />

            <h2
              className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight md:text-5xl"
              style={{ color: COLORS.green }}
            >
              Good food, clean spaces and genuine hospitality.
            </h2>

            <p
              className="mx-auto mt-5 max-w-xl text-sm leading-7"
              style={{ color: "rgba(31,58,42,0.75)" }}
            >
              Visit Green Valley Food One and enjoy a dining experience made
              with care.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={PHONE_LINK}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition hover:-translate-y-1"
                style={{
                  background: COLORS.green,
                  color: COLORS.ivory,
                }}
              >
                <Phone size={16} />
                Call us
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition hover:-translate-y-1"
                style={{
                  borderColor: COLORS.green,
                  color: COLORS.green,
                }}
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer
            className="px-6 py-10 md:px-10"
            style={{ background: COLORS.darkGreen }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p
                  className="font-display text-2xl"
                  style={{ color: COLORS.ivory }}
                >
                  Green Valley Food One
                </p>

                <p
                  className="mt-2 text-sm"
                  style={{ color: "rgba(246,241,231,0.6)" }}
                >
                  Fresh flavours. Warm hospitality.
                </p>
              </div>

              <div className="flex flex-col gap-3 text-sm md:items-end">
                <a
                  href={PHONE_LINK}
                  className="flex items-center gap-2"
                  style={{ color: COLORS.ivory }}
                >
                  <Phone size={15} />
                  {DISPLAY_PHONE}
                </a>

                <span
                  className="flex items-center gap-2"
                  style={{ color: "rgba(246,241,231,0.6)" }}
                >
                  <MapPin size={15} color={COLORS.gold} />
                  Santhamaguluru, Andhra Pradesh
                </span>
              </div>
            </div>
          </footer>
        </main>
      )}
    </>
  );
}