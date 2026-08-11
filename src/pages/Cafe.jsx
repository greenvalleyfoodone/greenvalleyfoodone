import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

const cafeInteriorImg = "/images/cafe3.jpg";
const coffeeBeansImg = "/images/service32.jpg";
const coldCoffeeImg = "/images/cafe6.jpg";
const snacksImg = "/images/cafe35.jpg";

const galleryImages = [
  { id: 1, src: "/images/cafe1.jpg", alt: "Cafe photo" },
  { id: 2, src: "/images/cafe2.jpg", alt: "Cafe photo" },
  { id: 3, src: "/images/cafe3.jpg", alt: "Cafe photo" },
  { id: 4, src: "/images/cafe4.jpg", alt: "Cafe photo" },
  { id: 5, src: "/images/service27.jpg", alt: "Cafe photo" },
  { id: 6, src: "/images/cafe6.jpg", alt: "Cafe photo" },
  { id: 7, src: "/images/cafe7.jpg", alt: "Cafe photo" },
  { id: 8, src: "/images/cafe8.jpg", alt: "Cafe photo" },
  { id: 9, src: "/images/cafe30.jpg", alt: "Cafe photo" },
];

const features = [
  {
    icon: "☕",
    title: "Freshly Brewed",
    description:
      "Enjoy rich and aromatic coffee prepared with carefully selected beans.",
  },
  {
    icon: "✨",
    title: "Cozy Atmosphere",
    description:
      "Relax in a warm and peaceful space designed for memorable moments.",
  },
  {
    icon: "🥪",
    title: "Fresh Snacks",
    description:
      "Taste delicious snacks prepared fresh and served with care.",
  },
  {
    icon: "🧊",
    title: "Refreshing Drinks",
    description:
      "Cool down with refreshing cold coffees, mojitos, and milkshakes.",
  },
];

function FloatingImage({ img, index, onClick }) {
  return (
    <div
      className={`float-card float-${(index % 4) + 1}`}
      onClick={() => onClick(img)}
    >
      <img src={img.src} alt={img.alt} />

      <div className="float-overlay">
        <span>🔍</span>
      </div>
    </div>
  );
}

function GalleryLightbox({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close image"
      >
        ✕
      </button>

      <img
        src={image.src}
        alt={image.alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export default function CafePage() {
  const [selected, setSelected] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const galleryTimer = setTimeout(() => {
      setShowGallery(true);
    }, 150);

    return () => clearTimeout(galleryTimer);
  }, []);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 2200);

    return () => clearTimeout(loaderTimer);
  }, []);

  return (
    <>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}

      <div className="page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            background: #faf7f2;
          }

          .page {
            min-height: 100vh;
            overflow: hidden;
            color: #24150e;
            background: #faf7f2;
            font-family: "Inter", system-ui, sans-serif;
          }

          .hero {
            position: relative;
            min-height: 92vh;
            display: flex;
            align-items: center;
            overflow: hidden;
            padding: 90px 6%;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scale(1.05);
          }

          .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                90deg,
                rgba(17, 8, 4, 0.88) 0%,
                rgba(17, 8, 4, 0.62) 45%,
                rgba(17, 8, 4, 0.18) 100%
              );
            z-index: 1;
          }

          .hero-content {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 1250px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 60px;
            color: white;
          }

          .hero-text {
            max-width: 650px;
            animation: fadeUp 1s ease both;
          }

          .eyebrow {
            display: inline-block;
            margin-bottom: 18px;
            color: #fbbf7a;
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          .hero-title {
            margin: 0 0 20px;
            font-family: "Playfair Display", serif;
            font-size: clamp(3rem, 7vw, 6.5rem);
            line-height: 0.98;
          }

          .hero-description {
            max-width: 600px;
            margin: 0 0 24px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.08rem;
            line-height: 1.8;
          }

          .hero-highlights {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 30px;
            color: #fff2e5;
            font-size: 0.9rem;
          }

          .hero-highlights span {
            padding: 8px 12px;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
          }

          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 52px;
            padding: 0.95rem 1.5rem;
            border: none;
            border-radius: 999px;
            font-weight: 800;
            text-decoration: none;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .btn:hover {
            transform: translateY(-3px);
          }

          .btn-primary {
            color: white;
            background: #d97706;
            box-shadow: 0 12px 25px rgba(217, 119, 6, 0.3);
          }

          .btn-primary:hover {
            background: #b45309;
          }

          .btn-ghost {
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.35);
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
          }

          .btn-ghost:hover {
            background: rgba(255, 255, 255, 0.22);
          }

          .hero-images {
            position: relative;
            width: 390px;
            min-width: 390px;
            height: 430px;
            animation: fadeIn 1.2s ease 0.25s both;
          }

          .hero-image {
            position: absolute;
            overflow: hidden;
            border: 5px solid rgba(255, 255, 255, 0.8);
            border-radius: 24px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          }

          .hero-image img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .hero-image-main {
            top: 15px;
            left: 50px;
            width: 260px;
            height: 330px;
            transform: rotate(-5deg);
          }

          .hero-image-small-one {
            right: 0;
            bottom: 20px;
            width: 170px;
            height: 190px;
            transform: rotate(7deg);
          }

          .hero-image-small-two {
            bottom: 0;
            left: 0;
            width: 155px;
            height: 160px;
            transform: rotate(-8deg);
          }

          .image-label {
            position: absolute;
            right: 28px;
            top: 42px;
            z-index: 5;
            padding: 12px 16px;
            border-radius: 14px;
            color: #3b2114;
            background: #fff7ed;
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
            font-size: 0.78rem;
            font-weight: 800;
          }

          .features-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 90px 24px 80px;
          }

          .section-heading {
            max-width: 680px;
            margin: 0 auto 42px;
            text-align: center;
          }

          .section-heading span {
            color: #c2410c;
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 0.15em;
            text-transform: uppercase;
          }

          .section-heading h2 {
            margin: 12px 0;
            color: #2b1a12;
            font-family: "Playfair Display", serif;
            font-size: clamp(2rem, 4vw, 3.4rem);
          }

          .section-heading p {
            margin: 0;
            color: #7b6a5f;
            line-height: 1.7;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }

          .feature-card {
            padding: 28px 22px;
            border: 1px solid #f0dfd0;
            border-radius: 22px;
            background: white;
            box-shadow: 0 12px 35px rgba(61, 34, 18, 0.07);
            text-align: center;
            transition: 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 45px rgba(61, 34, 18, 0.14);
          }

          .feature-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: #fff1df;
            font-size: 2rem;
          }

          .feature-card h3 {
            margin: 0 0 10px;
            color: #3b2114;
            font-family: "Playfair Display", serif;
            font-size: 1.35rem;
          }

          .feature-card p {
            margin: 0;
            color: #796b62;
            font-size: 0.92rem;
            line-height: 1.7;
          }

          .floating-gallery {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 24px 100px;
          }

          .gallery-title {
            margin: 0 0 10px;
            color: #2b1a12;
            font-family: "Playfair Display", serif;
            font-size: clamp(2rem, 4vw, 3.4rem);
            text-align: center;
          }

          .gallery-sub {
            margin: 0 auto 35px;
            color: #7b6a5f;
            text-align: center;
          }

          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }

          .float-card {
            position: relative;
            height: 255px;
            overflow: hidden;
            border-radius: 22px;
            background: #e8dbcf;
            box-shadow: 0 15px 40px rgba(61, 34, 18, 0.14);
            cursor: pointer;
            animation: floatY 4.5s ease-in-out infinite;
            transition: transform 0.3s ease;
          }

          .float-card:hover {
            transform: scale(1.03);
          }

          .float-card img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .float-card:hover img {
            transform: scale(1.08);
          }

          .float-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background: linear-gradient(
              to top,
              rgba(20, 10, 5, 0.55),
              rgba(20, 10, 5, 0.05)
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .float-card:hover .float-overlay {
            opacity: 1;
          }

          .float-overlay span {
            font-size: 1.6rem;
          }

          .float-1 {
            animation-name: floatY;
            animation-duration: 4.5s;
          }

          .float-2 {
            animation-name: driftLeft;
            animation-duration: 5s;
          }

          .float-3 {
            animation-name: fallLoop;
            animation-duration: 6s;
          }

          .float-4 {
            animation-name: driftRight;
            animation-duration: 5.5s;
          }

          .lightbox {
            position: fixed;
            inset: 0;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 24px;
            background: rgba(10, 10, 10, 0.92);
          }

          .lightbox img {
            max-width: 92vw;
            max-height: 78vh;
            border-radius: 14px;
            object-fit: contain;
          }

          .lightbox-close {
            position: absolute;
            top: 22px;
            right: 22px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            color: white;
            background: rgba(255, 255, 255, 0.12);
            font-size: 1.2rem;
            cursor: pointer;
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(28px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes floatY {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-12px);
            }
          }

          @keyframes driftLeft {
            0%,
            100% {
              transform: translateX(0);
            }

            50% {
              transform: translateX(-8px);
            }
          }

          @keyframes driftRight {
            0%,
            100% {
              transform: translateX(0);
            }

            50% {
              transform: translateX(8px);
            }
          }

          @keyframes fallLoop {
            0%,
            100% {
              transform: translateY(-8px);
            }

            50% {
              transform: translateY(10px);
            }
          }

          @media (max-width: 950px) {
            .hero {
              padding: 100px 5% 70px;
            }

            .hero-content {
              flex-direction: column;
              align-items: flex-start;
            }

            .hero-images {
              align-self: center;
            }

            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 700px) {
            .hero {
              min-height: auto;
              padding: 100px 20px 70px;
            }

            .hero-content {
              gap: 40px;
            }

            .hero-title {
              font-size: clamp(2.8rem, 14vw, 4.5rem);
            }

            .hero-description {
              font-size: 1rem;
            }

            .hero-images {
              align-self: center;
              width: 310px;
              min-width: 310px;
              height: 360px;
              transform: scale(0.9);
              transform-origin: center;
            }

            .hero-image-main {
              left: 30px;
              width: 220px;
              height: 280px;
            }

            .hero-image-small-one {
              width: 140px;
              height: 160px;
            }

            .hero-image-small-two {
              width: 130px;
              height: 140px;
            }

            .image-label {
              right: 5px;
              top: 30px;
            }

            .features-grid {
              grid-template-columns: 1fr;
            }

            .gallery-grid {
              grid-template-columns: 1fr;
            }

            .float-card {
              height: 280px;
            }
          }
        `}</style>

        <section className="hero">
          <img
            className="hero-bg"
            src={cafeInteriorImg}
            alt="Green Valley Coffee interior"
          />

          <div className="hero-content">
            <div className="hero-text">
              <span className="eyebrow">Welcome to Green Valley Coffee</span>

              <h1 className="hero-title">
                Where Every Sip Feels Like Home
              </h1>

              <p className="hero-description">
                Discover freshly brewed coffee, refreshing cold drinks,
                delicious snacks, and peaceful moments at Green Valley Coffee.
              </p>

              <div className="hero-highlights">
                <span>Freshly brewed</span>
                <span>Cozy ambience</span>
                <span>Delicious moments</span>
              </div>

              <div className="hero-actions">
                <a className="btn btn-primary" href="/cafe-menu">
                  Explore Our Menu
                </a>

                <a className="btn btn-ghost" href="#gallery">
                  View Cafe Gallery
                </a>
              </div>
            </div>

            <div className="hero-images">
              <div className="image-label">Made with love ☕</div>

              <div className="hero-image hero-image-main">
                <img src={coffeeBeansImg} alt="Fresh coffee beans" />
              </div>

              <div className="hero-image hero-image-small-one">
                <img src={coldCoffeeImg} alt="Refreshing cold coffee" />
              </div>

              <div className="hero-image hero-image-small-two">
                <img src={snacksImg} alt="Delicious cafe snacks" />
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <span>More than just coffee</span>

            <h2>Everything You Need for a Perfect Cafe Moment</h2>

            <p>
              Whether you want to relax, meet friends, work peacefully, or
              enjoy something delicious, Green Valley Coffee is the perfect
              place for you.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="gallery"
          className={`floating-gallery ${showGallery ? "show" : ""}`}
        >
          <h2 className="gallery-title">Our Cafe Moments</h2>

          <p className="gallery-sub">
            Take a look at the atmosphere, flavours, and moments waiting for
            you.
          </p>

          <div className="gallery-grid">
            {galleryImages.map((img, index) => (
              <FloatingImage
                key={img.id}
                img={img}
                index={index}
                onClick={setSelected}
              />
            ))}
          </div>
        </section>

        <GalleryLightbox
          image={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </>
  );
}