import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ============================================
   Green Valley — Menu Landing Page
   Category grid with filter tabs
   ============================================ */

/* ---------- DATA ---------- */
const menuData = {
  cafe: {
    icon: '☕',
    title: 'Café',
    subtitle: 'Fresh brews & cozy bites',
    categories: [
      { id: 'coffee', name: 'Coffee', itemCount: 18, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&auto=format&fit=crop' },
      { id: 'tea', name: 'Tea', itemCount: 14, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop' },
      { id: 'milk', name: 'Milk & More', itemCount: 10, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop' },
      { id: 'shakes', name: 'Shakes', itemCount: 16, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop' },
      { id: 'snacks', name: 'Snacks', itemCount: 20, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&auto=format&fit=crop' },
      { id: 'desserts', name: 'Desserts', itemCount: 12, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop' },
      { id: 'specials', name: 'Specials', itemCount: 16, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
    ],
  },
  restaurant: {
    icon: '🍽️',
    title: 'Restaurant',
    subtitle: 'Hearty meals & timeless flavors',
    categories: [
      { id: 'tiffins', name: 'Tiffins', itemCount: 22, image: 'https://images.unsplash.com/photo-1662116765994-54592e8772a5?w=400&auto=format&fit=crop' },
      { id: 'starters', name: 'Starters', itemCount: 20, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop' },
      { id: 'biryani', name: 'Biryani', itemCount: 16, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop' },
      { id: 'meals', name: 'Meals', itemCount: 18, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
      { id: 'curries', name: 'Curries', itemCount: 25, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
      { id: 'fried-rice', name: 'Fried Rice & Noodles', itemCount: 18, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop' },
      { id: 'restaurant-specials', name: 'Restaurant Specials', itemCount: 15, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop' },
    ],
  },
};

/* ---------- Category Card ---------- */
function CategoryCard({ category, side, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/menu/${side}/${category.id}`}
      style={{
        ...styles.catCard,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(44,24,16,0.1)'
          : '0 2px 8px rgba(60,40,20,0.04)',
        transition: 'all 0.3s ease',
        animation: `fadeInUp 0.5s ease ${delay}s both`,
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.catImageWrap, overflow: 'hidden' }}>
        <img
          src={category.image}
          alt={category.name}
          style={{
            ...styles.catImage,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
      </div>
      <div style={styles.catInfo}>
        <p style={styles.catName}>{category.name}</p>
        <p style={styles.catCount}>{category.itemCount} Items</p>
      </div>
    </Link>
  );
}

/* ---------- Section Block ---------- */
function SectionBlock({ side, data, delayStart }) {
  const [filter, setFilter] = useState('all');
  const showCafe = filter === 'all' || filter === 'cafe';
  const showRestaurant = filter === 'all' || filter === 'restaurant';

  const filters = [
    { key: 'all', label: 'All Menu' },
    { key: 'cafe', label: 'Cafe' },
    { key: 'restaurant', label: 'Restaurant' },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <p style={styles.headerOverline}>THE GREEN VALLEY</p>
        <h1 style={styles.headerTitle}>The Full Menu</h1>
        <p style={styles.headerText}>
          Browse by side — cafe, restaurant, or all together. Prices in INR.
        </p>

        <div style={styles.filterWrap}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                ...styles.filterBtn,
                ...(filter === f.key ? styles.filterBtnActive : {}),
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main style={styles.main}>
        {/* Cafe Section */}
        {showCafe && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>{menuData.cafe.icon}</span>
              <div>
                <h2 style={styles.sectionTitle}>{menuData.cafe.title}</h2>
                <p style={styles.sectionSubtitle}>{menuData.cafe.subtitle}</p>
              </div>
            </div>
            <div style={styles.grid}>
              {menuData.cafe.categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  side="cafe"
                  delay={i * 0.06}
                />
              ))}
            </div>
          </section>
        )}

        {/* Restaurant Section */}
        {showRestaurant && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>{menuData.restaurant.icon}</span>
              <div>
                <h2 style={styles.sectionTitle}>{menuData.restaurant.title}</h2>
                <p style={styles.sectionSubtitle}>{menuData.restaurant.subtitle}</p>
              </div>
            </div>
            <div style={styles.grid}>
              {menuData.restaurant.categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  side="restaurant"
                  delay={i * 0.06}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>COFFEE, SHAKES & BITES</p>
      </footer>
    </div>
  );
}

export default function MenuPage() {
  return <SectionBlock />;
}

/* ============================================
   STYLES
   ============================================ */
const styles = {
  page: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    backgroundColor: '#faf8f5',
    color: '#2c1810',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased',
  },

  /* --- Header --- */
  header: {
    textAlign: 'center',
    padding: '60px 24px 30px',
  },
  headerOverline: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#a08060',
    marginBottom: '10px',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 700,
    color: '#2c1810',
    margin: '0 0 10px 0',
    lineHeight: 1.2,
  },
  headerText: {
    fontSize: '0.9rem',
    color: '#8a8279',
    lineHeight: 1.5,
    margin: '0 0 24px 0',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  /* --- Filter --- */
  filterWrap: {
    display: 'inline-flex',
    gap: '6px',
    background: '#fff',
    padding: '5px',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(60,40,20,0.05)',
  },
  filterBtn: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: '10px 22px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#8a8279',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  filterBtnActive: {
    background: '#2c1810',
    color: '#fff',
  },

  /* --- Main --- */
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px 60px',
  },

  /* --- Section --- */
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eeeae4',
  },
  sectionIcon: {
    fontSize: '1.6rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    background: '#f5f0e8',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#2c1810',
    margin: '0 0 2px 0',
  },
  sectionSubtitle: {
    fontSize: '0.8rem',
    color: '#8a8279',
    margin: 0,
  },

  /* --- Grid --- */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
  },

  /* --- Category Card --- */
  catCard: {
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #f0e6dc',
    cursor: 'pointer',
  },
  catImageWrap: {
    width: '100%',
    height: '120px',
    position: 'relative',
  },
  catImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  catInfo: {
    padding: '12px',
  },
  catName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#2c1810',
    margin: '0 0 3px 0',
  },
  catCount: {
    fontSize: '0.7rem',
    color: '#8a8279',
    margin: 0,
  },

  /* --- Footer --- */
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #eeeae4',
  },
  footerText: {
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#b0a99f',
    margin: 0,
  },
};