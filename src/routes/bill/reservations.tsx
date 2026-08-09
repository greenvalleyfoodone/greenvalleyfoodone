import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/lib/useStaff";

export const Route = createFileRoute("/bill/reservations")({ component: ReservationsPage });

type Reservation = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  guests: number;
  reserve_date: string;
  reserve_time: string;
  occasion: string | null;
  notes: string | null;
  status: string;
  admin_message: string | null;
  created_at: string;
};

const RESTAURANT_PHONE = "919866255533";

function ReservationsPage() {
  const { isAdmin } = useStaff();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Reservation[];
    },
    refetchInterval: 30_000,
  });

  async function setStatus(r: Reservation, status: string) {
    const message =
      status === "accepted"
        ? "Your table is confirmed. See you at Green Valley!"
        : status === "declined"
          ? window.prompt("Reason for the customer?", "Sorry, we are fully booked at that time.") ?? ""
          : null;
    const { error } = await supabase
      .from("reservations")
      .update({ status, admin_message: message })
      .eq("id", r.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Booking ${r.reference} ${status}.`);
    void qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
  }

  const rows = q.data ?? [];
  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="no-print p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold">Table reservations</h1>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {pending} awaiting reply
        </span>
      </div>

      {q.isLoading ? (
        <p className="mt-6 text-slate-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-slate-500">No reservations yet.</p>
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
                    {" · "}
                    <a
                      className="text-emerald-700 underline"
                      href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^(?!91)/, "91")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  </p>
                  {r.occasion ? <p className="mt-1 text-sm text-slate-500">{r.occasion}</p> : null}
                  {r.notes ? <p className="mt-1 text-sm text-slate-500">“{r.notes}”</p> : null}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    r.status === "accepted"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.status === "declined"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {isAdmin ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatus(r, "accepted")}
                    className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setStatus(r, "declined")}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-700"
                  >
                    Decline
                  </button>
                  <a
                    href={`https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(
                      `Reservation ${r.reference} — ${r.customer_name}, ${r.phone}, ${r.guests} guests, ${r.reserve_date} ${r.reserve_time}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    Forward to 98662 55533
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
