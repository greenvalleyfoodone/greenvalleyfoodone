import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBills, fetchDailySales, money, rollupDailySales } from "@/lib/pos";

export const Route = createFileRoute("/bill/reports")({ component: ReportsPage });

function todayISO() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

type DailySalesRow = {
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

function ReportsPage() {
  const [date, setDate] = useState(todayISO);
  const [printTarget, setPrintTarget] = useState<DailySalesRow | null>(null);
  const [printedAt, setPrintedAt] = useState("");
  useEffect(() => {
    const timer = window.setInterval(() => setDate(todayISO()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const billsQuery = useQuery({
    queryKey: ["pos", "bills", "day", date],
    queryFn: () => fetchBills({ date, limit: 1000 }),
    refetchInterval: 30_000,
  });

  const historyQuery = useQuery({
    queryKey: ["pos", "daily-sales"],
    queryFn: () => fetchDailySales(3650),
    refetchInterval: 60_000,
  });

  // Once a day is over its totals are stored, so past days stay available.
  useEffect(() => {
    void rollupDailySales()
      .then(() => historyQuery.refetch())
      .catch(() => undefined);
    // The rollover is intentionally refreshed when the India-local business date changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    const clearPrintTarget = () => {
      setPrintTarget(null);
      setPrintedAt("");
    };
    window.addEventListener("afterprint", clearPrintTarget);
    return () => window.removeEventListener("afterprint", clearPrintTarget);
  }, []);

  function printDailySales(row: DailySalesRow) {
    setPrintTarget(row);
    setPrintedAt(
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }),
    );
    window.setTimeout(() => window.print(), 100);
  }

  const bills = billsQuery.data ?? [];
  const active = bills.filter((b) => b.status === "active");
  const sum = (method?: string) =>
    active
      .filter((b) => (method ? b.payment_method === method : true))
      .reduce((t, b) => t + Number(b.total), 0);

  const todayRow = {
    sale_date: date,
    total_sales: sum(),
    bills_count: active.length,
    cash_total: sum("cash"),
    upi_total: sum("upi"),
    card_total: sum("card"),
    other_total: sum("other"),
    discount_total: active.reduce((t, b) => t + Number(b.discount_amount), 0),
    tax_total: active.reduce((t, b) => t + Number(b.tax_amount), 0),
    cancelled_count: bills.filter((b) => b.status === "cancelled").length,
  };
  const history = [todayRow, ...(historyQuery.data ?? []).filter((d) => d.sale_date !== date)];
  const allTimeSales = history.reduce((total, row) => total + Number(row.total_sales), 0);
  const allTimeBills = history.reduce((total, row) => total + Number(row.bills_count), 0);

  const cards = [
    { label: "Today's sales", value: money(sum()) },
    { label: "Number of bills", value: String(active.length) },
    { label: "Cash sales", value: money(sum("cash")) },
    { label: "UPI sales", value: money(sum("upi")) },
    { label: "Card sales", value: money(sum("card")) },
    { label: "Cancelled bills", value: String(bills.filter((b) => b.status === "cancelled").length) },
    { label: "All-time sales", value: money(allTimeSales) },
    { label: "All-time bills", value: String(allTimeBills) },
  ];

  return (
    <>
      <div className="no-print p-4">
        <h1 className="text-lg font-bold">
         Sales — today, {new Date(`${date}T12:00:00`).toLocaleDateString("en-IN")}
      </h1>
      {billsQuery.isError ? (
        <p className="mt-3 rounded bg-red-50 p-3 text-red-700" role="alert">
          {(billsQuery.error as Error).message}
        </p>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {billsQuery.isLoading ? "…" : c.value}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Today's figures update on their own. Pending payments are included; cancelled bills are
        excluded but kept for audit.
      </p>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">All day-by-day sales</h2>
            <p className="mt-1 text-xs text-slate-500">
              Print any day as a slip with total, cash, UPI, card, tax, discount, and cancellations.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => printDailySales(todayRow)}
              aria-label="Print today's sales summary"
            >
              <Printer aria-hidden="true" />
              Print today
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
            onClick={async () => {
              await rollupDailySales().catch(() => undefined);
              void historyQuery.refetch();
            }}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg bg-white shadow-sm">
          {historyQuery.isLoading ? (
            <p className="p-6 text-center text-slate-500">Loading history…</p>
          ) : history.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
              No sales stored yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2 text-right">Total sales</th>
                  <th className="px-3 py-2 text-right">Bills</th>
                  <th className="px-3 py-2 text-right">Cash</th>
                  <th className="px-3 py-2 text-right">UPI</th>
                  <th className="px-3 py-2 text-right">Card</th>
                  <th className="px-3 py-2 text-right">Discount</th>
                  <th className="px-3 py-2 text-right">Tax</th>
                  <th className="px-3 py-2 text-right">Cancelled</th>
                  <th className="px-3 py-2 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((d) => (
                  <tr key={d.sale_date}>
                    <td className="px-3 py-2 font-semibold">
                      <div className="flex min-w-[185px] items-center gap-2">
                        <span>
                          {d.sale_date === date ? "Today · " : ""}{new Date(`${d.sale_date}T12:00:00`).toLocaleDateString("en-IN")}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => printDailySales(d)}
                          aria-label={`Print sales for ${d.sale_date}`}
                        >
                          <Printer aria-hidden="true" />
                          Print slip
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">{money(d.total_sales)}</td>
                    <td className="px-3 py-2 text-right">{d.bills_count}</td>
                    <td className="px-3 py-2 text-right">{money(d.cash_total)}</td>
                    <td className="px-3 py-2 text-right">{money(d.upi_total)}</td>
                    <td className="px-3 py-2 text-right">{money(d.card_total)}</td>
                    <td className="px-3 py-2 text-right">{money(d.discount_total)}</td>
                    <td className="px-3 py-2 text-right">{money(d.tax_total)}</td>
                    <td className="px-3 py-2 text-right">{d.cancelled_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      </div>

      {printTarget ? (
        <section className="daily-sales-print-area" aria-label="Daily sales print summary">
          <h1>GREEN VALLEY FOOD ONE</h1>
          <h2>Daily Sales Summary</h2>
          <p>Sales date: {new Date(`${printTarget.sale_date}T12:00:00`).toLocaleDateString("en-IN")}</p>
          <p>Printed at: {printedAt}</p>
          <table>
            <tbody>
              <tr><th>Total sales</th><td>{money(printTarget.total_sales)}</td></tr>
              <tr><th>Number of bills</th><td>{printTarget.bills_count}</td></tr>
              <tr><th>Cash sales</th><td>{money(printTarget.cash_total)}</td></tr>
              <tr><th>UPI sales</th><td>{money(printTarget.upi_total)}</td></tr>
              <tr><th>Card sales</th><td>{money(printTarget.card_total)}</td></tr>
              <tr><th>Other sales</th><td>{money(printTarget.other_total)}</td></tr>
              <tr><th>Discount</th><td>{money(printTarget.discount_total)}</td></tr>
              <tr><th>Tax</th><td>{money(printTarget.tax_total)}</td></tr>
              <tr><th>Cancelled bills</th><td>{printTarget.cancelled_count}</td></tr>
            </tbody>
          </table>
          <p className="daily-sales-print-note">Printed from the Green Valley Food One sales register.</p>
        </section>
      ) : null}
    </>
  );
}
