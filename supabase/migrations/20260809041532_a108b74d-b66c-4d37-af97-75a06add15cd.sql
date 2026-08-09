GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;

GRANT SELECT ON public.menu_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;

GRANT SELECT ON public.site_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;

CREATE OR REPLACE FUNCTION public.create_reservation(
  p_name text,
  p_phone text,
  p_guests integer,
  p_date date,
  p_time time,
  p_occasion text DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS TABLE (reference text, customer_name text, phone text, guests integer, reserve_date date, reserve_time time)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_ref text;
BEGIN
  IF coalesce(trim(p_name),'') = '' THEN RAISE EXCEPTION 'Please enter your name'; END IF;
  IF p_phone !~ '^[0-9+\-\s]{8,15}$' THEN RAISE EXCEPTION 'Please enter a valid mobile number'; END IF;
  IF p_guests IS NULL OR p_guests < 1 OR p_guests > 60 THEN RAISE EXCEPTION 'Guests must be between 1 and 60'; END IF;
  IF p_date < (now() AT TIME ZONE 'Asia/Kolkata')::date THEN RAISE EXCEPTION 'Please choose a future date'; END IF;

  INSERT INTO public.reservations (customer_name, phone, guests, reserve_date, reserve_time, occasion, notes)
  VALUES (trim(p_name), trim(p_phone), p_guests, p_date, p_time, nullif(trim(coalesce(p_occasion,'')),''), nullif(trim(coalesce(p_notes,'')),''))
  RETURNING public.reservations.reference INTO v_ref;

  RETURN QUERY
  SELECT r.reference, r.customer_name, r.phone, r.guests, r.reserve_date, r.reserve_time
  FROM public.reservations r WHERE r.reference = v_ref;
END; $$;

GRANT EXECUTE ON FUNCTION public.create_reservation(text, text, integer, date, time, text, text) TO anon, authenticated;