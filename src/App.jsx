import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Cafe from "./pages/Cafe";
import Restaurant from "./pages/Restaurant";
import MenuPage from "./pages/Menu";          // Category grid landing (all, or filtered by side)
import CategoryDetail from "./pages/CategoryDetail"; // Product detail
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reservation from "./pages/Reservation";
import Services from "./pages/services";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cafe" element={<Cafe />} />
          <Route path="/restaurant" element={<Restaurant />} />

          {/* MENU SYSTEM — dynamic by side and category */}
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:side" element={<MenuPage />} />
          <Route path="/menu/:side/:categoryId" element={<CategoryDetail />} />

          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}