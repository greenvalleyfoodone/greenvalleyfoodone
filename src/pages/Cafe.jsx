import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

const cafeInteriorImg = "/images/cafe.png";
const coffeeBeansImg = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=900&auto=format&fit=crop";
const coldCoffeeImg = "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=900&auto=format&fit=crop";
const snacksImg = "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=900&auto=format&fit=crop";

const galleryImages = [
  { id: 1, src: cafeInteriorImg, alt: "Cafe interior", caption: "Cafe Ambience" },
  { id: 2, src: coffeeBeansImg, alt: "Coffee beans", caption: "Fresh Beans" },
  { id: 3, src: coldCoffeeImg, alt: "Cold coffee", caption: "Cold Coffee" },
  { id: 4, src: snacksImg, alt: "Snacks", caption: "Crispy Snacks" },
  { id: 5, src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&auto=format&fit=crop", alt: "Dessert", caption: "Sweet Treats" },
  { id: 6, src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop", alt: "Coffee cup", caption: "Hot Brew" },
];

const menuData = [
  {
    id: "coffee",
    title: "Coffee",
    description: "Freshly brewed from 100% pure beans.",
    image: coffeeBeansImg,
    items: [
      { name: "Regular Coffee", price: 30 },
      { name: "Filter Coffee", price: 40 },
      { name: "Black Coffee", price: 30 },
      { name: "Tati Bellam Coffee", price: 30, badge: "Signature" },
    ],
  },
  {
    id: "premium-coffee",
    title: "Premium Coffee",
    description: "Hand-flavored with rich syrups.",
    image: coffeeBeansImg,
    items: [
      { name: "Hazelnut Coffee", price: 60 },
      { name: "Vanilla Coffee", price: 60 },
      { name: "Chocolate Coffee", price: 60 },
      { name: "Caramel Coffee", price: 60 },
    ],
  },
  {
    id: "cold-coffee",
    title: "Cold Coffee",
    description: "Iced, blended, and refreshing.",
    image: coldCoffeeImg,
    items: [
      { name: "Premium Cold Coffee", price: 70 },
      { name: "Vanilla Cold Coffee", price: 90 },
      { name: "Hazelnut Cold Coffee", price: 90 },
      { name: "Chocolate Cold Coffee", price: 90 },
      { name: "Caramel Cold Coffee", price: 90 },
    ],
  },
  {
    id: "milkshakes",
    title: "Milkshakes",
    description: "Thick, creamy, and delicious.",
    image: coldCoffeeImg,
    items: [
      { name: "Strawberry", price: 80 },
      { name: "Mango", price: 90 },
      { name: "Chocolate", price: 90 },
      { name: "Oreo", price: 90, badge: "Top pick" },
      { name: "KitKat", price: 90 },
      { name: "Nutella", price: 90 },
    ],
  },
  {
    id: "mojitos",
    title: "Mojitos",
    description: "Minty, icy, and refreshing.",
    image: snacksImg,
    items: [
      { name: "Virgin Mojito", price: 80 },
      { name: "Blue Curacao", price: 80 },
      { name: "Strawberry", price: 80 },
      { name: "Green Apple", price: 80 },
    ],
  },
  {
    id: "snacks-veg",
    title: "Snacks · Veg",
    description: "Crispy, hot and made to share.",
    image: snacksImg,
    items: [
      { name: "French Fries", price: 80 },
      { name: "Veg Nuggets (6pcs)", price: 90 },
      { name: "Veg Fingers (6pcs)", price: 90 },
      { name: "Veg Momos (6pcs)", price: 90 },
      { name: "Veg Sandwich", price: 90 },
    ],
  },
];

function FloatingImage({ img, index, onClick }) {
  return (
    <div
      className={`float-card float-${(index % 4) + 1}`}
      onClick={() => onClick(img)}
      title={img.caption}
    >
      <img src={img.src} alt={img.alt} />
      <div className="float-overlay">
        <span>🔍</span>
        <p>{img.caption}</p>
      </div>
    </div>
  );
}

function GalleryLightbox({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img src={image.src} alt={image.alt} onClick={(e) => e.stopPropagation()} />
      <p>{image.caption}</p>
    </div>
  );
}

export default function CafePage() {
  const [selected, setSelected] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowGallery(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #faf7f2; }

        .page {
          font-family: "Inter", system-ui, sans-serif;
          color: #1f140f;
          background: #faf7f2;
          min-height: 100vh;
        }

        .hero {
          position: relative;
          min-height: 92vh;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0.2));
          z-index: 1;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.04);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 5rem 1.5rem 3rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          color: white;
        }

        .hero-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(2.5rem, 7vw, 5.4rem);
          line-height: 1;
          margin: 0 0 1rem;
          animation: fadeUp 1s ease both;
        }

        .hero-sub {
          max-width: 640px;
          font-size: 1.05rem;
          line-height: 1.8;
          opacity: 0.95;
          margin: 0 0 1.5rem;
          animation: fadeUp 1s ease 0.15s both;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          animation: fadeUp 1s ease 0.3s both;
        }

        .btn {
          border: none;
          border-radius: 999px;
          padding: 0.95rem 1.4rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary { background: #d97706; color: white; }
        .btn-ghost { background: rgba(255,255,255,0.14); color: white; backdrop-filter: blur(8px); }

        .floating-gallery {
          position: relative;
          z-index: 2;
          margin-top: 2rem;
          padding: 0 1.5rem 4rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .gallery-title {
          font-family: "Playfair Display", serif;
          color: #2b1a12;
          font-size: clamp(1.7rem, 4vw, 2.8rem);
          margin: 0 0 0.5rem;
          text-align: center;
        }

        .gallery-sub {
          text-align: center;
          color: #7b6a5f;
          margin: 0 0 2rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .float-card {
          position: relative;
          height: 240px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(61, 34, 18, 0.14);
          transform-origin: center;
          animation: floatY 4.5s ease-in-out infinite;
          transition: transform 0.3s ease;
          background: #e8dbcf;
        }

        .float-card:hover {
          transform: scale(1.03);
        }

        .float-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .float-card:hover img {
          transform: scale(1.08);
        }

        .float-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20,10,5,0.72), rgba(20,10,5,0.05));
          color: white;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 18px;
          opacity: 0;
          transition: opacity 0.3s ease;
          text-align: center;
        }

        .float-card:hover .float-overlay {
          opacity: 1;
        }

        .float-overlay p {
          margin: 6px 0 0;
          font-family: "Playfair Display", serif;
          font-size: 1.1rem;
        }

        .float-1 { animation-name: floatY, rotateSlow; animation-duration: 4.5s, 16s; }
        .float-2 { animation-name: floatY, driftLeft; animation-duration: 5s, 14s; }
        .float-3 { animation-name: fallLoop, driftRight; animation-duration: 6s, 15s; }
        .float-4 { animation-name: circularMove; animation-duration: 12s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes rotateSlow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(0deg); }
        }

        @keyframes driftLeft {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(-8px); }
        }

        @keyframes driftRight {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }

        @keyframes fallLoop {
          0% { transform: translateY(-8px); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(-8px); }
        }

        @keyframes circularMove {
          0% { transform: rotate(0deg) translateX(0); }
          25% { transform: rotate(0deg) translateX(4px); }
          50% { transform: rotate(0deg) translateX(0); }
          75% { transform: rotate(0deg) translateX(-4px); }
          100% { transform: rotate(0deg) translateX(0); }
        }

        .menu-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 5rem;
        }

        .menu-row {
          display: flex;
          align-items: center;
          gap: 2.2rem;
          flex-wrap: wrap;
          margin: 0 0 3.2rem;
        }

        .menu-row.reverse {
          flex-direction: row-reverse;
        }

        .menu-img-wrap {
          flex: 1 1 320px;
          min-width: 280px;
        }

        .menu-img-wrap img {
          width: 100%;
          height: 340px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .menu-content {
          flex: 1 1 360px;
          min-width: 280px;
        }

        .menu-content h2 {
          font-family: "Playfair Display", serif;
          color: #2c1810;
          font-size: 1.9rem;
          margin: 0 0 8px;
        }

        .menu-content p {
          color: #6f6259;
          margin: 0 0 18px;
          line-height: 1.7;
        }

        .menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid #ecdccf;
        }

        .menu-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #ecdccf;
        }

        .item-name {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #c2410c;
          color: white;
          padding: 3px 8px;
          border-radius: 999px;
          font-weight: 700;
        }

        .price {
          color: #6d4734;
          font-weight: 700;
          white-space: nowrap;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(10,10,10,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 999;
          padding: 24px;
        }

        .lightbox img {
          max-width: 92vw;
          max-height: 78vh;
          border-radius: 14px;
          object-fit: contain;
        }

        .lightbox p {
          color: white;
          margin-top: 16px;
          font-family: "Playfair Display", serif;
          font-size: 1.2rem;
        }

        .lightbox-close {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: 1fr; }
          .menu-row, .menu-row.reverse { flex-direction: column; }
          .menu-img-wrap img { height: 280px; }
        }
      `}</style>

      <section className="hero">
        <img className="hero-bg" src={cafeInteriorImg} alt="Cafe interior" />
        <div className="hero-content">
          <h1 className="hero-title">Green Valley Coffee</h1>
          <p className="hero-sub">
            A cozy cafe experience with premium coffee, cold drinks, and fresh snacks.
            Explore the flowing gallery first, then scroll down to see the menu.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#gallery">View Gallery</a>
            <a className="btn btn-ghost" href="#menu">See Menu</a>
          </div>
        </div>
      </section>

      <section id="gallery" className={`floating-gallery ${showGallery ? "show" : ""}`}>
        <h2 className="gallery-title">Our Cafe Moments</h2>
        <div className="gallery-grid">
          {galleryImages.map((img, index) => (
            <FloatingImage key={img.id} img={img} index={index} onClick={setSelected} />
          ))}
        </div>
      </section>

      <section id="menu" className="menu-section">
        {menuData.map((section, idx) => (
          <div key={section.id} className={`menu-row ${idx % 2 === 1 ? "reverse" : ""}`}>
            <div className="menu-img-wrap">
              <img src={section.image} alt={section.title} />
            </div>

            <div className="menu-content">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <ul className="menu-list">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <span className="item-name">
                      {item.name}
                      {item.badge && <span className="badge">{item.badge}</span>}
                    </span>
                    <span className="price">₹{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <GalleryLightbox image={selected} onClose={() => setSelected(null)} />
    </div>
    </>
  );
}