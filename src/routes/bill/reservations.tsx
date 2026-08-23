import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bill/reservations")({ component: ReservationsPage });

type Reservation = {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string | null;
  phone: string;
  guests: number;
  reserve_date: string;
  reserve_time: string;
  table_number: number | null;
  occasion: string | null;
  notes: string | null;
  status: string;
  admin_message: string | null;
  email_status: string | null;
  email_sent_at: string | null;
  created_at: string;
};

function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const q = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reserve_date", { ascending: false })
        .order("table_number", { ascending: true })
        .limit(400);
      if (error) throw error;
      return data as unknown as Reservation[];
    },
    refetchInterval: 30_000,
  });

  const term = search.trim().toLowerCase();
  const rows = (q.data ?? []).filter((r) => {
    if (dateFilter && r.reserve_date !== dateFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!term) return true;
    return [r.reference, r.customer_name, r.customer_email, r.phone, String(r.table_number)]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term));
  });

  return (
    <div className="no-print p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold">Table reservations</h1>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {rows.length} shown
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, reference, phone, table…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {q.isLoading ? (
        <p className="mt-6 text-slate-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-slate-500">No reservations found.</p>
      ) : (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {rows.map((r) => (
            <article key={r.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {r.customer_name}{" "}
                    <span className="font-mono text-xs text-slate-400">{r.reference}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {r.guests} guests · {new Date(r.reserve_date).toLocaleDateString("en-IN")} ·{" "}
                    {r.reserve_time.slice(0, 5)}
                  </p>
                  <p className="mt-1 text-sm">
                    <a className="text-emerald-700 underline" href={`tel:${r.phone}`}>
                      {r.phone}
                    </a>
                    {r.customer_email ? (
                      <>
                        {" · "}
                        <a className="text-emerald-700 underline" href={`mailto:${r.customer_email}`}>
                          {r.customer_email}
                        </a>
                      </>
                    ) : null}
                  </p>
                  {r.occasion ? <p className="mt-1 text-sm text-slate-500">{r.occasion}</p> : null}
                  {r.notes ? <p className="mt-1 text-sm text-slate-500">“{r.notes}”</p> : null}
                  <p className="mt-1 text-xs text-slate-400">
                    Created {new Date(r.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="rounded-md bg-slate-900 px-3 py-2 text-white">
                    <p className="text-[10px] uppercase tracking-wide opacity-70">Table</p>
                    <p className="text-xl font-bold leading-none">{r.table_number ?? "—"}</p>
                  </div>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      r.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "declined"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Email: {r.email_status ?? "pending"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
