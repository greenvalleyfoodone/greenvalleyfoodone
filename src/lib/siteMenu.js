import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop";

/* Live, mutable menu tree shared by every page. Populated from the database. */
export const liveMenu = {
  cafe: {
    icon: "☕",
    title: "Café",
    subtitle: "Fresh brews & cozy bites",
    categories: {},
  },
  restaurant: {
    icon: "🍽️",
    title: "Restaurant",
    subtitle: "Hearty meals & timeless flavors",
    categories: {},
  },
};

let loaded = false;
let inflight = null;
const listeners = new Set();

export async function loadMenuTree(force = false) {
  if (inflight) return inflight;
  if (loaded && !force) return liveMenu;
  inflight = (async () => {
    const [{ data: cats }, { data: items }] = await Promise.all([
      supabase
        .from("menu_categories")
        .select("side, slug, name, description, image_url, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("menu_items")
        .select("id, name, category, price, side, description, image_url, sort_order, is_available")
        .eq("is_available", true)
        .order("sort_order"),
    ]);

    liveMenu.cafe.categories = {};
    liveMenu.restaurant.categories = {};

    (cats ?? []).forEach((c) => {
      const bucket = liveMenu[c.side];
      if (!bucket) return;
      bucket.categories[c.slug] = {
        name: c.name,
        description: c.description ?? "",
        image: c.image_url || FALLBACK_IMAGE,
        products: [],
      };
    });

    (items ?? []).forEach((it) => {
      const bucket = liveMenu[it.side];
      if (!bucket) return;
      const cat = bucket.categories[it.category];
      if (!cat) return;
      cat.products.push({
        id: it.id,
        name: it.name,
        desc: it.description ?? "",
        price: Number(it.price),
        image: it.image_url || cat.image || FALLBACK_IMAGE,
      });
    });

    loaded = true;
    inflight = null;
    listeners.forEach((fn) => fn());
    return liveMenu;
  })();
  return inflight;
}

/** Subscribe a component to the live menu. Returns { ready, menu }. */
export function useMenuTree() {
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(loaded);

  useEffect(() => {
    const bump = () => {
      setReady(true);
      setTick((t) => t + 1);
    };
    listeners.add(bump);
    loadMenuTree().then(bump);
    return () => listeners.delete(bump);
  }, []);

  return { ready, menu: liveMenu };
}

/** Category list (array shape) for a side. */
export function categoryList(side) {
  return Object.entries(liveMenu[side]?.categories ?? {}).map(([id, cat]) => ({
    id,
    name: cat.name,
    itemCount: cat.products.length,
    image: cat.image,
  }));
}
