import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  section: string;
  price: number;
  image_url: string | null;
  description: string | null;
  is_available: boolean;
  tax_percent: number | null;
};

export type RestaurantTable = {
  id: string;
  label: string;
  seats: number;
  status: "available" | "occupied" | "reserved";
  sort_order: number;
};

export type ReceiptLine = { label: string; value: string };

export type AppSettings = {
  restaurant_name: string;
  address: string;
  phone: string;
  gstin: string;
  tax_percent: number;
  tax_label: string;
  max_cashier_discount_percent: number;
  receipt_footer: string;
  receipt_copies: number;
  receipt_paper_mm: number;
  receipt_extra_lines: ReceiptLine[];
  receipt_font_px: number;
  receipt_name_font_px: number;
};


export type CartLine = {
  menu_item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
};

export type BillRow = {
  id: string;
  bill_number: string;
  order_id: string;
  table_label: string | null;
  order_type: "dine_in" | "takeaway";
  subtotal: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  paid_amount: number;
  payment_timestamp: string | null;
  status: string;
  created_at: string;
};

export type ReceiptData = {
  bill: BillRow;
  items: { item_name: string; unit_price: number; quantity: number; line_total: number }[];
  settings: AppSettings;
};

/** Decimal-safe money helpers — all maths runs on integer paise. */
export const toPaise = (value: number) => Math.round(Number(value || 0) * 100);
export const fromPaise = (paise: number) => paise / 100;
export const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function computeTotals(
  lines: CartLine[],
  discountType: "none" | "fixed" | "percent",
  discountValue: number,
  taxPercent: number,
) {
  const subtotalP = lines.reduce(
    (sum, l) => sum + toPaise(l.unit_price) * Math.max(1, Math.trunc(l.quantity)),
    0,
  );
  let discountP = 0;
  if (discountType === "percent") {
    const pct = Math.min(Math.max(Number(discountValue) || 0, 0), 100);
    discountP = Math.round((subtotalP * pct) / 100);
  } else if (discountType === "fixed") {
    discountP = toPaise(Math.max(Number(discountValue) || 0, 0));
  }
  discountP = Math.min(discountP, subtotalP);
  const taxableP = subtotalP - discountP;
  const taxP = Math.round((taxableP * (Number(taxPercent) || 0)) / 100);
  const totalP = Math.max(taxableP + taxP, 0);
  return {
    subtotal: fromPaise(subtotalP),
    discount: fromPaise(discountP),
    tax: fromPaise(taxP),
    total: fromPaise(totalP),
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  restaurant_name: "GREEN VALLEY FOOD ONE",
  address: "Santhamaguluru, Andhra Pradesh",
  phone: "",
  gstin: "",
  tax_percent: 5,
  tax_label: "GST",
  max_cashier_discount_percent: 10,
  receipt_footer: "Thank you! Visit Again",
  receipt_copies: 1,
  receipt_paper_mm: 80,
  receipt_extra_lines: [],
  receipt_font_px: 12,
  receipt_name_font_px: 18,
};


function unwrap<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  if (res.data === null) throw new Error(`${what}: no data returned`);
  return res.data;
}

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await supabase
    .from("menu_items")
    .select("id,name,category,section,price,image_url,description,is_available,tax_percent")
    .order("category")
    .order("name");
  return unwrap(res, "Could not load the menu") as unknown as MenuItem[];
}

export async function fetchTables(): Promise<RestaurantTable[]> {
  const res = await supabase
    .from("restaurant_tables")
    .select("id,label,seats,status,sort_order")
    .order("sort_order");
  return unwrap(res, "Could not load tables") as unknown as RestaurantTable[];
}

export async function fetchSettings(): Promise<AppSettings> {
  const res = await supabase
    .from("app_settings")
    .select(
      "restaurant_name,address,phone,gstin,tax_percent,tax_label,max_cashier_discount_percent,receipt_footer,receipt_copies,receipt_paper_mm,receipt_extra_lines,receipt_font_px,receipt_name_font_px",
    )
    .maybeSingle();
  if (res.error) throw new Error(`Could not load settings: ${res.error.message}`);
  const row = res.data as unknown as Partial<AppSettings> | null;
  if (!row) return DEFAULT_SETTINGS;
  const lines = row.receipt_extra_lines;
  return {
    ...DEFAULT_SETTINGS,
    ...row,
    receipt_copies: 1,
    receipt_paper_mm: 80,
    receipt_font_px: Math.min(Math.max(Number(row.receipt_font_px) || 12, 9), 20),
    receipt_name_font_px: Math.min(Math.max(Number(row.receipt_name_font_px) || 18, 10), 32),
    receipt_extra_lines: Array.isArray(lines)
      ? lines.filter((l) => l && typeof l === "object")
      : [],
  };
}


export async function fetchActiveOrderTableIds(): Promise<string[]> {
  const res = await supabase
    .from("orders")
    .select("table_id")
    .not("status", "in", "(completed,cancelled)")
    .not("table_id", "is", null);
  if (res.error) return [];
  return (res.data ?? []).map((r) => (r as { table_id: string }).table_id);
}

export async function createBill(input: {
  items: { menu_item_id: string; quantity: number }[];
  orderType: "dine_in" | "takeaway";
  tableId: string | null;
  discountType: "none" | "fixed" | "percent";
  discountValue: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid";
  paidAmount: number;
  notes?: string;
}): Promise<{ bill_id: string; bill_number: string; total: number }> {
  const { data, error } = await supabase.rpc("pos_create_bill", {
    p_items: input.items,
    p_order_type: input.orderType,
    ...(input.tableId ? { p_table_id: input.tableId } : {}),
    p_discount_type: input.discountType,
    p_discount_value: input.discountValue,
    p_payment_method: input.paymentMethod,
    p_payment_status: input.paymentStatus,
    p_paid_amount: input.paidAmount,
    ...(input.notes ? { p_notes: input.notes } : {}),
  });
  if (error) throw new Error(error.message);
  return data as unknown as { bill_id: string; bill_number: string; total: number };
}

export async function fetchBills(filters: {
  search?: string;
  date?: string;
  method?: string;
  status?: string;
  limit?: number;
}): Promise<BillRow[]> {
  let q = supabase
    .from("bills")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 200);
  if (filters.search) q = q.ilike("bill_number", `%${filters.search}%`);
  if (filters.method && filters.method !== "all") q = q.eq("payment_method", filters.method);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.date) {
    const start = new Date(`${filters.date}T00:00:00`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    q = q.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
  }
  const res = await q;
  return unwrap(res, "Could not load bills") as unknown as BillRow[];
}

export async function fetchReceipt(billId: string): Promise<ReceiptData> {
  const billRes = await supabase.from("bills").select("*").eq("id", billId).maybeSingle();
  if (billRes.error) throw new Error(billRes.error.message);
  if (!billRes.data) throw new Error("Bill not found");
  const bill = billRes.data as unknown as BillRow;
  const itemsRes = await supabase
    .from("order_items")
    .select("item_name,unit_price,quantity,line_total")
    .eq("order_id", bill.order_id)
    .order("created_at");
  if (itemsRes.error) throw new Error(itemsRes.error.message);
  const settings = await fetchSettings();
  return {
    bill,
    items: (itemsRes.data ?? []) as unknown as ReceiptData["items"],
    settings,
  };
}

export async function cancelBill(billId: string, reason: string) {
  const { error } = await supabase.rpc("pos_cancel_bill", { p_bill_id: billId, p_reason: reason });
  if (error) throw new Error(error.message);
}

export async function setPaymentStatus(billId: string, status: string, paidAmount: number) {
  const { error } = await supabase.rpc("pos_set_payment_status", {
    p_bill_id: billId,
    p_status: status,
    p_paid_amount: paidAmount,
  });
  if (error) throw new Error(error.message);
}

export async function updateBillPayment(input: {
  billId: string;
  method: string;
  status: string;
  paidAmount?: number;
}) {
  const { error } = await supabase.rpc("pos_update_bill_payment", {
    p_bill_id: input.billId,
    p_method: input.method,
    p_status: input.status,
    p_paid_amount: input.paidAmount ?? 0,
  });
  if (error) throw new Error(error.message);
}

/* ---------- Menu items managed straight from the billing screen ---------- */

export async function addMenuItem(input: {
  name: string;
  category: string;
  price: number;
  side?: string;
}) {
  const name = input.name.trim();
  if (!name) throw new Error("Enter an item name");
  if (!input.category) throw new Error("Choose a section for this item");
  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0) throw new Error("Enter a valid price");
  const side = input.side ?? "restaurant";
  const { error } = await supabase.from("menu_items").insert({
    name,
    category: input.category,
    price,
    side,
    section: side,
    is_available: true,
  });
  if (error) throw new Error(error.message);
}

export async function updateMenuItemPrice(id: string, price: number) {
  const value = Number(price);
  if (!Number.isFinite(value) || value < 0) throw new Error("Enter a valid price");
  const { error } = await supabase.from("menu_items").update({ price: value }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------- Daily sales ---------- */

export type DailySalesRow = {
  sale_date: string;
  total_sales: number;
  bills_count: number;
  cash_total: number;
  upi_total: number;
  card_total: number;
  other_total: number;
  discount_total: number;
  tax_total: number;
  cancelled_count: number;
};

/** Stores the totals of every finished day, so yesterday is kept once the day is over. */
export async function rollupDailySales() {
  const { error } = await supabase.rpc("pos_rollup_daily_sales");
  if (error) throw new Error(error.message);
}

export async function fetchDailySales(limit = 3650): Promise<DailySalesRow[]> {
  const { data, error } = await supabase
    .from("daily_sales")
    .select(
      "sale_date,total_sales,bills_count,cash_total,upi_total,card_total,other_total,discount_total,tax_total,cancelled_count",
    )
    .order("sale_date", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DailySalesRow[];
}
