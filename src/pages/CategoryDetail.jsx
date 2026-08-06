import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

/* ============================================
   Green Valley — Category Detail Page
   Sidebar + Product Grid + Category Sliders
   ============================================ */

/* ---------- FULL PRODUCT DATA ---------- */
const allData = {
  cafe: {
    icon: '☕',
    title: 'Café',
    subtitle: 'Fresh brews & cozy bites',
    categories: {
      coffee: {
        name: 'Coffee',
        description: 'A perfect blend for every mood',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&auto=format&fit=crop',
        products: [
          { id: 1, name: 'Cappuccino', desc: 'Espresso with steamed milk and a layer of foam.', price: 220, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop' },
          { id: 2, name: 'Latte', desc: 'Smooth espresso with steamed milk.', price: 200, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
          { id: 3, name: 'Americano', desc: 'Espresso diluted with hot water.', price: 180, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&auto=format&fit=crop' },
          { id: 4, name: 'Mocha', desc: 'Espresso with rich chocolate and steamed milk.', price: 240, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop' },
          { id: 5, name: 'Espresso', desc: 'Strong and bold single shot of espresso.', price: 150, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop' },
          { id: 6, name: 'Flat White', desc: 'Smooth espresso with steamed milk.', price: 210, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop' },
          { id: 7, name: 'Caramel Macchiato', desc: 'Vanilla-flavored milk with espresso & caramel.', price: 240, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&auto=format&fit=crop' },
          { id: 8, name: 'Hazelnut Coffee', desc: 'Aromatic hazelnut flavor with a coffee kick.', price: 230, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop' },
        ],
      },
      tea: {
        name: 'Tea',
        description: 'Warm up with our finest teas',
        image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop',
        products: [
          { id: 9, name: 'Masala Chai', desc: 'Spiced milk tea with cardamom and ginger.', price: 120, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&auto=format&fit=crop' },
          { id: 10, name: 'Green Tea', desc: 'Refreshing green tea with antioxidants.', price: 130, image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&auto=format&fit=crop' },
          { id: 11, name: 'Lemon Tea', desc: 'Black tea with fresh lemon and honey.', price: 130, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop' },
          { id: 12, name: 'Ginger Tea', desc: 'Strong ginger-infused black tea.', price: 120, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop' },
          { id: 13, name: 'Earl Grey', desc: 'Classic bergamot-flavored black tea.', price: 140, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop' },
        ],
      },
      milk: {
        name: 'Milk & More',
        description: 'Wholesome & refreshing drinks',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop',
        products: [
          { id: 14, name: 'Cold Milk', desc: 'Chilled farm-fresh milk.', price: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop' },
          { id: 15, name: 'Chocolate Milk', desc: 'Rich chocolate-flavored cold milk.', price: 120, image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&auto=format&fit=crop' },
          { id: 16, name: 'Badam Milk', desc: 'Almond-flavored warm milk.', price: 130, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&auto=format&fit=crop' },
          { id: 17, name: 'Turmeric Milk', desc: 'Golden milk with turmeric and honey.', price: 120, image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&auto=format&fit=crop' },
          { id: 18, name: 'Oreo Milkshake', desc: 'Creamy Oreo cookie milkshake.', price: 160, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop' },
        ],
      },
      shakes: {
        name: 'Shakes',
        description: 'Creamy shakes for every craving',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop',
        products: [
          { id: 19, name: 'Chocolate Shake', desc: 'Rich chocolate ice cream shake.', price: 180, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop' },
          { id: 20, name: 'Strawberry Shake', desc: 'Fresh strawberry blended shake.', price: 180, image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400&auto=format&fit=crop' },
          { id: 21, name: 'Vanilla Shake', desc: 'Classic vanilla bean milkshake.', price: 170, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop' },
          { id: 22, name: 'Mango Shake', desc: 'Seasonal mango thick shake.', price: 180, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&auto=format&fit=crop' },
          { id: 23, name: 'Coffee Shake', desc: 'Cold coffee blended with ice cream.', price: 190, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop' },
        ],
      },
      snacks: {
        name: 'Snacks',
        description: 'Tasty bites to fuel your mood',
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&auto=format&fit=crop',
        products: [
          { id: 24, name: 'Veg Sandwich', desc: 'Grilled veggies with cheese.', price: 120, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop' },
          { id: 25, name: 'French Fries', desc: 'Crispy golden potato fries.', price: 130, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&auto=format&fit=crop' },
          { id: 26, name: 'Cheese Balls', desc: 'Crispy cheese-filled bites.', price: 130, image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&auto=format&fit=crop' },
          { id: 27, name: 'Veg Puff', desc: 'Flaky pastry with spiced filling.', price: 110, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop' },
          { id: 28, name: 'Garlic Bread', desc: 'Toasted bread with garlic butter.', price: 140, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&auto=format&fit=crop' },
        ],
      },
      desserts: {
        name: 'Desserts',
        description: 'Sweet treats for a perfect end',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop',
        products: [
          { id: 29, name: 'Chocolate Brownie', desc: 'Warm brownie with nuts.', price: 150, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop' },
          { id: 30, name: 'Cheesecake', desc: 'Creamy New York style cheesecake.', price: 160, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=400&auto=format&fit=crop' },
          { id: 31, name: 'Tiramisu', desc: 'Classic Italian coffee dessert.', price: 170, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop' },
          { id: 32, name: 'Chocolate Lava Cake', desc: 'Molten center chocolate cake.', price: 180, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&auto=format&fit=crop' },
          { id: 33, name: 'Ice Cream (2 Scoops)', desc: 'Choice of vanilla, chocolate or strawberry.', price: 120, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop' },
        ],
      },
      specials: {
        name: 'Specials',
        description: "Chef's special creations",
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop',
        products: [
          { id: 34, name: 'Affogato', desc: 'Vanilla ice cream drowned in espresso.', price: 220, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop' },
          { id: 35, name: 'Irish Coffee', desc: 'Coffee with Irish whiskey and cream.', price: 240, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop' },
          { id: 36, name: 'Nitro Cold Brew', desc: 'Nitrogen-infused cold brew coffee.', price: 230, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop' },
          { id: 37, name: 'Cinnamon Coffee', desc: 'Spiced coffee with cinnamon stick.', price: 220, image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&auto=format&fit=crop' },
          { id: 38, name: 'Vienna Coffee', desc: 'Espresso topped with whipped cream.', price: 230, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&auto=format&fit=crop' },
        ],
      },
    },
  },
  restaurant: {
    icon: '🍽️',
    title: 'Restaurant',
    subtitle: 'Hearty meals & timeless flavors',
    categories: {
      tiffins: {
        name: 'Tiffins',
        description: 'Early morning favorites from the village kitchen.',
        image: 'https://images.unsplash.com/photo-1662116765994-54592e8772a5?w=400&auto=format&fit=crop',
        products: [
          { id: 101, name: 'Pesarattu with Upma', desc: 'Green gram dosa with semolina upma.', price: 110, image: 'https://images.unsplash.com/photo-1662116765994-54592e8772a5?w=400&auto=format&fit=crop' },
          { id: 102, name: 'Idly Sambar', desc: 'Steamed rice cakes with lentil soup.', price: 60, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop' },
          { id: 103, name: 'Dosa (Plain)', desc: 'Crispy rice crepe.', price: 50, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop' },
          { id: 104, name: 'Dosa (Masala)', desc: 'Crispy dosa with spiced potato filling.', price: 70, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop' },
          { id: 105, name: 'Puri Bhaji', desc: 'Deep-fried bread with potato curry.', price: 80, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
        ],
      },
      starters: {
        name: 'Starters',
        description: 'Crispy, spicy and perfect to share.',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop',
        products: [
          { id: 106, name: 'Chicken 65', desc: 'Spicy deep-fried chicken bites.', price: 180, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop' },
          { id: 107, name: 'Apollo Fish', desc: 'Tangy battered fish fry.', price: 220, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop' },
          { id: 108, name: 'Chilli Chicken', desc: 'Indo-Chinese style chicken.', price: 190, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
          { id: 109, name: 'Paneer Tikka', desc: 'Grilled cottage cheese with spices.', price: 160, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop' },
        ],
      },
      biryani: {
        name: 'Biryani',
        description: 'Slow-cooked dum biryanis with home-ground spices.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop',
        products: [
          { id: 110, name: 'Andhra Chicken Biryani', desc: 'Slow-cooked with home-ground spices, served with raita.', price: 280, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop' },
          { id: 111, name: 'Mutton Biryani', desc: 'Tender mutton layered with fragrant rice.', price: 350, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&auto=format&fit=crop' },
          { id: 112, name: 'Veg Biryani', desc: 'Mixed vegetables with aromatic basmati.', price: 200, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop' },
          { id: 113, name: 'Egg Biryani', desc: 'Boiled eggs in spiced rice.', price: 180, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop' },
        ],
      },
      meals: {
        name: 'Meals',
        description: 'Unlimited thalis served on banana leaf.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop',
        products: [
          { id: 114, name: 'Full Andhra Meals (Veg)', desc: 'Unlimited rice, sambar, rasam, curries and pickle.', price: 150, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
          { id: 115, name: 'Full Andhra Meals (Non-Veg)', desc: 'Meals thali with a chicken or fish curry.', price: 220, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
          { id: 116, name: 'Mini Meals', desc: 'Compact thali with essentials.', price: 120, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop' },
        ],
      },
      curries: {
        name: 'Curries',
        description: 'Traditional gravies rooted in Prakasam recipes.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop',
        products: [
          { id: 117, name: 'Gongura Mutton', desc: 'Sorrel leaf curry, a Prakasam specialty.', price: 320, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
          { id: 118, name: 'Royyala Iguru', desc: 'Prawn curry in a thick Andhra masala.', price: 300, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop' },
          { id: 119, name: 'Chicken Curry', desc: 'Home-style chicken gravy.', price: 260, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop' },
          { id: 120, name: 'Natu Kodi Pulusu', desc: 'Country chicken in tangy tamarind gravy.', price: 340, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop' },
        ],
      },
      'fried-rice': {
        name: 'Fried Rice & Noodles',
        description: 'Indo-Chinese favorites.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop',
        products: [
          { id: 121, name: 'Veg Fried Rice', desc: 'Rice tossed with vegetables and soy.', price: 160, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop' },
          { id: 122, name: 'Chicken Fried Rice', desc: 'Rice with chicken and vegetables.', price: 200, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
          { id: 123, name: 'Egg Fried Rice', desc: 'Rice with scrambled eggs.', price: 170, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
          { id: 124, name: 'Hakka Noodles', desc: 'Stir-fried noodles with veggies.', price: 160, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&auto=format&fit=crop' },
        ],
      },
      'restaurant-specials': {
        name: 'Restaurant Specials',
        description: "Chef's exclusive dishes.",
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop',
        products: [
          { id: 125, name: 'Gongura Mutton', desc: 'Sorrel leaf curry, a Prakasam specialty.', price: 320, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop' },
          { id: 126, name: 'Royyala Iguru', desc: 'Prawn curry in a thick Andhra masala.', price: 300, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop' },
          { id: 127, name: 'Andhra Chicken Biryani', desc: 'Slow-cooked with home-ground spices.', price: 280, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop' },
        ],
      },
    },
  },
};

/* ---------- Heart Icon ---------- */
function HeartIcon({ filled, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 2,
        fontSize: '0.9rem',
        color: filled ? '#e74c3c' : '#999',
        transition: 'all 0.2s ease',
      }}
    >
      {filled ? '♥' : '♡'}
    </button>
  );
}

/* ---------- Product Card ---------- */
function ProductCard({ product, delay }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="product-card"
      style={{
        ...styles.productCard,
        animation: `fadeInUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>
        <img src={product.image} alt={product.name} style={styles.productImage} />
        <HeartIcon filled={liked} onClick={() => setLiked(!liked)} />
      </div>
      <div style={styles.productInfo}>
        <h3 style={styles.productName}>{product.name}</h3>
        <p style={styles.productDesc}>{product.desc}</p>
        <div style={styles.productFooter}>
          <span style={styles.productPrice}>₹{product.price}</span>
          <button
            type="button"
            className="add-button"
            style={styles.addBtn}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Category Slider ---------- */
function CategorySlider({ side, categoryKey, categoryData, currentProductId }) {
  const products = categoryData.products.slice(0, 5);

  return (
    <div style={styles.sliderSection}>
      <div style={styles.sliderHeader}>
        <div style={styles.sliderHeaderLeft}>
          <span style={styles.sliderIcon}>☕</span>
          <div>
            <h4 style={styles.sliderTitle}>{categoryData.name}</h4>
            <p style={styles.sliderDesc}>{categoryData.description}</p>
          </div>
        </div>
        <Link
          to={`/menu/${side}/${categoryKey}`}
          style={styles.viewAllBtn}
        >
          View All ({categoryData.products.length})
        </Link>
      </div>
      <div style={styles.sliderGrid}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/menu/${side}/${categoryKey}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={styles.sliderCard}>
              <img src={product.image} alt={product.name} style={styles.sliderCardImage} />
              <p style={styles.sliderCardName}>{product.name}</p>
              <p style={styles.sliderCardPrice}>₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ side, activeCategory }) {
  const data = allData[side];
  const otherSide = side === 'cafe' ? 'restaurant' : 'cafe';
  const otherData = allData[otherSide];

  return (
    <aside style={styles.sidebar}>
      {/* Cafe Section */}
      <div style={styles.sidebarGroup}>
        <div style={styles.sidebarGroupHeader}>
          <span style={styles.sidebarGroupIcon}>{allData.cafe.icon}</span>
          <div>
            <p style={styles.sidebarGroupTitle}>{allData.cafe.title}</p>
            <p style={styles.sidebarGroupSub}>{allData.cafe.subtitle}</p>
          </div>
        </div>
        <div style={styles.sidebarList}>
          {Object.entries(allData.cafe.categories).map(([key, cat]) => {
            const isActive = side === 'cafe' && key === activeCategory;
            return (
              <Link
                key={key}
                to={`/menu/cafe/${key}`}
                style={{
                  ...styles.sidebarItem,
                  ...(isActive ? styles.sidebarItemActive : {}),
                }}
              >
                <span style={styles.sidebarItemName}>{cat.name}</span>
                <span style={styles.sidebarItemCount}>{cat.products.length}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Restaurant Section */}
      <div style={styles.sidebarGroup}>
        <div style={styles.sidebarGroupHeader}>
          <span style={styles.sidebarGroupIcon}>{allData.restaurant.icon}</span>
          <div>
            <p style={styles.sidebarGroupTitle}>{allData.restaurant.title}</p>
            <p style={styles.sidebarGroupSub}>{allData.restaurant.subtitle}</p>
          </div>
        </div>
        <div style={styles.sidebarList}>
          {Object.entries(allData.restaurant.categories).map(([key, cat]) => {
            const isActive = side === 'restaurant' && key === activeCategory;
            return (
              <Link
                key={key}
                to={`/menu/restaurant/${key}`}
                style={{
                  ...styles.sidebarItem,
                  ...(isActive ? styles.sidebarItemActive : {}),
                }}
              >
                <span style={styles.sidebarItemName}>{cat.name}</span>
                <span style={styles.sidebarItemCount}>{cat.products.length}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <Link to="/menu" style={styles.backBtn}>
        ← Back to All Menu
      </Link>
    </aside>
  );
}

/* ---------- Main Page ---------- */
export default function CategoryDetail() {
  const { side, categoryId } = useParams();
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [sortOption, setSortOption] = useState('default');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [sortLabel, setSortLabel] = useState('Default');
  const [filterLabel, setFilterLabel] = useState('All Prices');
  const itemsPerPage = 3;
  const filterPanelRef = useRef(null);
  const sortPanelRef = useRef(null);

  const sideData = allData[side];
  const category = sideData?.categories[categoryId];

  if (!category) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Category not found</h2>
        <Link to="/menu">Back to Menu</Link>
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    let results = category.products;

    if (search.trim()) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceRange === 'under150') {
      results = results.filter((p) => p.price < 150);
    } else if (priceRange === '150to250') {
      results = results.filter((p) => p.price >= 150 && p.price <= 250);
    } else if (priceRange === 'above250') {
      results = results.filter((p) => p.price > 250);
    }

    const sorted = [...results];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [category.products, search, priceRange, sortOption]);

  useEffect(() => {
    setPageIndex(0);
  }, [search, categoryId, side, priceRange, sortOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target) &&
        sortPanelRef.current &&
        !sortPanelRef.current.contains(event.target)
      ) {
        setShowFilterPanel(false);
        setShowSortPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

  const otherCategories = Object.entries(sideData.categories).filter(
    ([key]) => key !== categoryId
  );

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .product-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 16px 40px rgba(44, 24, 16, 0.12);
        }
        .add-button {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .add-button:hover {
          transform: translateY(-2px);
        }
        .pagination-button {
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .pagination-button:hover {
          transform: scale(1.08);
          border-color: #d4cdc3;
          color: #2c1810;
        }
        .panel-dropdown {
          position: absolute;
          top: 44px;
          right: 0;
          width: 180px;
          background: #fff;
          border: 1px solid #eeeae4;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(44, 24, 16, 0.12);
          padding: 8px 0;
          z-index: 20;
        }
        .panel-option {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 10px 14px;
          color: #3d3d3d;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .panel-option:hover {
          background: #f5f0e8;
        }
        .panel-option-active {
          color: #2c1810;
          font-weight: 700;
          background: #f5f0e8;
        }
        .page-dot {
          animation: pulseDots 2.4s ease-in-out infinite;
          transform-origin: center;
        }
        .page-dot-active {
          background: #2c1810;
          animation: pulseDotsActive 1.6s ease-in-out infinite;
        }
        @keyframes pulseDots {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes pulseDotsActive {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.92; transform: scale(1.2); }
        }
      `}</style>

      <div style={styles.container}>
        {/* Sidebar */}
        <Sidebar side={side} activeCategory={categoryId} />

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Breadcrumb */}
          <nav style={styles.breadcrumb}>
            <Link to="/" style={styles.breadcrumbLink}>Home</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <Link to="/menu" style={styles.breadcrumbLink}>
              {sideData.title}
            </Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbCurrent}>{category.name}</span>
          </nav>

          {/* Category Header */}
          <div style={styles.catHeader}>
            <div style={styles.catHeaderLeft}>
              <span style={styles.catHeaderIcon}>{sideData.icon}</span>
              <div>
                <h1 style={styles.catHeaderTitle}>{category.name}</h1>
                <p style={styles.catHeaderDesc}>{category.description}</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div style={styles.toolbar}>
              <div style={styles.searchWrap}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder={`Search ${category.name.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  style={{
                    ...styles.toolbarBtn,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '150px',
                  }}
                  onClick={() => {
                    setShowFilterPanel((prev) => !prev);
                    setShowSortPanel(false);
                  }}
                >
                  <span>Filter</span>
                  <span style={styles.toolbarBadge}>{filterLabel}</span>
                </button>
                {showFilterPanel && (
                  <div ref={filterPanelRef} style={{ ...styles.panelDropdown, animation: 'fadeInDown 0.2s ease' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange('all');
                        setFilterLabel('All Prices');
                        setShowFilterPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(priceRange === 'all' ? styles.panelOptionActive : {}),
                      }}
                    >
                      All Prices
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange('under150');
                        setFilterLabel('Under ₹150');
                        setShowFilterPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(priceRange === 'under150' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Under ₹150
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange('150to250');
                        setFilterLabel('₹150–₹250');
                        setShowFilterPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(priceRange === '150to250' ? styles.panelOptionActive : {}),
                      }}
                    >
                      ₹150–₹250
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange('above250');
                        setFilterLabel('Above ₹250');
                        setShowFilterPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(priceRange === 'above250' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Above ₹250
                    </button>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  style={{
                    ...styles.toolbarBtn,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '150px',
                  }}
                  onClick={() => {
                    setShowSortPanel((prev) => !prev);
                    setShowFilterPanel(false);
                  }}
                >
                  <span>Sort</span>
                  <span style={styles.toolbarBadge}>
                    {sortOption === 'default'
                      ? 'Default'
                      : sortOption === 'price-asc'
                      ? 'Price ↑'
                      : sortOption === 'price-desc'
                      ? 'Price ↓'
                      : sortOption === 'name-asc'
                      ? 'A → Z'
                      : 'Z → A'}
                  </span>
                </button>
                {showSortPanel && (
                  <div ref={sortPanelRef} style={{ ...styles.panelDropdown, animation: 'fadeInDown 0.2s ease' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption('default');
                        setShowSortPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(sortOption === 'default' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption('price-asc');
                        setShowSortPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(sortOption === 'price-asc' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Price low → high
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption('price-desc');
                        setShowSortPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(sortOption === 'price-desc' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Price high → low
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption('name-asc');
                        setShowSortPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(sortOption === 'name-asc' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Name A → Z
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption('name-desc');
                        setShowSortPanel(false);
                      }}
                      style={{
                        ...styles.panelOption,
                        ...(sortOption === 'name-desc' ? styles.panelOptionActive : {}),
                      }}
                    >
                      Name Z → A
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div style={styles.productGrid}>
            {currentProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.05} />
            ))}
            {currentProducts.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>No items found</p>
                <p style={styles.emptyText}>Try a different search, filter, or sort option.</p>
              </div>
            )}
          </div>

          {/* Pagination Dots */}
          <div style={styles.pagination}>
            <button
              type="button"
              className="pagination-button"
              style={styles.pageArrow}
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
            >
              ‹
            </button>
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={`dot-${idx}`}
                type="button"
                onClick={() => setPageIndex(idx)}
                className={idx === pageIndex ? 'page-dot page-dot-active' : 'page-dot'}
                style={{
                  ...styles.pageDot,
                  ...(idx === pageIndex ? styles.pageDotActive : {}),
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
            <button
              type="button"
              className="pagination-button"
              style={styles.pageArrow}
              onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
              disabled={pageIndex === pageCount - 1}
            >
              ›
            </button>
          </div>

          {/* Category Sliders */}
          <div style={styles.slidersWrap}>
            <div style={styles.slidersDivider}>
              <span style={styles.slidersDividerText}>
                {side === 'cafe' ? 'COFFEE, SHAKES & BITES' : 'HEARTY MEALS & TIMELESS FLAVORS'}
              </span>
            </div>
            {otherCategories.map(([key, cat]) => (
              <CategorySlider
                key={key}
                side={side}
                categoryKey={key}
                categoryData={cat}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
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

  /* --- Layout --- */
  container: {
    display: 'flex',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
  },

  /* --- Sidebar --- */
  sidebar: {
    width: '260px',
    background: '#fff',
    borderRight: '1px solid #f0e6dc',
    padding: '24px 16px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarGroup: {
    marginBottom: '24px',
  },
  sidebarGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    padding: '0 8px',
  },
  sidebarGroupIcon: {
    fontSize: '1.3rem',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    background: '#f5f0e8',
  },
  sidebarGroupTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2c1810',
    margin: '0 0 2px 0',
  },
  sidebarGroupSub: {
    fontSize: '0.7rem',
    color: '#8a8279',
    margin: 0,
  },
  sidebarList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sidebarItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#3d3d3d',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  sidebarItemActive: {
    background: '#2c1810',
    color: '#fff',
  },
  sidebarItemName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sidebarItemCount: {
    fontSize: '0.75rem',
    fontWeight: 600,
    opacity: 0.6,
  },
  backBtn: {
    display: 'block',
    marginTop: '20px',
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#f5f0e8',
    color: '#2c1810',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'center',
    transition: 'background 0.2s ease',
  },

  /* --- Main Content --- */
  mainContent: {
    flex: 1,
    padding: '24px 32px 60px',
    minWidth: 0,
  },

  /* --- Breadcrumb --- */
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontSize: '0.8rem',
    color: '#8a8279',
  },
  breadcrumbLink: {
    color: '#8a8279',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  breadcrumbSep: {
    color: '#d4cdc3',
  },
  breadcrumbCurrent: {
    color: '#2c1810',
    fontWeight: 500,
  },

  /* --- Category Header --- */
  catHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  catHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  catHeaderIcon: {
    fontSize: '2rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
    background: '#f5f0e8',
  },
  catHeaderTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
    fontWeight: 700,
    color: '#2c1810',
    margin: '0 0 4px 0',
  },
  catHeaderDesc: {
    fontSize: '0.85rem',
    color: '#8a8279',
    margin: 0,
  },

  /* --- Toolbar --- */
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    border: '1px solid #eeeae4',
    borderRadius: '10px',
    padding: '8px 14px',
    minWidth: '220px',
  },
  searchIcon: {
    fontSize: '0.85rem',
    color: '#8a8279',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.85rem',
    fontFamily: "'Inter', system-ui, sans-serif",
    color: '#2c1810',
    width: '100%',
    background: 'transparent',
  },
  toolbarBtn: {
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #eeeae4',
    background: '#fff',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#3d3d3d',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '130px',
  },
  toolbarBadge: {
    marginLeft: 'auto',
    padding: '3px 8px',
    borderRadius: '999px',
    background: '#f5f0e8',
    color: '#2c1810',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  panelDropdown: {
    position: 'absolute',
    top: '44px',
    right: 0,
    width: '200px',
    background: '#fff',
    border: '1px solid #eeeae4',
    borderRadius: '16px',
    boxShadow: '0 18px 48px rgba(44, 24, 16, 0.14)',
    padding: '10px 0',
    zIndex: 20,
  },
  panelOption: {
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    padding: '12px 18px',
    color: '#3d3d3d',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'background 0.2s ease, color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelOptionActive: {
    color: '#2c1810',
    fontWeight: 700,
    background: '#f5f0e8',
  },

  /* --- Product Grid --- */
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },

  /* --- Product Card --- */
  productCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '12px',
    border: '1px solid #f0e6dc',
    transition: 'box-shadow 0.3s ease',
  },
  productImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '14px',
    display: 'block',
    marginBottom: '12px',
  },
  productInfo: {
    padding: '0 4px',
  },
  productName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#2c1810',
    margin: '0 0 6px 0',
    lineHeight: 1.3,
  },
  productDesc: {
    fontSize: '0.78rem',
    color: '#8a8279',
    margin: '0 0 12px 0',
    lineHeight: 1.4,
    minHeight: '32px',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1a4d3a',
  },
  addBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'background 0.2s ease',
  },

  /* --- Pagination --- */
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '50px',
  },
  pageArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #eeeae4',
    background: '#fff',
    color: '#8a8279',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#d4cdc3',
    display: 'inline-block',
    transition: 'transform 0.2s ease, background 0.2s ease',
  },
  pageDotActive: {
    background: '#2c1810',
    width: '8px',
    height: '8px',
    transform: 'scale(1.3)',
  },
  emptyState: {
    gridColumn: '1 / -1',
    padding: '60px 24px',
    borderRadius: '20px',
    border: '1px dashed #e5dfd7',
    background: '#fff',
    textAlign: 'center',
    color: '#6f645b',
  },
  emptyTitle: {
    margin: '0 0 8px',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2c1810',
  },
  emptyText: {
    margin: 0,
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },

  /* --- Sliders --- */
  slidersWrap: {
    marginTop: '20px',
  },
  slidersDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '30px',
  },
  slidersDividerText: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#b0a99f',
    whiteSpace: 'nowrap',
  },
  sliderSection: {
    marginBottom: '32px',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  sliderHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sliderIcon: {
    fontSize: '1.4rem',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    background: '#f5f0e8',
  },
  sliderTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#2c1810',
    margin: '0 0 2px 0',
  },
  sliderDesc: {
    fontSize: '0.75rem',
    color: '#8a8279',
    margin: 0,
  },
  viewAllBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #eeeae4',
    background: '#fff',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#3d3d3d',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  sliderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '14px',
  },
  sliderCard: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #f0e6dc',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  sliderCardImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block',
  },
  sliderCardName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#2c1810',
    margin: '10px 10px 4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sliderCardPrice: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#1a4d3a',
    margin: '0 10px 10px',
  },
};