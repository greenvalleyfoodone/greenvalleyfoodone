CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $fn$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $fn$;

-- categories
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  side text NOT NULL CHECK (side IN ('cafe','restaurant')),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (side, slug)
);
GRANT SELECT ON public.menu_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.menu_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories admin write" ON public.menu_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_menu_categories_updated BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- menu items extra fields
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS side text NOT NULL DEFAULT 'restaurant',
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;
GRANT SELECT ON public.menu_items TO anon;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='menu_items' AND policyname='menu public read') THEN
    CREATE POLICY "menu public read" ON public.menu_items FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='menu_items' AND policyname='menu admin write') THEN
    CREATE POLICY "menu admin write" ON public.menu_items FOR ALL TO authenticated
      USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
END $$;

-- reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('GVR-' || upper(substr(md5(random()::text),1,6))),
  customer_name text NOT NULL,
  phone text NOT NULL,
  guests int NOT NULL CHECK (guests > 0 AND guests <= 100),
  reserve_date date NOT NULL,
  reserve_time time NOT NULL,
  occasion text,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','completed')),
  admin_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reservations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request a table" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "staff read reservations" ON public.reservations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin update reservations" ON public.reservations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete reservations" ON public.reservations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.reservation_status(p_reference text)
RETURNS TABLE (reference text, status text, admin_message text, reserve_date date, reserve_time time, guests int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.reference, r.status, r.admin_message, r.reserve_date, r.reserve_time, r.guests
  FROM public.reservations r WHERE r.reference = upper(p_reference);
$$;
GRANT EXECUTE ON FUNCTION public.reservation_status(text) TO anon, authenticated;

-- editable site images
CREATE TABLE public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site images public read" ON public.site_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site images admin write" ON public.site_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_site_images_updated BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- real menu from the printed menu cards
DELETE FROM public.menu_items;

INSERT INTO public.menu_categories (side, slug, name, description, sort_order) VALUES
 ('cafe','coffee','Coffee','Freshly brewed classics',1),
 ('cafe','premium-coffee','Premium Coffee','100% pure black coffee from beans',2),
 ('cafe','cold-coffee','Cold Coffee','Chilled coffee blends',3),
 ('cafe','tea','Tea','Warm and aromatic',4),
 ('cafe','milk','Milk','Wholesome milk drinks',5),
 ('cafe','mojitos','Mojitos','Refreshing coolers',6),
 ('cafe','milkshakes','Milkshakes','Thick and creamy',7),
 ('cafe','snacks-veg','Snacks Veg','Quick veg bites',8),
 ('cafe','snacks-veg-premium','Snacks Veg Premium','Premium veg starters',9),
 ('cafe','snacks-non-veg','Snacks Non Veg','Chicken and egg bites',10),
 ('restaurant','idli','Idli','Soft steamed idli',1),
 ('restaurant','vada','Vada','Crispy medu vada',2),
 ('restaurant','dosa','Dosa','Golden crisp dosas',3),
 ('restaurant','poori','Poori','Fluffy poori',4),
 ('restaurant','pongal','Pongal','Comforting pongal',5);

INSERT INTO public.menu_items (name, category, price, side, sort_order, is_available) VALUES
 ('Regular Coffee','coffee',30,'cafe',1,true),
 ('Filter Coffee','coffee',40,'cafe',2,true),
 ('Black Coffee','coffee',30,'cafe',3,true),
 ('Tati Bellam Coffee','coffee',30,'cafe',4,true),
 ('Premium Coffee','premium-coffee',50,'cafe',1,true),
 ('Premium Coffee (Small)','premium-coffee',50,'cafe',2,true),
 ('Premium Coffee (Large)','premium-coffee',80,'cafe',3,true),
 ('Hazelnut Coffee','premium-coffee',60,'cafe',4,true),
 ('Vanilla Coffee','premium-coffee',60,'cafe',5,true),
 ('Chocolate Coffee','premium-coffee',60,'cafe',6,true),
 ('Caramel Coffee','premium-coffee',60,'cafe',7,true),
 ('Premium Cold Coffee','cold-coffee',70,'cafe',1,true),
 ('Vanilla Cold Coffee','cold-coffee',90,'cafe',2,true),
 ('Hazelnut Cold Coffee','cold-coffee',90,'cafe',3,true),
 ('Chocolate Cold Coffee','cold-coffee',90,'cafe',4,true),
 ('Caramel Cold Coffee','cold-coffee',90,'cafe',5,true),
 ('Regular Tea','tea',25,'cafe',1,true),
 ('Special Tea','tea',35,'cafe',2,true),
 ('Honey Lemon Tea','tea',35,'cafe',3,true),
 ('Allam Tea','tea',35,'cafe',4,true),
 ('Allam Bellam Tea','tea',35,'cafe',5,true),
 ('Masala Tea','tea',35,'cafe',6,true),
 ('Elachi Tea','tea',35,'cafe',7,true),
 ('Badam Tea','tea',35,'cafe',8,true),
 ('Pista Tea','tea',35,'cafe',9,true),
 ('Premium Milk','milk',30,'cafe',1,true),
 ('Chocolate Milk','milk',40,'cafe',2,true),
 ('Badam Milk','milk',40,'cafe',3,true),
 ('Boost','milk',40,'cafe',4,true),
 ('Horlicks','milk',40,'cafe',5,true),
 ('Virgin Mojito','mojitos',80,'cafe',1,true),
 ('Blue Curacao','mojitos',80,'cafe',2,true),
 ('Strawberry','mojitos',80,'cafe',3,true),
 ('Berry Blast','mojitos',80,'cafe',4,true),
 ('Green Apple','mojitos',80,'cafe',5,true),
 ('Orange','mojitos',80,'cafe',6,true),
 ('Vanilla Milkshake','milkshakes',80,'cafe',1,true),
 ('Strawberry Milkshake','milkshakes',90,'cafe',2,true),
 ('Mango Milkshake','milkshakes',90,'cafe',3,true),
 ('Orange Milkshake','milkshakes',90,'cafe',4,true),
 ('Chocolate Milkshake','milkshakes',90,'cafe',5,true),
 ('Black Current Milkshake','milkshakes',90,'cafe',6,true),
 ('Pista Milkshake','milkshakes',90,'cafe',7,true),
 ('Oreo Milkshake','milkshakes',90,'cafe',8,true),
 ('Rose Milk','milkshakes',80,'cafe',9,true),
 ('Butterscotch Milkshake','milkshakes',80,'cafe',10,true),
 ('Kit-Kat Milkshake','milkshakes',90,'cafe',11,true),
 ('Brownie Milkshake','milkshakes',90,'cafe',12,true),
 ('Nutella Milkshake','milkshakes',90,'cafe',13,true),
 ('Osmania Biscuits (2pcs)','snacks-veg',12,'cafe',1,true),
 ('Karachi Biscuits (1pc)','snacks-veg',10,'cafe',2,true),
 ('Veg Puff','snacks-veg',30,'cafe',3,true),
 ('Onion Samosa (4pcs)','snacks-veg',30,'cafe',4,true),
 ('Alu Samosa (1pc)','snacks-veg',20,'cafe',5,true),
 ('Corn Samosa (4pcs)','snacks-veg',40,'cafe',6,true),
 ('French Fries','snacks-veg-premium',80,'cafe',1,true),
 ('Veg Nuggets (6pcs)','snacks-veg-premium',90,'cafe',2,true),
 ('Veg Fingers (6pcs)','snacks-veg-premium',90,'cafe',3,true),
 ('Veg Momos (6pcs)','snacks-veg-premium',90,'cafe',4,true),
 ('Veg Lollipops (6pcs)','snacks-veg-premium',90,'cafe',5,true),
 ('Veg Spring Rolls (6pcs)','snacks-veg-premium',90,'cafe',6,true),
 ('Veg Sandwich (2pcs) + French Fries','snacks-veg-premium',100,'cafe',7,true),
 ('Veg Burger + French Fries','snacks-veg-premium',110,'cafe',8,true),
 ('Egg Puff','snacks-non-veg',30,'cafe',1,true),
 ('Chicken Puff','snacks-non-veg',40,'cafe',2,true),
 ('Chicken Momos (6pcs)','snacks-non-veg',100,'cafe',3,true),
 ('Chicken Nuggets (6pcs)','snacks-non-veg',100,'cafe',4,true),
 ('Chicken Popcorn (15pcs)','snacks-non-veg',120,'cafe',5,true),
 ('Chicken Wings (2pcs)','snacks-non-veg',120,'cafe',6,true),
 ('Chicken Rolls (6pcs)','snacks-non-veg',120,'cafe',7,true),
 ('Chicken Spring Rolls (6pcs)','snacks-non-veg',120,'cafe',8,true),
 ('Chicken Sandwich','snacks-non-veg',100,'cafe',9,true),
 ('Chicken Burger','snacks-non-veg',120,'cafe',10,true),
 ('Idli Chutney','idli',30,'restaurant',1,true),
 ('Idli Sambar','idli',40,'restaurant',2,true),
 ('Idli Ghee Karam','idli',50,'restaurant',3,true),
 ('Raagi Idli','idli',40,'restaurant',4,true),
 ('Raagi Idli Sambar','idli',50,'restaurant',5,true),
 ('Raagi Idli Ghee Karam','idli',50,'restaurant',6,true),
 ('Vada Chutney (4pc)','vada',40,'restaurant',1,true),
 ('Vada Sambar (4pc)','vada',50,'restaurant',2,true),
 ('Idli + Vada Chutney (2+2 Pc)','vada',40,'restaurant',3,true),
 ('Idli + Vada Sambar (2+2 Pc)','vada',50,'restaurant',4,true),
 ('Plain Dosa','dosa',40,'restaurant',1,true),
 ('Onion Dosa','dosa',50,'restaurant',2,true),
 ('Masala Dosa','dosa',60,'restaurant',3,true),
 ('Ghee Karam Dosa','dosa',50,'restaurant',4,true),
 ('Plain Dosa Pesara','dosa',40,'restaurant',5,true),
 ('Onion Dosa Pesara','dosa',50,'restaurant',6,true),
 ('Upma Pesara','dosa',60,'restaurant',7,true),
 ('Poori','poori',60,'restaurant',1,true),
 ('Mysore Bonda','poori',40,'restaurant',2,true),
 ('Pongal','pongal',50,'restaurant',1,true),
 ('Ghee Pongal','pongal',60,'restaurant',2,true);