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

export type ReceiptExtraLine = {
  label: string;
  value: string;
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
  copies_per_bill: number;
  paper_width: string;
  receipt_text_size: number;
  extra_receipt_lines: ReceiptExtraLine[];
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
  copies_per_bill: 3,
  paper_width: "80mm",
  receipt_text_size: 12,
  extra_receipt_lines: [],
};

function parseExtraReceiptLines(raw: unknown): ReceiptExtraLine[] {
  const fallback: ReceiptExtraLine[] = [];
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is ReceiptExtraLine => !!item && typeof item === "object" && "label" in item && "value" in item)
      .map((item) => ({
        label: String((item as ReceiptExtraLine).label ?? ""),
        value: String((item as ReceiptExtraLine).value ?? ""),
      }));
  }
  if (typeof raw !== "string" || !raw.trim()) return fallback;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parseExtraReceiptLines(parsed);
    }
  } catch {
    // legacy plain-string values are not editable JSON; ignore them and use empty list.
  }

  return fallback;
}

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
      "restaurant_name,address,phone,gstin,tax_percent,tax_label,max_cashier_discount_percent,receipt_footer,copies_per_bill,paper_width,receipt_text_size,extra_receipt_lines",
    )
    .maybeSingle();
  if (res.error) throw new Error(`Could not load settings: ${res.error.message}`);

  const next = (res.data ?? {}) as Partial<AppSettings> & { extra_receipt_lines?: string | ReceiptExtraLine[] | null };
  return {
    ...DEFAULT_SETTINGS,
    ...next,
    extra_receipt_lines: parseExtraReceiptLines(next.extra_receipt_lines ?? DEFAULT_SETTINGS.extra_receipt_lines),
  } as AppSettings;
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

export async function addMenuItem(input: {
  name: string;
  category: string;
  price: number;
  section?: string;
  side?: string;
}): Promise<void> {
  const section = input.section ?? input.side ?? "restaurant";
  const { error } = await supabase.from("menu_items").insert({
    name: input.name,
    category: input.category,
    section,
    price: Number(input.price) || 0,
    is_available: true,
  });
  if (error) throw new Error(error.message);
}

export async function updateMenuItemPrice(id: string, price: number): Promise<void> {
  const { error } = await supabase.from("menu_items").update({ price: Number(price) || 0 }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
  paidAmount: number;
}) {
  const status = String(input.status || "pending").toLowerCase();
  const method = String(input.method || "cash").toLowerCase();
  const paidAmount = Number(input.paidAmount || 0);

  const { data: bill, error: billErr } = await supabase
    .from("bills")
    .select("id,total,payment_status,payment_method,paid_amount")
    .eq("id", input.billId)
    .single();

  if (billErr) throw new Error(billErr.message);
  if (!bill) throw new Error("Bill not found");

  const nextPaidAmount = status === "paid" ? Math.min(Math.max(paidAmount, 0), Number(bill.total || 0)) : 0;
  const paymentTimestamp = status === "paid" ? new Date().toISOString() : null;

  const { error: updateBillErr } = await supabase
    .from("bills")
    .update({
      payment_method: method,
      payment_status: status,
      paid_amount: nextPaidAmount,
      payment_timestamp: paymentTimestamp,
    })
    .eq("id", input.billId);

  if (updateBillErr) throw new Error(updateBillErr.message);

  const { error: updatePaymentErr } = await supabase
    .from("payments")
    .update({
      method,
      amount: nextPaidAmount,
      status,
      paid_at: paymentTimestamp,
    })
    .eq("bill_id", input.billId);

  if (updatePaymentErr) throw new Error(updatePaymentErr.message);
}

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

export async function fetchDailySales(limit = 30): Promise<DailySalesRow[]> {
  const { data, error } = await supabase
    .from("bills")
    .select("created_at,total,payment_method,discount_amount,tax_amount,status")
    .order("created_at", { ascending: false })
    .limit(Math.max(limit, 1) * 200);
  if (error) throw new Error(error.message);

  const grouped = new Map<string, DailySalesRow>();
  for (const bill of data ?? []) {
    const created = new Date(bill.created_at);
    const saleDate = new Date(created.getTime() - created.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const row = grouped.get(saleDate) ?? {
      sale_date: saleDate,
      total_sales: 0,
      bills_count: 0,
      cash_total: 0,
      upi_total: 0,
      card_total: 0,
      other_total: 0,
      discount_total: 0,
      tax_total: 0,
      cancelled_count: 0,
    };

    if (bill.status === "cancelled") {
      row.cancelled_count += 1;
      grouped.set(saleDate, row);
      continue;
    }

    row.bills_count += 1;
    row.total_sales += Number(bill.total || 0);
    row.discount_total += Number(bill.discount_amount || 0);
    row.tax_total += Number(bill.tax_amount || 0);

    const method = String(bill.payment_method || "").toLowerCase();
    if (method === "cash") row.cash_total += Number(bill.total || 0);
    if (method === "upi") row.upi_total += Number(bill.total || 0);
    if (method === "card") row.card_total += Number(bill.total || 0);
    if (method === "other") row.other_total += Number(bill.total || 0);

    grouped.set(saleDate, row);
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.sale_date.localeCompare(a.sale_date))
    .slice(0, limit);
}

export async function rollupDailySales(): Promise<DailySalesRow[]> {
  return fetchDailySales(3650);
}

export async function fetchSalesByDay(limit = 30): Promise<DailySalesRow[]> {
  return fetchDailySales(limit);
}
