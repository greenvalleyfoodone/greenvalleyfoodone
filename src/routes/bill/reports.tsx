import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchBills, money } from "@/lib/pos";

export const Route = createFileRoute("/bill/reports")({ component: ReportsPage });

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function ReportsPage() {
  const date = todayISO();
  const billsQuery = useQuery({
    queryKey: ["pos", "bills", "day", date],
    queryFn: () => fetchBills({ date, limit: 1000 }),
    refetchInterval: 60_000,
  });

  const bills = billsQuery.data ?? [];
  const active = bills.filter((b) => b.status === "active");
  const sum = (method?: string) =>
    active
      .filter((b) => (method ? b.payment_method === method : true))
      .reduce((t, b) => t + Number(b.total), 0);

  const cards = [
    { label: "Today's sales", value: money(sum()) },
    { label: "Number of bills", value: String(active.length) },
    { label: "Cash sales", value: money(sum("cash")) },
    { label: "UPI sales", value: money(sum("upi")) },
    { label: "Card sales", value: money(sum("card")) },
    { label: "Cancelled bills", value: String(bills.filter((b) => b.status === "cancelled").length) },
  ];

  return (
    <div className="no-print p-4">
      <h1 className="text-lg font-bold">Sales — {new Date(date).toLocaleDateString("en-IN")}</h1>
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
      <p className="mt-4 text-xs text-slate-500">
        Pending payments are included in today's totals; cancelled bills are excluded but kept for
        audit.
      </p>
    </div>
  );
}
