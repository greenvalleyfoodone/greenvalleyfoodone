-- ============ ROLES / PROFILES ============
CREATE TYPE public.app_role AS ENUM ('admin','cashier');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- new user -> profile + role (first user becomes admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count int;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  SELECT count(*) INTO v_count FROM public.user_roles;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN v_count = 0 THEN 'admin'::public.app_role ELSE 'cashier'::public.app_role END)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SETTINGS ============
CREATE TABLE public.app_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  restaurant_name text NOT NULL DEFAULT 'GREEN VALLEY FOOD ONE',
  address text NOT NULL DEFAULT 'Santhamaguluru, Andhra Pradesh',
  phone text NOT NULL DEFAULT '',
  gstin text NOT NULL DEFAULT '',
  tax_percent numeric(5,2) NOT NULL DEFAULT 5.00 CHECK (tax_percent >= 0 AND tax_percent <= 100),
  tax_label text NOT NULL DEFAULT 'GST',
  max_cashier_discount_percent numeric(5,2) NOT NULL DEFAULT 10.00,
  receipt_footer text NOT NULL DEFAULT 'Thank you! Visit Again',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read settings" ON public.app_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin update settings" ON public.app_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
GRANT UPDATE ON public.app_settings TO authenticated;
INSERT INTO public.app_settings (id) VALUES (true);

-- ============ MENU ============
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  section text NOT NULL DEFAULT 'restaurant',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text,
  description text,
  is_available boolean NOT NULL DEFAULT true,
  tax_percent numeric(5,2),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX menu_items_category_idx ON public.menu_items (category);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read menu" ON public.menu_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin manage menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ TABLES ============
CREATE TYPE public.table_status AS ENUM ('available','occupied','reserved');
CREATE TABLE public.restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  seats int NOT NULL DEFAULT 4,
  status public.table_status NOT NULL DEFAULT 'available',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurant_tables TO authenticated;
GRANT ALL ON public.restaurant_tables TO service_role;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read tables" ON public.restaurant_tables FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff update tables" ON public.restaurant_tables FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "admin manage tables" ON public.restaurant_tables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.restaurant_tables (label, seats, sort_order)
SELECT 'Table ' || g, 4, g FROM generate_series(1,12) g;

-- ============ ORDERS ============
CREATE TYPE public.order_status AS ENUM ('pending','preparing','ready','served','completed','cancelled');
CREATE TYPE public.order_type AS ENUM ('dine_in','takeaway');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type public.order_type NOT NULL DEFAULT 'dine_in',
  table_id uuid REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  table_label text,
  status public.order_status NOT NULL DEFAULT 'pending',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount_type text NOT NULL DEFAULT 'none' CHECK (discount_type IN ('none','fixed','percent')),
  discount_value numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read orders" ON public.orders FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity int NOT NULL CHECK (quantity > 0),
  line_total numeric(12,2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_idx ON public.order_items (order_id);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read order items" ON public.order_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- ============ BILLS / PAYMENTS ============
CREATE SEQUENCE public.bill_number_seq START 1;
CREATE TABLE public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number text NOT NULL UNIQUE,
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  table_label text,
  order_type public.order_type NOT NULL DEFAULT 'dine_in',
  subtotal numeric(12,2) NOT NULL,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','upi','card','other')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  paid_amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_timestamp timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled')),
  cancelled_reason text,
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bills_created_at_idx ON public.bills (created_at DESC);
GRANT SELECT ON public.bills TO authenticated;
GRANT ALL ON public.bills TO service_role;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read bills" ON public.bills FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('cash','upi','card','other')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  paid_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- ============ TRUSTED BILL CREATION ============
CREATE OR REPLACE FUNCTION public.pos_create_bill(
  p_items jsonb,
  p_order_type text DEFAULT 'dine_in',
  p_table_id uuid DEFAULT NULL,
  p_discount_type text DEFAULT 'none',
  p_discount_value numeric DEFAULT 0,
  p_payment_method text DEFAULT 'cash',
  p_payment_status text DEFAULT 'pending',
  p_paid_amount numeric DEFAULT 0,
  p_notes text DEFAULT NULL,
  p_order_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_is_admin boolean;
  v_settings public.app_settings%ROWTYPE;
  v_order_id uuid;
  v_table_label text;
  v_subtotal numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_taxable numeric(12,2);
  v_tax numeric(12,2) := 0;
  v_total numeric(12,2);
  v_bill_number text;
  v_bill_id uuid;
  v_item jsonb;
  v_menu public.menu_items%ROWTYPE;
  v_qty int;
  v_active_order uuid;
  v_max_pct numeric;
BEGIN
  IF v_uid IS NULL OR NOT public.is_staff(v_uid) THEN
    RAISE EXCEPTION 'Not authorised to create bills';
  END IF;
  v_is_admin := public.has_role(v_uid,'admin');
  SELECT * INTO v_settings FROM public.app_settings WHERE id;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order is empty';
  END IF;
  IF p_order_type NOT IN ('dine_in','takeaway') THEN
    RAISE EXCEPTION 'Invalid order type';
  END IF;
  IF p_payment_method NOT IN ('cash','upi','card','other') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  IF p_order_type = 'dine_in' THEN
    IF p_table_id IS NULL THEN RAISE EXCEPTION 'Select a table'; END IF;
    SELECT label INTO v_table_label FROM public.restaurant_tables WHERE id = p_table_id;
    IF v_table_label IS NULL THEN RAISE EXCEPTION 'Table not found'; END IF;
    SELECT id INTO v_active_order FROM public.orders
      WHERE table_id = p_table_id AND status NOT IN ('completed','cancelled')
      AND (p_order_id IS NULL OR id <> p_order_id) LIMIT 1;
    IF v_active_order IS NOT NULL THEN
      RAISE EXCEPTION 'This table already has an active order';
    END IF;
  END IF;

  IF p_order_id IS NOT NULL THEN
    SELECT id INTO v_order_id FROM public.orders WHERE id = p_order_id AND status NOT IN ('completed','cancelled');
    IF v_order_id IS NULL THEN RAISE EXCEPTION 'Order already billed or cancelled'; END IF;
    DELETE FROM public.order_items WHERE order_id = v_order_id;
    UPDATE public.orders SET order_type = p_order_type::public.order_type, table_id = p_table_id,
      table_label = v_table_label, notes = p_notes, updated_at = now() WHERE id = v_order_id;
  ELSE
    INSERT INTO public.orders (order_type, table_id, table_label, status, notes, created_by)
    VALUES (p_order_type::public.order_type, p_table_id, v_table_label, 'pending', p_notes, v_uid)
    RETURNING id INTO v_order_id;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    IF v_qty < 1 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    SELECT * INTO v_menu FROM public.menu_items WHERE id = (v_item->>'menu_item_id')::uuid;
    IF v_menu.id IS NULL THEN RAISE EXCEPTION 'Menu item no longer exists'; END IF;
    IF NOT v_menu.is_available THEN RAISE EXCEPTION 'Item unavailable: %', v_menu.name; END IF;
    INSERT INTO public.order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
    VALUES (v_order_id, v_menu.id, v_menu.name, v_menu.price, v_qty, ROUND(v_menu.price * v_qty, 2));
    v_subtotal := v_subtotal + ROUND(v_menu.price * v_qty, 2);
  END LOOP;

  IF p_discount_type = 'percent' THEN
    v_discount := ROUND(v_subtotal * LEAST(GREATEST(COALESCE(p_discount_value,0),0),100) / 100, 2);
  ELSIF p_discount_type = 'fixed' THEN
    v_discount := ROUND(GREATEST(COALESCE(p_discount_value,0),0), 2);
  END IF;
  v_discount := LEAST(v_discount, v_subtotal);

  IF NOT v_is_admin AND v_subtotal > 0 THEN
    v_max_pct := COALESCE(v_settings.max_cashier_discount_percent, 0);
    IF (v_discount / v_subtotal) * 100 > v_max_pct + 0.001 THEN
      RAISE EXCEPTION 'Discount above the % percent limit needs an admin', v_max_pct;
    END IF;
  END IF;

  v_taxable := v_subtotal - v_discount;
  v_tax := ROUND(v_taxable * COALESCE(v_settings.tax_percent,0) / 100, 2);
  v_total := GREATEST(ROUND(v_taxable + v_tax, 2), 0);

  UPDATE public.orders SET subtotal = v_subtotal, discount_type = p_discount_type,
    discount_value = COALESCE(p_discount_value,0), discount_amount = v_discount,
    tax_percent = COALESCE(v_settings.tax_percent,0), tax_amount = v_tax, total = v_total,
    status = 'completed', updated_at = now()
  WHERE id = v_order_id;

  v_bill_number := 'GV-' || lpad(nextval('public.bill_number_seq')::text, 6, '0');

  INSERT INTO public.bills (bill_number, order_id, table_label, order_type, subtotal, discount_amount,
    tax_percent, tax_amount, total, payment_method, payment_status, paid_amount, payment_timestamp, created_by)
  VALUES (v_bill_number, v_order_id, v_table_label, p_order_type::public.order_type, v_subtotal, v_discount,
    COALESCE(v_settings.tax_percent,0), v_tax, v_total, p_payment_method,
    CASE WHEN p_payment_status = 'paid' THEN 'paid' ELSE 'pending' END,
    CASE WHEN p_payment_status = 'paid' THEN COALESCE(NULLIF(p_paid_amount,0), v_total) ELSE 0 END,
    CASE WHEN p_payment_status = 'paid' THEN now() ELSE NULL END, v_uid)
  RETURNING id INTO v_bill_id;

  INSERT INTO public.payments (bill_id, method, amount, status, paid_at, created_by)
  VALUES (v_bill_id, p_payment_method,
    CASE WHEN p_payment_status = 'paid' THEN COALESCE(NULLIF(p_paid_amount,0), v_total) ELSE 0 END,
    CASE WHEN p_payment_status = 'paid' THEN 'paid' ELSE 'pending' END,
    CASE WHEN p_payment_status = 'paid' THEN now() ELSE NULL END, v_uid);

  IF p_table_id IS NOT NULL THEN
    UPDATE public.restaurant_tables SET status = 'available' WHERE id = p_table_id;
  END IF;

  RETURN jsonb_build_object('bill_id', v_bill_id, 'bill_number', v_bill_number, 'order_id', v_order_id, 'total', v_total);
END; $$;

REVOKE ALL ON FUNCTION public.pos_create_bill(jsonb,text,uuid,text,numeric,text,text,numeric,text,uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.pos_create_bill(jsonb,text,uuid,text,numeric,text,text,numeric,text,uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.pos_set_payment_status(p_bill_id uuid, p_status text, p_paid_amount numeric DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total numeric;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Not authorised'; END IF;
  IF p_status NOT IN ('pending','paid','failed','refunded') THEN RAISE EXCEPTION 'Invalid payment status'; END IF;
  SELECT total INTO v_total FROM public.bills WHERE id = p_bill_id;
  IF v_total IS NULL THEN RAISE EXCEPTION 'Bill not found'; END IF;
  UPDATE public.bills SET payment_status = p_status,
    paid_amount = CASE WHEN p_status = 'paid' THEN COALESCE(NULLIF(p_paid_amount,0), v_total) ELSE 0 END,
    payment_timestamp = CASE WHEN p_status = 'paid' THEN now() ELSE NULL END
  WHERE id = p_bill_id;
  UPDATE public.payments SET status = p_status,
    amount = CASE WHEN p_status = 'paid' THEN COALESCE(NULLIF(p_paid_amount,0), v_total) ELSE 0 END,
    paid_at = CASE WHEN p_status = 'paid' THEN now() ELSE NULL END
  WHERE bill_id = p_bill_id;
END; $$;
REVOKE ALL ON FUNCTION public.pos_set_payment_status(uuid,text,numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.pos_set_payment_status(uuid,text,numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.pos_cancel_bill(p_bill_id uuid, p_reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_order uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'Only an admin can cancel a bill';
  END IF;
  SELECT order_id INTO v_order FROM public.bills WHERE id = p_bill_id AND status = 'active';
  IF v_order IS NULL THEN RAISE EXCEPTION 'Bill not found or already cancelled'; END IF;
  UPDATE public.bills SET status = 'cancelled', cancelled_reason = p_reason,
    cancelled_at = now(), cancelled_by = auth.uid() WHERE id = p_bill_id;
  UPDATE public.orders SET status = 'cancelled', updated_at = now() WHERE id = v_order;
END; $$;
REVOKE ALL ON FUNCTION public.pos_cancel_bill(uuid,text) FROM public;
GRANT EXECUTE ON FUNCTION public.pos_cancel_bill(uuid,text) TO authenticated;

-- ============ MENU SEED ============
INSERT INTO public.menu_items (name, category, section, price, image_url) VALUES
('Cappuccino','Coffee','cafe',220,'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop'),('Latte','Coffee','cafe',200,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop'),('Americano','Coffee','cafe',180,'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&auto=format&fit=crop'),('Mocha','Coffee','cafe',240,'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop'),('Espresso','Coffee','cafe',150,'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop'),('Flat White','Coffee','cafe',210,'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop'),('Caramel Macchiato','Coffee','cafe',240,'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&auto=format&fit=crop'),('Hazelnut Coffee','Coffee','cafe',230,'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop'),('Masala Chai','Tea','cafe',120,'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&auto=format&fit=crop'),('Green Tea','Tea','cafe',130,'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&auto=format&fit=crop'),('Lemon Tea','Tea','cafe',130,'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop'),('Ginger Tea','Tea','cafe',120,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop'),('Earl Grey','Tea','cafe',140,'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop'),('Cold Milk','Milk & More','cafe',80,'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop'),('Chocolate Milk','Milk & More','cafe',120,'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&auto=format&fit=crop'),('Badam Milk','Milk & More','cafe',130,'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&auto=format&fit=crop'),('Turmeric Milk','Milk & More','cafe',120,'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&auto=format&fit=crop'),('Oreo Milkshake','Milk & More','cafe',160,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop'),('Chocolate Shake','Shakes','cafe',180,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop'),('Strawberry Shake','Shakes','cafe',180,'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400&auto=format&fit=crop'),('Vanilla Shake','Shakes','cafe',170,'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop'),('Mango Shake','Shakes','cafe',180,'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&auto=format&fit=crop'),('Coffee Shake','Shakes','cafe',190,'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop'),('Veg Sandwich','Snacks','cafe',120,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop'),('French Fries','Snacks','cafe',130,'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&auto=format&fit=crop'),('Cheese Balls','Snacks','cafe',130,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&auto=format&fit=crop'),('Veg Puff','Snacks','cafe',110,'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop'),('Garlic Bread','Snacks','cafe',140,'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&auto=format&fit=crop'),('Chocolate Brownie','Desserts','cafe',150,'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop'),('Cheesecake','Desserts','cafe',160,'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=400&auto=format&fit=crop'),('Tiramisu','Desserts','cafe',170,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop'),('Chocolate Lava Cake','Desserts','cafe',180,'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&auto=format&fit=crop'),('Ice Cream (2 Scoops)','Desserts','cafe',120,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop'),('Affogato','Specials','cafe',220,'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format&fit=crop'),('Irish Coffee','Specials','cafe',240,'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop'),('Nitro Cold Brew','Specials','cafe',230,'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop'),('Cinnamon Coffee','Specials','cafe',220,'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&auto=format&fit=crop'),('Vienna Coffee','Specials','cafe',230,'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&auto=format&fit=crop'),('Pesarattu with Upma','Tiffins','restaurant',110,'https://images.unsplash.com/photo-1662116765994-54592e8772a5?w=400&auto=format&fit=crop'),('Idly Sambar','Tiffins','restaurant',60,'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop'),('Dosa (Plain)','Tiffins','restaurant',50,'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop'),('Dosa (Masala)','Tiffins','restaurant',70,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop'),('Puri Bhaji','Tiffins','restaurant',80,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop'),('Chicken 65','Starters','restaurant',180,'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop'),('Apollo Fish','Starters','restaurant',220,'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop'),('Chilli Chicken','Starters','restaurant',190,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop'),('Paneer Tikka','Starters','restaurant',160,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop'),('Andhra Chicken Biryani','Biryani','restaurant',280,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop'),('Mutton Biryani','Biryani','restaurant',350,'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&auto=format&fit=crop'),('Veg Biryani','Biryani','restaurant',200,'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop'),('Egg Biryani','Biryani','restaurant',180,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop'),('Full Andhra Meals (Veg)','Meals','restaurant',150,'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop'),('Full Andhra Meals (Non-Veg)','Meals','restaurant',220,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop'),('Mini Meals','Meals','restaurant',120,'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop'),('Gongura Mutton','Curries','restaurant',320,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop'),('Royyala Iguru','Curries','restaurant',300,'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop'),('Chicken Curry','Curries','restaurant',260,'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop'),('Natu Kodi Pulusu','Curries','restaurant',340,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop'),('Veg Fried Rice','Fried Rice & Noodles','restaurant',160,'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop'),('Chicken Fried Rice','Fried Rice & Noodles','restaurant',200,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop'),('Egg Fried Rice','Fried Rice & Noodles','restaurant',170,'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop'),('Hakka Noodles','Fried Rice & Noodles','restaurant',160,'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&auto=format&fit=crop');

ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;