import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "@/lib/router-compat";

import {
  Coffee,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Wifi,
  CarFront,
  PartyPopper,
  BadgeCheck,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroSlides = [
  {
    image: "/images/hero-1.png",
    eyebrow: "GREEN VALLEY · CAFE & RESTAURANT",
    titleLine1: "Where every sip",
    titleLine2: "feels special.",
    description:
      "A welcoming place for good food, warm conversations, and moments you will want to come back to.",
  },
  {
    image: "/images/hero-3.png",
    eyebrow: "FARM TO TABLE",
    titleLine1: "Taste the valley,",
    titleLine2: "served with love.",
    description:
  "Fresh flavors, wholesome ingredients, and memorable meals crafted for every family gathering.",
  },
  {
    image: "/images/hero-2.png",
    eyebrow: "GREEN VALLEY · SANTHAMAGULURU",
    titleLine1: "Free parking",
    titleLine2: "with security.",
    description:
      "Safe and convenient parking for cars and bikes, with security support for a comfortable visit.",
  },
];

const SCENES = {
  cafe: {
    tabLabel: "Coffee cafe",
    tabIcon: Coffee,
    accent: "#E08D3C",
    eyebrow: "EVENINGS · OPEN-AIR",
    title: "Coffee One Cafe",
    description:
      "Freshly brewed coffee, vibrant mojitos and crispy snacks under warm pendant lights. Built for catch-ups, slow scrolls and that second cup.",
    primaryCta: "See the menu",
    secondaryCta: "View gallery",
    hours: "Open 6 AM — 11 PM",
    image: "/images/cafe85.jpg",
  },

  restaurant: {
    tabLabel: "Green restaurant",
    tabIcon: UtensilsCrossed,
    accent: "#4C7A52",
    eyebrow: "DINNER · FARM TABLE",
    title: "Green Valley Kitchen",
    description:
      "Seasonal plates built around what the valley grows, plated simply and served in a room lit like an orchard at dusk.",
    primaryCta: "See the menu",
    secondaryCta: "View gallery",
    hours: "Open 7 AM — 11 PM",
    image: "/images/cafe63.jpg",
  },
};

const facilities = [
  {
    icon: Wifi,
    label: "Free Wi-Fi",
    description: "High-speed internet for customers.",
  },
  {
    icon: CarFront,
    label: "Free Parking",
    description: "Secure parking for cars and bikes.",
  },
  {
    icon: BadgeCheck,
    label: "Fine Dining",
    description:
      "Airy seating, calm ambience, and attentive service.",
  },
  {
    icon: PartyPopper,
    label: "Party & Events",
    description:
      "Birthday parties, meetings, and small celebrations.",
  },
  {
    icon: Sparkles,
    label: "Refined Atmosphere",
    description:
      "A warm setting designed for memorable dining experiences.",
  },
  {
    icon: UtensilsCrossed,
    label: "Curated Menu",
    description:
      "Comforting cafe items and hearty restaurant meals.",
  },
];

const stats = [
  {
    value: "50+",
    label: "Menu Items",
    text: "From filter coffee to Andhra thalis.",
  },
  {
    value: "100%",
    label: "Pure Beans",
    text: "Freshly brewed, every single time.",
  },
  {
    value: "4.8★",
    label: "Guest Love",
    text: "Across thousands of warm visits.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeExperience, setActiveExperience] = useState("cafe");

  const scene = SCENES[activeExperience];

  useEffect(() => {
    setActiveExperience(activeSlide === 0 ? "cafe" : "restaurant");
  }, [activeSlide]);

  return (
    <div
      className="min-h-screen bg-[#F7F3EA] text-[#1B2B1E]"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <style>{`
        .hero-swiper,
        .hero-swiper .swiper-wrapper,
        .hero-swiper .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .hero-swiper {
          overflow: hidden;
        }

        .hero-swiper .swiper-wrapper {
          flex-wrap: nowrap;
        }

        .hero-swiper .swiper-slide {
          flex-shrink: 0;
        }

        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          width: 42px;
          height: 42px;
          color: white;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
        }

        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: 700;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          opacity: 0.6;
          background: white;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 999px;
          opacity: 1;
          background: #F5A947;
        }

        @keyframes gv-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gv-fade-in {
          from {
            opacity: 0;
            transform: scale(1.04);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .gv-tab-underline {
          transition:
            transform 0.45s cubic-bezier(.65, 0, .35, 1),
            background-color 0.45s ease;
        }

        .gv-panel-left {
          animation: gv-fade-up 0.6s cubic-bezier(.2, .7, .3, 1) both;
        }

        .gv-panel-right {
          animation: gv-fade-in 0.7s cubic-bezier(.2, .7, .3, 1) both;
        }

        .gv-cta-primary,
        .gv-cta-secondary {
          transition:
            transform 0.2s ease,
            background-color 0.2s ease,
            border-color 0.2s ease;
        }

        .gv-cta-primary:hover,
        .gv-cta-secondary:hover {
          transform: translateY(-2px);
        }

        .gv-image-wrap {
          transition: transform 0.9s cubic-bezier(.2, .7, .3, 1);
        }

        .gv-image-wrap:hover {
          transform: scale(1.03);
        }

        .amenity-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 16px;
          background: #f5f2ea;
          color: #3f7a48;
        }

        @media (max-width: 640px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>

      {/* HERO SLIDER */}
      <section className="relative h-screen w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation
          loop
          observer
          observeParents
          onSlideChange={(swiper) => {
            setActiveSlide(swiper.realIndex);
          }}
          className="hero-swiper h-full w-full"
          style={{ height: "100vh", width: "100%" }}
        >
          {heroSlides.map((slide, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full overflow-hidden">
                  {/* Main hero image */}
                  <img
                    src={slide.image}
                    alt={`Green Valley hero ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/35 to-slate-900/10" />

                  {/* Slide headline content — every slide gets its own copy */}
                  <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-center px-5 py-24 md:px-8 md:py-36">
                    <motion.div
                      key={`${index}-${activeSlide === index}`}
                      initial={{
                        opacity: 0,
                        y: 24,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.7,
                      }}
                      className="max-w-xl"
                    >
                      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/75">
                        {slide.eyebrow}
                      </p>

                      <h1 className="mb-6 font-serif text-4xl leading-[1.05] text-white md:text-6xl">
                        {slide.titleLine1}
                        <br />
                        <span className="text-[#F5A947]">
                          {slide.titleLine2}
                        </span>
                      </h1>

                      <p className="max-w-md leading-relaxed text-white/80">
                        {slide.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* CAFE AND RESTAURANT SECTION */}
      <section className="flex w-full items-center justify-center p-6">
        <div className="w-full max-w-[1120px]">
          {/* Heading */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <h1
                style={{
                  color: "#1B2B1E",
                  fontSize: "44px",
                  lineHeight: 1.1,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                A cafe and a restaurant,
                <br />
                <span
                  style={{
                    color: "#3F7A48",
                    fontStyle: "italic",
                  }}
                >
                  side by side.
                </span>
              </h1>
            </div>

            <p
              style={{
                color: "#6B6B63",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.6,
                maxWidth: "320px",
                margin: 0,
              }}
            >
              Tap below to peek into each side of Green Valley — the atmosphere,
              the food, and the hours.
            </p>
          </motion.div>

          {/* Experience card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              border: "1px solid #E7E3D8",
              overflow: "hidden",
              boxShadow: "0 20px 50px -20px rgba(27,43,30,0.15)",
            }}
          >
            {/* Tabs */}
            <div
              style={{
                position: "relative",
                background: "#F5F2EA",
                borderBottom: "1px solid #E7E3D8",
              }}
            >
              <div className="grid grid-cols-2">
                {Object.entries(SCENES).map(([key, item]) => {
                  const Icon = item.tabIcon;
                  const isActive = key === activeExperience;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveExperience(key)}
                      className="flex items-center justify-center gap-2 py-5"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "13px",
                        letterSpacing: "0.08em",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#1B2B1E" : "#9A968A",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <Icon size={16} strokeWidth={2} />
                      {item.tabLabel.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <div
                className="gv-tab-underline"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "3px",
                  width: "50%",
                  background: scene.accent,
                  transform:
                    activeExperience === "cafe"
                      ? "translateX(0%)"
                      : "translateX(100%)",
                }}
              />
            </div>

            {/* Experience content */}
            <div
              key={activeExperience}
              className="grid grid-cols-1 md:grid-cols-2"
            >
              {/* Text panel */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="gv-panel-left flex flex-col justify-center p-10 md:p-14"
              >
                <div
                  className="mb-5 inline-flex w-fit items-center gap-2"
                  style={{
                    color: scene.accent,
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  <Sparkles size={14} strokeWidth={2.2} />
                  {scene.eyebrow}
                </div>

                <h2
                  style={{
                    color: "#1B2B1E",
                    fontSize: "38px",
                    margin: "0 0 18px 0",
                    fontWeight: 400,
                  }}
                >
                  {scene.title}
                </h2>

                <p
                  style={{
                    color: "#6B6B63",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "16px",
                    lineHeight: 1.65,
                    margin: "0 0 32px 0",
                    maxWidth: "420px",
                  }}
                >
                  {scene.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/menu/${activeExperience}`)}
                    className="gv-cta-primary"
                    style={{
                      background: "#1B2B1E",
                      color: "#F7F3EA",
                      border: "none",
                      borderRadius: "999px",
                      padding: "14px 28px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {scene.primaryCta}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/gallery")}
                    className="gv-cta-secondary"
                    style={{
                      background: "transparent",
                      color: "#1B2B1E",
                      border: "1px solid #D8D4C7",
                      borderRadius: "999px",
                      padding: "14px 28px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {scene.secondaryCta}
                  </button>
                </div>
              </motion.div>

              {/* Image panel */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 24,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="gv-panel-right relative min-h-[440px] overflow-hidden"
              >
                <div className="gv-image-wrap absolute inset-0">
                  <img
                    src={scene.image}
                    alt={
                      activeExperience === "cafe"
                        ? "Coffee cafe"
                        : "Green Valley restaurant"
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />

                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: "34%",
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.70) 100%)",
                    }}
                  />

                  <div
                    className="absolute flex items-center gap-2"
                    style={{
                      left: "20px",
                      bottom: "20px",
                      background: "rgba(0,0,0,0.60)",
                      color: "#F7F3EA",
                      borderRadius: "999px",
                      padding: "8px 16px",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Clock size={14} />
                    {scene.hours}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-12 mt-20"
          >
            <div className="grid grid-cols-1 gap-8 rounded-[28px] bg-[#0F3B1D] px-8 py-10 shadow-[0_20px_50px_rgba(15,59,29,0.25)] md:grid-cols-3 md:px-12 md:py-14">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative pl-0 text-center md:pl-8 md:border-l md:border-[#D4AF37]/50 md:text-left"
                >
                  <div className="mb-2 text-6xl font-semibold leading-none text-[#F5A947] md:text-7xl">
                    {item.value}
                  </div>

                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    {item.label}
                  </div>

                  <p className="text-sm text-white/70 md:text-base">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Facilities */}
          <section className="px-4 py-16 md:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <p
                  className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    color: "#3F7A48",
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                >
                  Why guests come back
                </p>

                <h2
                  style={{
                    color: "#1B2B1E",
                    fontSize: "36px",
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  Everything you need,
                  <br />
                  <span
                    style={{
                      color: "#3F7A48",
                      fontStyle: "italic",
                    }}
                  >
                    nothing you don't.
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {facilities.map((facility, index) => {
                  const Icon = facility.icon;

                  return (
                    <motion.div
                      key={facility.label}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                      }}
                      className="rounded-2xl border border-[#E7E3D8] bg-white p-8"
                    >
                      <div className="amenity-icon">
                        <Icon size={26} strokeWidth={1.8} />
                      </div>

                      <h3
                        style={{
                          color: "#1B2B1E",
                          fontSize: "18px",
                          margin: "0 0 8px 0",
                          fontWeight: 700,
                        }}
                      >
                        {facility.label}
                      </h3>

                      <p
                        style={{
                          color: "#6B6B63",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "14px",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {facility.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}