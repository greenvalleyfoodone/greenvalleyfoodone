import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Utensils,
  HeartHandshake,
  Leaf,
  Users,
} from "lucide-react";
import Loader1 from "../components/Loader1";

const heroImg = "/images/restaurent1.jpg";

const carouselImages = [
  {
    src: "https://i.pinimg.com/736x/7c/cc/fa/7cccfaf7a57ca015159c2c53c1153f1e.jpg",
    alt: "Idli Ghee Karam",
    caption: "Idli Ghee Karam",
  },
  {
    src: "https://i.pinimg.com/736x/56/89/16/568916fac789f03858fe4218211c5637.jpg",
    alt: "Vada Sambar",
    caption: "Vada Sambar",
  },
  {
    src: "https://i.pinimg.com/1200x/a7/65/32/a765326d023dd9a8af14114c4ee317bf.jpg",
    alt: "Upma Pesara",
    caption: "Upma Pesara",
  },
  {
    src: "https://i.pinimg.com/1200x/57/dc/f6/57dcf64c2abc64d67f79377b1408d956.jpg",
    alt: "Pongal",
    caption: "Pongal",
  },
];

const highlightItems = [
  {
    icon: Utensils,
    title: "Authentic Andhra Flavors",
    desc: "Recipes rooted in Andhra tradition, cooked the way grandmothers made them — no shortcuts, just real taste.",
  },
  {
    icon: HeartHandshake,
    title: "Warm Hospitality",
    desc: "Every guest is welcomed with genuine care, from the first hello to the last bite.",
  },
  {
    icon: Leaf,
    title: "Fresh, Quality Ingredients",
    desc: "We source and prepare ingredients fresh every day to keep our food consistent and flavorful.",
  },
  {
    icon: Users,
    title: "Family-Friendly Dining",
    desc: "A comfortable, welcoming space designed for individuals, families and groups alike.",
  },
];

function RestaurantCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [shake, setShake] = useState(false);
  const startX = useRef(null);
  const startY = useRef(null);

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % carouselImages.length);
    setShake(true);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setShake(true);
  };

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 350);
    return () => clearTimeout(t);
  }, [shake]);

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const onTouchEnd = (e) => {
    if (startX.current === null || startY.current === null) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }

    startX.current = null;
    startY.current = null;
  };

  const image = carouselImages[index];

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="mb-6 text-center md:text-left">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a08060] mb-3">
          Restaurant highlights
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-[#2c1810]">
          Swipe the dishes
        </h2>
      </div>

      <div
        className="relative overflow-hidden rounded-[2rem] border border-[#eeeae4] shadow-2xl shadow-[#2c1810]/10 bg-black"
        style={{ aspectRatio: "16 / 8" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={`w-full h-full object-cover select-none ${
            shake ? "animate-shake" : "animate-slide"
          }`}
          onClick={goNext}
          draggable="false"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-2">
              {index + 1} / {carouselImages.length}
            </p>
            <h3 className="font-display text-2xl md:text-4xl">{image.caption}</h3>
          </div>

          <div className="hidden sm:flex gap-2 pointer-events-auto">
            <button
              onClick={goPrev}
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#2c1810] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#2c1810] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
              setShake(true);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-[#2c1810]" : "w-2 bg-[#d7c8b8]"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Restaurant() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader1 onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="bg-[#fbf7f1] min-h-screen text-neutral-800 overflow-x-hidden font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideImage {
          from { opacity: 0; transform: scale(1.02) translateX(18px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }

        @keyframes shakeImage {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }

        .animate-fadeUp { animation: fadeUp 0.9s ease both; }
        .animate-floatSoft { animation: floatSoft 5s ease-in-out infinite; }
        .animate-slide { animation: slideImage 0.35s ease; }
        .animate-shake { animation: shakeImage 0.35s ease; }

        .card-hover {
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 50px rgba(44,24,16,0.10);
        }

        .image-hover img {
          transition: transform 0.6s ease;
        }

        .image-hover:hover img {
          transform: scale(1.08);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f1e8] to-transparent" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fadeUp">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#a08060] mb-5">
              All day, every day
            </p>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[#2c1810] mb-6">
              Andhra flavors, made the way grandmothers made them.
            </h1>

            <p className="text-[#7f746a] max-w-xl leading-relaxed mb-10 text-[15px] md:text-[16px]">
              From breakfast to dinner, our kitchen turns out biryanis, curries and thalis rooted in traditional Andhra recipes — no shortcuts, just authentic taste and warm hospitality.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 bg-[#2c1810] text-white font-mono text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full hover:bg-[#1a0f08] transition-colors"
              >
                Explore menu
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>

              <a
                href="#highlights"
                className="inline-flex items-center gap-2 bg-white text-[#2c1810] border border-[#e9e1d7] font-mono text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full hover:border-[#cbb8a6] transition-colors"
              >
                View highlights
              </a>
            </div>
          </div>

          <div className="relative animate-fadeUp">
            <div className="absolute -inset-6 bg-gradient-to-tr from-[#d4a574]/25 to-transparent rounded-[2.5rem] blur-3xl animate-floatSoft" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eee6db] shadow-2xl shadow-[#2c1810]/10">
              <img
                src={heroImg}
                alt="Green Valley Food One restaurant interior"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL BEFORE MENU */}
      <div id="highlights">
        <RestaurantCarousel />
      </div>

      {/* RESTAURANT HIGHLIGHT SECTION (replaces the dish menu) */}
      <section id="menu" className="max-w-7xl mx-auto px-5 md:px-8 pb-28 pt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="animate-fadeUp">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a08060] mb-3">
              Green Valley Food One
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-[#2c1810] max-w-2xl leading-tight">
              A restaurant built on taste, care and tradition.
            </h2>
          </div>
          <p className="hidden md:block text-sm text-[#b0a99f] font-mono max-w-xs md:text-right">
            Andhra flavors, served fresh every single day.
          </p>
        </div>

        <p className="text-[#7f746a] max-w-2xl leading-relaxed mb-14 text-[15px] md:text-[16px] animate-fadeUp">
          Green Valley Food One brings together the comfort of home-style
          Andhra cooking and the warmth of genuine hospitality. Every dish
          that leaves our kitchen carries the same care and consistency our
          guests have come to trust — whether you're stopping in for a quick
          breakfast or settling in for a full family meal.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {highlightItems.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={title}
              className="group bg-white rounded-[1.75rem] p-8 border border-[#eeeae4] card-hover animate-fadeUp"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-[#f7f1e8] flex items-center justify-center mb-6 group-hover:bg-[#2c1810] transition-colors duration-300">
                <Icon
                  size={20}
                  className="text-[#2c1810] group-hover:text-white transition-colors duration-300"
                />
              </div>

              <h4 className="font-display text-xl text-[#2c1810] mb-3 leading-snug">
                {title}
              </h4>

              <p className="text-sm md:text-[15px] text-[#8a8279] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="#highlights"
            className="inline-flex items-center gap-2 bg-[#2c1810] text-white font-mono text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-full hover:bg-[#1a0f08] transition-colors"
          >
            See the restaurant
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </div>

        <p className="text-xs text-[#b0a99f] mt-10 font-mono text-center tracking-wide">
          A trusted dining destination in Santhamaguluru, Andhra Pradesh.
        </p>
      </section>
    </div>
      )}
    </>
  );
}