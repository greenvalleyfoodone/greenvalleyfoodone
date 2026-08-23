import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bill/reservations")({
  component: ReservationsPage,
});

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
  created_at: string;
};

function ReservationsPage() {
  const queryClient = useQueryClient();
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
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as unknown as Reservation[];
    },
    refetchInterval: 15_000,
  });

  async function updateStatus(id: string, status: string) {
    await supabase.from("reservations").update({ status }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
  }

  async function deleteReservation(id: string) {
    if (!confirm("Delete this reservation permanently?")) return;
    await supabase.from("reservations").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
  }

  function printBill(r: Reservation) {
    const w = window.open("", "_blank", "width=420,height=600");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Bill - ${r.reference}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap');
            *{box-sizing:border-box;margin:0;padding:0}
            body{font-family:Inter,system-ui,sans-serif;background:#fff;padding:24px;color:#20241F}
            .slip{max-width:360px;margin:0 auto;border:2px solid #C7A339;border-radius:12px;overflow:hidden}
            .head{background:#1F3A2A;padding:28px 20px;text-align:center;position:relative}
            .head::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:rgba(199,163,57,.5)}
            .head h1{font-family:'Playfair Display',serif;color:#C7A339;font-size:22px;letter-spacing:.1em}
            .head p{color:rgba(246,241,231,.7);font-size:10px;text-transform:uppercase;letter-spacing:.2em;margin-top:6px}
            .badge{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(199,163,57,.5);border-radius:999px;padding:5px 14px;margin-top:14px;background:rgba(255,255,255,.06)}
            .badge span{color:#C7A339;font-size:9px;text-transform:uppercase;letter-spacing:.15em;font-weight:700}
            .ref{background:#F5F2EA;text-align:center;padding:20px;border-bottom:1px solid rgba(199,163,57,.2)}
            .ref-label{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:#8a8279;font-family:monospace}
            .ref-code{font-family:'Playfair Display',serif;font-size:28px;color:#1F3A2A;margin-top:4px}
            .details{padding:20px}
            .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed rgba(31,58,42,.12);font-size:12px}
            .row:last-child{border:0}
            .label{color:#8a8279;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:.08em}
            .value{font-weight:500;color:#20241F}
            .value.status{color:#166534;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:11px}
            .foot{background:#F5F2EA;padding:16px;text-align:center;border-top:1px solid rgba(199,163,57,.2)}
            .foot p{font-size:11px;color:#6f645b;line-height:1.6}
            .note{margin-top:8px;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#9a968a;font-weight:600}
            @media print{body{padding:0}.slip{border:0}}
          </style>
        </head>
        <body onload="setTimeout(()=>{window.print();window.close()},300)">
          <div class="slip">
            <div class="head">
              <h1>GREEN VALLEY</h1>
              <p>Food One · Santhamaguluru</p>
              <div class="badge"><span style="width:6px;height:6px;background:#4ade80;border-radius:50%;display:inline-block"></span><span>Table Reserved</span></div>
            </div>
            <div class="ref">
              <div class="ref-label">Reservation Reference</div>
              <div class="ref-code">${r.reference}</div>
            </div>
            <div class="details">
              <div class="row"><span class="label">Name</span><span class="value">${r.customer_name}</span></div>
              <div class="row"><span class="label">Email</span><span class="value">${r.customer_email || "-"}</span></div>
              <div class="row"><span class="label">Phone</span><span class="value">${r.phone}</span></div>
              <div class="row"><span class="label">Guests</span><span class="value">${r.guests}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${r.reserve_date}</span></div>
              <div class="row"><span class="label">Time</span><span class="value">${r.reserve_time.slice(0, 5)}</span></div>
              <div class="row"><span class="label">Table</span><span class="value">Table ${r.table_number ?? "-"}</span></div>
              <div class="row"><span class="label">Status</span><span class="value status">${r.status}</span></div>
            </div>
            <div class="foot">
              <p>Green Valley Food One<br>4XRH+3GM, Santhamaguluru, AP 522603<br>Phone: 98662 55533</p>
              <div class="note">Please show this slip on arrival</div>
            </div>
          </div>
        </body>
      </html>
    `);
    w.document.close();
  }

  const term = search.trim().toLowerCase();
  const rows = (q.data ?? []).filter((r) => {
    if (dateFilter && r.reserve_date !== dateFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!term) return true;
    return [r.reference, r.customer_name, r.customer_email, r.phone, String(r.table_number)]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term));
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (q.data ?? []).filter((r) => r.reserve_date === today).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Table Reservations</h1>
            <p className="mt-1 text-sm text-slate-500">
              Auto-accepted reservations · {todayCount} today · {rows.length} shown
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Auto-accept ON
            </span>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] })}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, reference, phone, table…"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All statuses</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
          <button
            onClick={() => {
              setSearch("");
              setDateFilter("");
              setStatusFilter("all");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>

        {/* Content */}
        {q.isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500" />
            Loading reservations…
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No reservations found.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {rows.map((r) => (
              <article
                key={r.id}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {r.customer_name}
                      </p>
                      <span className="shrink-0 font-mono text-[11px] text-slate-400">
                        {r.reference}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {r.guests} guests ·{" "}
                      {new Date(r.reserve_date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {r.reserve_time.slice(0, 5)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <a
                        className="text-emerald-700 underline decoration-emerald-700/30 hover:text-emerald-800"
                        href={`tel:${r.phone}`}
                      >
                        {r.phone}
                      </a>
                      {r.customer_email ? (
                        <a
                          className="truncate text-emerald-700 underline decoration-emerald-700/30 hover:text-emerald-800"
                          href={`mailto:${r.customer_email}`}
                        >
                          {r.customer_email}
                        </a>
                      ) : null}
                    </div>

                    {r.occasion ? (
                      <p className="mt-2 text-sm text-slate-500">🎉 {r.occasion}</p>
                    ) : null}
                    {r.notes ? (
                      <p className="mt-1 text-sm italic text-slate-500">“{r.notes}”</p>
                    ) : null}

                    <p className="mt-2 text-[11px] text-slate-400">
                      Booked {new Date(r.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="shrink-0 text-right">
                    <div className="rounded-lg bg-slate-900 px-4 py-2 text-center text-white">
                      <p className="text-[10px] uppercase tracking-wider opacity-70">Table</p>
                      <p className="text-2xl font-bold leading-none">{r.table_number ?? "—"}</p>
                    </div>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        r.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "declined"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => printBill(r)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Print Bill
                  </button>

                  {r.status !== "accepted" && (
                    <button
                      onClick={() => updateStatus(r.id, "accepted")}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                  )}

                  {r.status !== "declined" && (
                    <button
                      onClick={() => updateStatus(r.id, "declined")}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Decline
                    </button>
                  )}

                  <button
                    onClick={() => deleteReservation(r.id)}
                    className="ml-auto rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}