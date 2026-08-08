import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  computeTotals,
  createBill,
  fetchActiveOrderTableIds,
  fetchMenu,
  fetchReceipt,
  fetchSettings,
  fetchTables,
  money,
  type CartLine,
  type ReceiptData,
} from "@/lib/pos";
import { useStaff } from "@/lib/useStaff";
import PrintPreview from "@/components/pos/PrintPreview";

export const Route = createFileRoute("/bill/")({ component: PosPage });

type Discount = { type: "none" | "fixed" | "percent"; value: number };

function PosPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useStaff();

  const menuQuery = useQuery({ queryKey: ["pos", "menu"], queryFn: fetchMenu });
  const tablesQuery = useQuery({ queryKey: ["pos", "tables"], queryFn: fetchTables });
  const settingsQuery = useQuery({ queryKey: ["pos", "settings"], queryFn: fetchSettings });
  const activeQuery = useQuery({
    queryKey: ["pos", "active-orders"],
    queryFn: fetchActiveOrderTableIds,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [tableId, setTableId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState<Discount>({ type: "none", value: 0 });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [markPaid, setMarkPaid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  // Live menu/table updates so price or availability changes show without a refresh.
  useEffect(() => {
    const channel = supabase
      .channel("pos-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["pos", "menu"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_tables" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["pos", "tables"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const menu = menuQuery.data ?? [];
  const settings = settingsQuery.data;
  const taxPercent = settings?.tax_percent ?? 0;
  const occupied = new Set(activeQuery.data ?? []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(menu.map((m) => m.category)))],
    [menu],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu.filter(
      (m) =>
        (category === "all" || m.category === category) &&
        (!onlyAvailable || m.is_available) &&
        (q === "" || m.name.toLowerCase().includes(q)),
    );
  }, [menu, search, category, onlyAvailable]);

  const totals = computeTotals(lines, discount.type, discount.value, taxPercent);

  function addItem(id: string, name: string, price: number) {
    setLines((prev) => {
      const found = prev.find((l) => l.menu_item_id === id);
      if (found) {
        return prev.map((l) =>
          l.menu_item_id === id ? { ...l, quantity: l.quantity + 1, unit_price: price } : l,
        );
      }
      return [...prev, { menu_item_id: id, item_name: name, unit_price: price, quantity: 1 }];
    });
  }

  function setQty(id: string, delta: number) {
    setLines((prev) =>
      prev.map((l) =>
        l.menu_item_id === id ? { ...l, quantity: Math.max(1, l.quantity + delta) } : l,
      ),
    );
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.menu_item_id !== id));
  }

  function clearOrder() {
    setLines([]);
    setDiscount({ type: "none", value: 0 });
  }

  async function generateBill() {
    if (submitting) return;
    if (lines.length === 0) {
      toast.error("Add at least one item before generating a bill.");
      return;
    }
    if (orderType === "dine_in" && !tableId) {
      toast.error("Select a table (or switch to Takeaway).");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createBill({
        items: lines.map((l) => ({ menu_item_id: l.menu_item_id, quantity: l.quantity })),
        orderType,
        tableId: orderType === "dine_in" ? tableId : null,
        discountType: discount.type,
        discountValue: Number(discount.value) || 0,
        paymentMethod,
        paymentStatus: markPaid ? "paid" : "pending",
        paidAmount: 0,
      });
      const data = await fetchReceipt(result.bill_id);
      setReceipt(data);
      clearOrder();
      setTableId(null);
      toast.success(`Bill ${result.bill_number} saved · ${money(result.total)}`);
      void queryClient.invalidateQueries({ queryKey: ["pos"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the bill. Nothing was lost — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="no-print grid grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_420px]">
      {/* LEFT — menu */}
      <section className="rounded-lg bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items…"
            className="h-11 min-w-[240px] flex-1 rounded-md border border-slate-300 px-3 text-base"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Available only
          </label>
          <button
            onClick={() => menuQuery.refetch()}
            className="h-11 rounded-md border border-slate-300 px-3 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                category === c
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        <div className="mt-3">
          {menuQuery.isLoading ? (
            <p className="py-10 text-center text-slate-500">Loading menu…</p>
          ) : menuQuery.isError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700" role="alert">
              {(menuQuery.error as Error).message}
              <button onClick={() => menuQuery.refetch()} className="ml-3 underline">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No items match this search.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  disabled={!m.is_available}
                  onClick={() => addItem(m.id, m.name, Number(m.price))}
                  className="flex flex-col rounded-md border border-slate-200 p-2 text-left transition-colors hover:border-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
                >
                  <span className="text-[15px] font-semibold leading-snug">{m.name}</span>
                  <span className="text-xs text-slate-500">{m.category}</span>
                  <span className="mt-1 text-base font-bold text-emerald-800">
                    {m.is_available ? money(Number(m.price)) : "Unavailable"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT — order */}
      <aside className="flex flex-col gap-3">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex gap-2">
            {(["dine_in", "takeaway"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`flex-1 rounded-md py-2 text-sm font-semibold ${
                  orderType === t ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {t === "dine_in" ? "Dine in" : "Takeaway"}
              </button>
            ))}
          </div>

          {orderType === "dine_in" ? (
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {(tablesQuery.data ?? []).map((t) => {
                const isOccupied = t.status === "occupied" || occupied.has(t.id);
                const isReserved = t.status === "reserved";
                const selected = tableId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (isOccupied) {
                        toast.error(`${t.label} already has an active order.`);
                        return;
                      }
                      setTableId(selected ? null : t.id);
                    }}
                    className={`rounded-md px-1 py-2 text-xs font-semibold ${
                      selected
                        ? "bg-emerald-700 text-white"
                        : isOccupied
                          ? "bg-red-100 text-red-700"
                          : isReserved
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    title={isOccupied ? "Occupied" : isReserved ? "Reserved" : "Available"}
                  >
                    {t.label.replace("Table ", "T")}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex-1 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
              Current order
            </h2>
            <button onClick={clearOrder} className="text-xs text-red-600 underline">
              Clear
            </button>
          </div>

          {lines.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No items yet.</p>
          ) : (
            <ul className="mt-2 divide-y">
              {lines.map((l) => (
                <li key={l.menu_item_id} className="flex items-center gap-2 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.item_name}</p>
                    <p className="text-xs text-slate-500">
                      {money(l.unit_price)} × {l.quantity} = {money(l.unit_price * l.quantity)}
                    </p>
                  </div>
                  <button
                    onClick={() => setQty(l.menu_item_id, -1)}
                    className="h-8 w-8 rounded bg-slate-100 text-lg font-bold hover:bg-slate-200"
                    aria-label={`Decrease ${l.item_name}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{l.quantity}</span>
                  <button
                    onClick={() => setQty(l.menu_item_id, 1)}
                    className="h-8 w-8 rounded bg-slate-100 text-lg font-bold hover:bg-slate-200"
                    aria-label={`Increase ${l.item_name}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeLine(l.menu_item_id)}
                    className="h-8 w-8 rounded text-red-600 hover:bg-red-50"
                    aria-label={`Remove ${l.item_name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <select
              value={discount.type}
              onChange={(e) =>
                setDiscount({ type: e.target.value as Discount["type"], value: 0 })
              }
              className="h-10 rounded-md border border-slate-300 px-2 text-sm"
            >
              <option value="none">No discount</option>
              <option value="percent">Discount %</option>
              <option value="fixed">Discount ₹</option>
            </select>
            <input
              type="number"
              min={0}
              step="0.01"
              disabled={discount.type === "none"}
              value={discount.value}
              onChange={(e) =>
                setDiscount((d) => ({ ...d, value: Math.max(0, Number(e.target.value) || 0) }))
              }
              className="h-10 w-24 rounded-md border border-slate-300 px-2 text-sm disabled:bg-slate-100"
            />
            {!isAdmin && settings ? (
              <span className="text-xs text-slate-500">
                max {settings.max_cashier_discount_percent}%
              </span>
            ) : null}
          </div>

          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>-{money(totals.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>
                {settings?.tax_label ?? "Tax"} ({taxPercent}%)
              </dt>
              <dd>{money(totals.tax)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-xl font-bold">
              <dt>Total</dt>
              <dd>{money(totals.total)}</dd>
            </div>
          </dl>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {["cash", "upi", "card", "other"].map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`rounded-md py-2 text-sm font-semibold uppercase ${
                  paymentMethod === m ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={markPaid}
              onChange={(e) => setMarkPaid(e.target.checked)}
            />
            Payment received (otherwise saved as Pending)
          </label>

          <button
            onClick={generateBill}
            disabled={submitting || lines.length === 0}
            className="mt-3 w-full rounded-md bg-emerald-700 py-3.5 text-base font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {submitting ? "Saving bill…" : "Generate bill"}
          </button>
          <button
            onClick={() => receipt && setReceipt({ ...receipt })}
            disabled={!receipt}
            className="mt-2 w-full rounded-md border border-slate-300 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            Print last bill
          </button>
        </div>
      </aside>

      {receipt ? <PrintPreview data={receipt} onClose={() => setReceipt(null)} /> : null}
    </div>
  );
}
