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

export type AppSettings = {
  restaurant_name: string;
  address: string;
  phone: string;
  gstin: string;
  tax_percent: number;
  tax_label: string;
  max_cashier_discount_percent: number;
  receipt_footer: string;
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
      "restaurant_name,address,phone,gstin,tax_percent,tax_label,max_cashier_discount_percent,receipt_footer",
    )
    .maybeSingle();
  if (res.error) throw new Error(`Could not load settings: ${res.error.message}`);
  return (res.data as unknown as AppSettings) ?? DEFAULT_SETTINGS;
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
