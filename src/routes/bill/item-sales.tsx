import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDailyItemSales, money } from "@/lib/pos";

export const Route = createFileRoute("/bill/item-sales")({
  head: () => ({
    meta: [
      { title: "Item Sales — Green Valley Food One" },
      { name: "description", content: "Staff-only daily item sales for Green Valley Food One." },
      { property: "og:title", content: "Item Sales — Green Valley Food One" },
      {
        property: "og:description",
        content: "Staff-only daily item sales for Green Valley Food One.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ItemSalesPage,
});

function indiaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function displayDate(date: string) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ItemSalesPage() {
  const [today, setToday] = useState(indiaDate);
  const [date, setDate] = useState(indiaDate);
  const [printedAt, setPrintedAt] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = indiaDate();
      if (next !== today) {
        setToday(next);
        setDate((selected) => (selected === today ? next : selected));
      }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [today]);

  useEffect(() => {
    const clear = () => setPrintedAt("");
    window.addEventListener("afterprint", clear);
    return () => window.removeEventListener("afterprint", clear);
  }, []);

  const salesQuery = useQuery({
    queryKey: ["pos", "item-sales", date],
    queryFn: () => fetchDailyItemSales(date),
    refetchInterval: 30_000,
  });
  const items = salesQuery.data ?? [];
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity_sold), 0);
  const total = items.reduce((sum, item) => sum + Number(item.sales_total), 0);

  function printSlip() {
    if (!items.length || salesQuery.isFetching || salesQuery.isError) return;
    setPrintedAt(
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }),
    );
    window.setTimeout(() => window.print(), 100);
  }

  return (
    <>
      <main className="no-print mx-auto max-w-6xl p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Item Sales</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {date === today ? "Today" : displayDate(date)}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm font-medium text-foreground">
              Sales date
              <input
                type="date"
                value={date}
                max={today}
                onChange={(event) => setDate(event.target.value || today)}
                className="mt-1 block h-10 rounded border border-input bg-background px-3 text-foreground"
              />
            </label>
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh item sales"
              title="Refresh item sales"
              onClick={() => void salesQuery.refetch()}
              disabled={salesQuery.isFetching}
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              onClick={printSlip}
              disabled={!items.length || salesQuery.isFetching || salesQuery.isError}
            >
              <Printer className="size-4" /> Print slip
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border py-5 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Items sold</p>
            <p className="text-2xl font-bold text-foreground">
              {salesQuery.isLoading ? "…" : quantity}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Different items</p>
            <p className="text-2xl font-bold text-foreground">
              {salesQuery.isLoading ? "…" : items.length}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Item sales</p>
            <p className="text-2xl font-bold text-foreground">
              {salesQuery.isLoading ? "…" : money(total)}
            </p>
          </div>
        </div>

        {salesQuery.isError ? (
          <p role="alert" className="mt-5 text-destructive">
            {(salesQuery.error as Error).message}
          </p>
        ) : null}
        {salesQuery.isLoading ? (
          <p className="py-12 text-center text-muted-foreground">Loading item sales…</p>
        ) : null}
        {!salesQuery.isLoading && !salesQuery.isError && !items.length ? (
          <p className="py-12 text-center text-muted-foreground">No items sold on this date.</p>
        ) : null}
        {!!items.length && !salesQuery.isError ? (
          <div className="mt-5 overflow-x-auto border border-border bg-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="border-b border-border bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.menu_item_id}>
                    <td className="px-4 py-3 font-medium text-foreground">{item.item_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.quantity_sold}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{money(item.sales_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border bg-muted font-bold">
                <tr>
                  <td className="px-4 py-3" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">{quantity}</td>
                  <td className="px-4 py-3 text-right">{money(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}
      </main>

      {printedAt ? (
        <section
          className="daily-sales-print-area item-sales-print-area"
          aria-label="Item sales print slip"
        >
          <h1>GREEN VALLEY FOOD ONE</h1>
          <h2>Daily Item Sales</h2>
          <p>Sales date: {displayDate(date)}</p>
          <p>Printed at: {printedAt}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.menu_item_id}>
                  <th>{item.item_name}</th>
                  <td>{item.quantity_sold}</td>
                  <td>{money(item.sales_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <td>{quantity}</td>
                <td>{money(total)}</td>
              </tr>
            </tfoot>
          </table>
        </section>
      ) : null}
    </>
  );
}
