import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const heroImg =
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1400&auto=format&fit=crop";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1400&auto=format&fit=crop",
    alt: "Andhra chicken biryani",
    caption: "Andhra Chicken Biryani",
  },
  {
    src: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1400&auto=format&fit=crop",
    alt: "Gongura mutton",
    caption: "Gongura Mutton",
  },
  {
    src: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1400&auto=format&fit=crop",
    alt: "Andhra meals veg",
    caption: "Full Andhra Meals",
  },
  {
    src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1400&auto=format&fit=crop",
    alt: "Royyala iguru",
    caption: "Royyala Iguru",
  },
];

const menuSections = [
  {
    title: "Lunch Specials",
    items: [
      {
        name: "Andhra Chicken Biryani",
        desc: "Slow-cooked with home-ground spices, served with raita.",
        price: "₹280",
      },
      {
        name: "Gongura Mutton",
        desc: "Sorrel leaf curry, a Prakasam specialty.",
        price: "₹320",
      },
      {
        name: "Royyala Iguru",
        desc: "Prawn curry in thick Andhra masala.",
        price: "₹300",
      },
    ],
  },
  {
    title: "Meals",
    items: [
      {
        name: "Full Andhra Meals (Veg)",
        desc: "Unlimited rice, sambar, rasam, curries and pickle.",
        price: "₹150",
      },
      {
        name: "Full Andhra Meals (Non-Veg)",
        desc: "Meals thali with a chicken or fish curry.",
        price: "₹220",
      },
    ],
  },
  {
    title: "Breakfast",
    items: [
      {
        name: "Pesarattu with Upma",
        desc: "Green gram dosa, traditional breakfast combo.",
        price: "₹110",
      },
    ],
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
  return (
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
              From breakfast to dinner, our kitchen turns out biryanis, curries and thalis rooted in Prakasam's own recipes — no shortcuts, just authentic taste and warm hospitality.
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
                alt="Traditional Andhra thali served at Green Valley"
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

      {/* MENU */}
      <section id="menu" className="max-w-7xl mx-auto px-5 md:px-8 pb-28 pt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="animate-fadeUp">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a08060] mb-3">
              The menu
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-[#2c1810]">
              Signature dishes
            </h2>
          </div>
          <p className="hidden md:block text-sm text-[#b0a99f] font-mono">
            Freshly prepared · Prices in INR
          </p>
        </div>

        <div className="space-y-14">
          {menuSections.map((section, sIndex) => (
            <div key={section.title} className="animate-fadeUp" style={{ animationDelay: `${sIndex * 0.08}s` }}>
              <h3 className="font-display text-2xl md:text-3xl text-[#2c1810] mb-6">
                {section.title}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {section.items.map((item, index) => (
                  <div
                    key={item.name}
                    className="group bg-white rounded-[1.75rem] overflow-hidden border border-[#eeeae4] card-hover"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="relative h-[330px] overflow-hidden image-hover">
                      <img
                        src={item.image || heroImg}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div className="p-6">
                      <h4 className="font-display text-2xl text-[#2c1810] mb-2 leading-snug">
                        {item.name}
                      </h4>

                      <p className="text-sm md:text-[15px] text-[#8a8279] leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#f0e6dc]">
                        <span className="font-mono text-base text-[#1a4d3a] font-semibold">
                          {item.price}
                        </span>
                        <button className="w-11 h-11 rounded-full border border-[#eeeae4] flex items-center justify-center text-[#8a8279] hover:bg-[#2c1810] hover:text-white hover:border-[#2c1810] transition-all duration-200">
                          <ArrowUpRight size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#b0a99f] mt-10 font-mono text-center tracking-wide">
          All dishes are prepared fresh. Prices are inclusive of taxes.
        </p>
      </section>
    </div>
  );
}