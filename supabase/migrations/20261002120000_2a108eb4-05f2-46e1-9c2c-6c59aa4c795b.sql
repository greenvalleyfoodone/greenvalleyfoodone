CREATE TABLE IF NOT EXISTS public.daily_item_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date date NOT NULL,
  menu_item_id uuid NOT NULL,
  item_name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  quantity_sold integer NOT NULL DEFAULT 0,
  sales_total numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_item_sales_date_item_key UNIQUE (sale_date, menu_item_id)
);

GRANT SELECT ON public.daily_item_sales TO authenticated;
GRANT ALL ON public.daily_item_sales TO service_role;
ALTER TABLE public.daily_item_sales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff read daily item sales" ON public.daily_item_sales;
CREATE POLICY "staff read daily item sales" ON public.daily_item_sales
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS trg_daily_item_sales_updated ON public.daily_item_sales;
CREATE TRIGGER trg_daily_item_sales_updated
  BEFORE UPDATE ON public.daily_item_sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.pos_refresh_item_sales_for_date(p_date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_date::text));

  DELETE FROM public.daily_item_sales
  WHERE sale_date = p_date;

  INSERT INTO public.daily_item_sales (
    sale_date, menu_item_id, item_name, category, quantity_sold, sales_total
  )
  SELECT
    p_date,
    oi.menu_item_id,
    MAX(oi.item_name),
    COALESCE(MAX(mi.category), 'Other'),
    SUM(oi.quantity)::integer,
    ROUND(SUM(oi.line_total), 2)
  FROM public.bills AS b
  JOIN public.order_items AS oi ON oi.order_id = b.order_id
  LEFT JOIN public.menu_items AS mi ON mi.id = oi.menu_item_id
  WHERE b.status = 'active'
    AND (b.created_at AT TIME ZONE 'Asia/Kolkata')::date = p_date
    AND oi.menu_item_id IS NOT NULL
  GROUP BY oi.menu_item_id;
END;
$$;

REVOKE ALL ON FUNCTION public.pos_refresh_item_sales_for_date(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.pos_refresh_item_sales_for_date(date) TO service_role;

CREATE OR REPLACE FUNCTION public.pos_sync_bill_item_sales()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_date date := (NEW.created_at AT TIME ZONE 'Asia/Kolkata')::date;
  v_old_date date;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    v_old_date := (OLD.created_at AT TIME ZONE 'Asia/Kolkata')::date;
    IF v_old_date <> v_new_date THEN
      PERFORM public.pos_refresh_item_sales_for_date(v_old_date);
    END IF;
  END IF;

  PERFORM public.pos_refresh_item_sales_for_date(v_new_date);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.pos_sync_bill_item_sales() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS pos_bill_item_sales_sync ON public.bills;
CREATE TRIGGER pos_bill_item_sales_sync
  AFTER INSERT OR UPDATE OF status ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.pos_sync_bill_item_sales();

CREATE OR REPLACE FUNCTION public.pos_rollup_daily_item_sales()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date date;
BEGIN
  FOR v_date IN
    SELECT DISTINCT (created_at AT TIME ZONE 'Asia/Kolkata')::date
    FROM public.bills
  LOOP
    PERFORM public.pos_refresh_item_sales_for_date(v_date);
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.pos_rollup_daily_item_sales() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.pos_rollup_daily_item_sales() TO service_role;

SELECT public.pos_rollup_daily_item_sales();