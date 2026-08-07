import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import {
  Coffee,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Wifi,
  CarFront,
  PartyPopper,
  BadgeCheck,
  Star,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroSlides = [
  {
    image: "/images/hero-1.png",
    title: "A cafe by night.",
    subtitle: "A restaurant by day.",
    text: "Filter coffee roasted in-house, Andhra recipes passed down from grandmothers, and a table that's always ready for you.",
  },
  {
    image: "/images/hero-3.png",
    title: "Warm evenings,",
    subtitle: "fresh flavors.",
    text: "Relax with coffee, snacks, and a calm dinner atmosphere made for families and friends.",
  },
  {
    image: "/images/hero-2.png",
    title: "Traditional taste,",
    subtitle: "modern comfort.",
    text: "Enjoy a space that blends local Andhra dishes with a welcoming cafe experience.",
  },
];

const LIGHTS = [
  { x: 6, y: 10, size: 30, delay: 0 },
  { x: 16, y: 26, size: 20, delay: 0.5 },
  { x: 27, y: 8, size: 24, delay: 1.1 },
  { x: 40, y: 22, size: 28, delay: 0.3 },
  { x: 52, y: 6, size: 18, delay: 0.8 },
  { x: 63, y: 20, size: 24, delay: 1.4 },
  { x: 76, y: 9, size: 32, delay: 0.2 },
  { x: 88, y: 24, size: 22, delay: 0.9 },
  { x: 11, y: 40, size: 16, delay: 1.6 },
  { x: 84, y: 42, size: 16, delay: 0.6 },
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
    secondaryCta: "Book a table",
    hours: "Open 4 PM — 11 PM",
    sign: "Green Valley",
    subSign: "coffee",
    glow: "#F5A947",
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
    secondaryCta: "Reserve a table",
    hours: "Open 6 PM — 12 AM",
    sign: "Green Valley",
    subSign: "kitchen",
    glow: "#9FD8A4",
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
    description: "Safe parking for cars and bikes.",
  },
  {
    icon: BadgeCheck,
    label: "Fine Dining",
    description: "Airy seating, calm ambience, and attentive service.",
  },
  {
    icon: PartyPopper,
    label: "Party & Events",
    description: "Birthday parties, meetings, and small celebrations.",
  },
  {
    icon: Sparkles,
    label: "Refined Atmosphere",
    description: "A warm setting designed for memorable dining experiences.",
  },
  {
    icon: UtensilsCrossed,
    label: "Curated Menu",
    description: "A mix of comforting cafe items and hearty restaurant meals.",
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeExperience, setActiveExperience] = useState("cafe");
  const scene = SCENES[activeExperience];

  useEffect(() => {
    setActiveExperience(activeSlide === 0 ? "cafe" : "restaurant");
  }, [activeSlide]);

  return (
    <div
      className="min-h-screen bg-[#F7F3EA] text-[#1B2B1E]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative min-h-[85vh] flex items-center"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.35)), url('${slide.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-36 grid md:grid-cols-2 gap-10 items-center w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <p className="font-mono text-xs uppercase tracking-widest text-white/75 mb-4">
                      Santhamaguluru · Prakasam · Andhra Pradesh
                    </p>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] text-white mb-6">
                      {slide.title}
                      <br />
                      <span className="text-[#F5A947]">{slide.subtitle}</span>
                    </h1>
                    <p className="text-white/80 max-w-md mb-8 leading-relaxed">
                      {slide.text}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/reservation"
                        className="bg-[#3F7A48] text-[#F7F3EA] font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#2F5233] transition-colors"
                      >
                        Reserve now
                      </Link>
                      <Link
                        to="/menu"
                        className="border border-white/30 text-white font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:border-white transition-colors"
                      >
                        View menu
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div
                    className="justify-self-end w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.96, x: 24 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="rounded-sm overflow-hidden shadow-xl border border-white/10">
                      <img
                        src={slide.image}
                        alt={`Hero slide ${index + 1}`}
                        className="w-full h-[520px] object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="w-full min-h-screen flex items-center justify-center p-6">
        <style>{`
          @keyframes gv-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
          @keyframes gv-flicker { 0%,100% { opacity: 1; } 46% { opacity: 0.82; } 50% { opacity: 1; } 53% { opacity: 0.88; } 70% { opacity: 1; } }
          @keyframes gv-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes gv-fade-in { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
          .gv-tab-underline { transition: transform 0.45s cubic-bezier(.65,0,.35,1), background-color 0.45s ease; }
          .gv-panel-left { animation: gv-fade-up 0.6s cubic-bezier(.2,.7,.3,1) both; }
          .gv-panel-right { animation: gv-fade-in 0.7s cubic-bezier(.2,.7,.3,1) both; }
          .gv-cta-primary { transition: transform 0.2s ease, background-color 0.2s ease; }
          .gv-cta-primary:hover { transform: translateY(-2px); }
          .gv-cta-secondary { transition: transform 0.2s ease, border-color 0.2s ease; }
          .gv-cta-secondary:hover { transform: translateY(-2px); }
          .gv-image-wrap { transition: transform 0.9s cubic-bezier(.2,.7,.3,1); }
          .gv-image-wrap:hover { transform: scale(1.03); }
          .gv-bulb { animation: gv-flicker 4.5s ease-in-out infinite; }
          .gv-string { animation: gv-sway 5.5s ease-in-out infinite; transform-origin: top center; }

          .amenity-card {
            background: linear-gradient(180deg, #ffffff 0%, #fbfaf6 100%);
            border: 1px solid #e9e4d8;
            border-radius: 22px;
            padding: 28px;
            box-shadow: 0 18px 40px -24px rgba(27,43,30,0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          }

          .amenity-card:hover {
            transform: translateY(-6px);
            border-color: #d9ccb0;
            box-shadow: 0 24px 50px -22px rgba(27,43,30,0.24);
          }

          .amenity-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f2ea;
            color: #3f7a48;
            margin-bottom: 18px;
          }
        `}</style>

        <div className="w-full" style={{ maxWidth: "1120px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
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
                <span style={{ color: "#3F7A48", fontStyle: "italic" }}>side by side.</span>
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
              Tap below to peek into each side of Green Valley — the atmosphere, the food, the hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              border: "1px solid #E7E3D8",
              overflow: "hidden",
              boxShadow: "0 20px 50px -20px rgba(27,43,30,0.15)",
            }}
          >
            <div style={{ position: "relative", background: "#F5F2EA", borderBottom: "1px solid #E7E3D8" }}>
              <div className="grid grid-cols-2">
                {Object.entries(SCENES).map(([key, s]) => {
                  const Icon = s.tabIcon;
                  const isActive = key === activeExperience;

                  return (
                    <button
                      key={key}
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
                      {s.tabLabel.toUpperCase()}
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
                  transform: activeExperience === "cafe" ? "translateX(0%)" : "translateX(100%)",
                }}
              />
            </div>

            <div key={activeExperience} className="grid grid-cols-1 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="gv-panel-left flex flex-col justify-center p-10 md:p-14"
              >
                <div
                  className="inline-flex items-center gap-2 mb-5"
                  style={{
                    color: scene.accent,
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    width: "fit-content",
                  }}
                >
                  <Sparkles size={14} strokeWidth={2.2} />
                  {scene.eyebrow}
                </div>

                <h2 style={{ color: "#1B2B1E", fontSize: "38px", margin: "0 0 18px 0", fontWeight: 400 }}>
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

              <motion.div
                initial={{ opacity: 0, x: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                className="gv-panel-right relative overflow-hidden"
                style={{ minHeight: "440px" }}
              >
                <div
                  className="gv-image-wrap absolute inset-0"
                  style={{
                    background:
                      activeExperience === "cafe"
                        ? "radial-gradient(circle at 50% 100%, #17352A 0%, #0C1E17 55%, #060F0B 100%)"
                        : "radial-gradient(circle at 50% 100%, #1A2E1C 0%, #0D1A0E 55%, #070D07 100%)",
                  }}
                >
                  <svg
                    viewBox="0 0 500 440"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                    style={{ opacity: 0.35 }}
                  >
                    <line x1="0" y1="40" x2="500" y2="10" stroke="#4A3A28" strokeWidth="3" />
                    <line x1="0" y1="90" x2="500" y2="60" stroke="#4A3A28" strokeWidth="2" />
                    <line x1="60" y1="0" x2="60" y2="100" stroke="#4A3A28" strokeWidth="2" />
                    <line x1="220" y1="0" x2="220" y2="90" stroke="#4A3A28" strokeWidth="2" />
                    <line x1="380" y1="0" x2="380" y2="80" stroke="#4A3A28" strokeWidth="2" />
                  </svg>

                  {LIGHTS.map((l, i) => (
                    <div
                      key={i}
                      className="gv-string absolute"
                      style={{
                        left: `${l.x}%`,
                        top: 0,
                        animationDelay: `${l.delay}s`,
                      }}
                    >
                      <div
                        style={{
                          width: "1px",
                          height: `${l.y}%`,
                          background: "#3A2F22",
                          margin: "0 auto",
                        }}
                      />
                      <div
                        className="gv-bulb"
                        style={{
                          width: `${l.size}px`,
                          height: `${l.size}px`,
                          borderRadius: "50%",
                          background: scene.glow,
                          boxShadow: `0 0 ${l.size}px ${l.size * 0.6}px ${scene.glow}55, 0 0 ${l.size * 2}px ${scene.glow}22`,
                          transform: "translateX(-50%)",
                          animationDelay: `${l.delay}s`,
                        }}
                      />
                    </div>
                  ))}

                  <div
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "46%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Brush Script MT', cursive, Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "34px",
                        color: scene.glow,
                        textShadow: `0 0 12px ${scene.glow}, 0 0 26px ${scene.glow}88`,
                        lineHeight: 1,
                      }}
                    >
                      {scene.sign}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.3em",
                        color: scene.glow,
                        textShadow: `0 0 8px ${scene.glow}aa`,
                        marginTop: "6px",
                      }}
                    >
                      {scene.subSign.toUpperCase()}
                    </div>
                  </div>

                  <div
                    className="absolute left-0 right-0 bottom-0"
                    style={{
                      height: "34%",
                      background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />

                  <div
                    className="absolute flex items-center gap-2"
                    style={{
                      left: "20px",
                      bottom: "20px",
                      background: "rgba(0,0,0,0.55)",
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

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#0F3B1D] rounded-[28px] px-8 py-10 md:px-12 md:py-14 shadow-[0_20px_50px_rgba(15,59,29,0.25)]">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative pl-0 md:pl-8 md:border-l md:border-[#D4AF37]/50 text-center md:text-left"
                >
                  {index !== 0 && (
                    <div className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-[#D4AF37]/40" />
                  )}
                  <div className="text-[#F5A947] text-6xl md:text-7xl leading-none font-semibold mb-2">
                    {item.value}
                  </div>
                  <div className="uppercase tracking-[0.18em] text-white text-sm font-semibold mb-3">
                    {item.label}
                  </div>
                  <p className="text-white/70 text-sm md:text-base">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <p
                  className="text-xs uppercase tracking-[0.3em] mb-4"
                  style={{
                    color: "#F5A947",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  ✦ What's Included ✦
                </p>
                <h2
                  style={{
                    color: "#1B2B1E",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "32px",
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  Amenities &amp; Comforts
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-14">
                {facilities.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      className="group flex flex-col items-center text-center cursor-default"
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 3.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.15,
                        }}
                        className="amenity-icon"
                      >
                        <Icon size={34} strokeWidth={1.8} />
                      </motion.div>

                      <h3
                        className="mb-2 transition-colors duration-300"
                        style={{
                          color: "#F5A947",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </h3>

                      <div
                        className="mb-3 h-px w-6 transition-all duration-300 group-hover:w-10"
                        style={{ background: "rgba(245,169,71,0.5)" }}
                      />

                      <p
                        style={{
                          color: "#6B6B63",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "13px",
                          lineHeight: 1.6,
                          maxWidth: "180px",
                        }}
                      >
                        {item.description}
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