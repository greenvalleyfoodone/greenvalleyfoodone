import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const RESTAURANT_PHONE = "919866255533";

export default function Reservation() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(f.get("name") || "").trim(),
      phone: String(f.get("phone") || "").trim(),
      guests: Number(f.get("guests")),
      reserve_date: String(f.get("date")),
      reserve_time: String(f.get("time")),
      occasion: String(f.get("occasion") || "").trim() || null,
      notes: String(f.get("notes") || "").trim() || null,
    };
    if (!/^[0-9+\-\s]{8,15}$/.test(payload.phone)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setBusy(true);
    const { data, error: err } = await supabase
      .from("reservations")
      .insert(payload)
      .select("reference, customer_name, phone, guests, reserve_date, reserve_time")
      .single();
    setBusy(false);
    if (err) {
      setError(err.message || "Could not send your request. Please call us instead.");
      return;
    }
    setBooking(data);
    try {
      window.localStorage.setItem("gv_reservation_ref", data.reference);
    } catch {
      /* storage unavailable */
    }
  }

  async function checkStatus(e) {
    e.preventDefault();
    setLookupError("");
    setLookupResult(null);
    const { data, error: err } = await supabase.rpc("reservation_status", {
      p_reference: lookup.trim(),
    });
    if (err) {
      setLookupError(err.message);
      return;
    }
    if (!data || data.length === 0) {
      setLookupError("No booking found with that reference.");
      return;
    }
    setLookupResult(data[0]);
  }

  const waLink = booking
    ? `https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(
        `New table request ${booking.reference}\nName: ${booking.customer_name}\nMobile: ${booking.phone}\nGuests: ${booking.guests}\nDate: ${booking.reserve_date} at ${booking.reserve_time}`,
      )}`
    : "#";

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">Reservation</p>
      <h1 className="font-display text-4xl md:text-5xl mb-8">Reserve a table.</h1>

      {booking ? (
        <div className="bg-valley-ivory border border-valley-gold/40 rounded-sm p-6 md:p-8">
          <p className="font-display text-xl mb-2">Request received.</p>
          <p className="text-valley-ink/70">
            Your reference is{" "}
            <strong className="font-mono tracking-wide">{booking.reference}</strong>. We will confirm
            your table shortly — keep this code to check the status.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-valley-ink/80">
            <dt className="font-mono uppercase text-xs text-valley-ink/50">Mobile</dt>
            <dd>{booking.phone}</dd>
            <dt className="font-mono uppercase text-xs text-valley-ink/50">Guests</dt>
            <dd>{booking.guests}</dd>
            <dt className="font-mono uppercase text-xs text-valley-ink/50">When</dt>
            <dd>
              {booking.reserve_date} · {booking.reserve_time}
            </dd>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-valley-forest text-valley-ivory font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:bg-valley-ink transition-colors"
            >
              Notify on WhatsApp
            </a>
            <a
              href="tel:+919866255533"
              className="border border-valley-ink/20 font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:border-valley-gold transition-colors"
            >
              Call 98662 55533
            </a>
          </div>
          <button
            type="button"
            onClick={() => setBooking(null)}
            className="mt-5 text-xs underline text-valley-ink/60"
          >
            Book another table
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" name="name" required />
            <Field label="Mobile number" name="phone" type="tel" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Date" name="date" type="date" required />
            <Field label="Time" name="time" type="time" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Number of guests" name="guests" type="number" min="1" required />
            <Field label="Occasion (optional)" name="occasion" />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wide text-valley-ink/60 mb-2">
              Special requests
            </label>
            <textarea
              name="notes"
              rows="3"
              className="w-full border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full sm:w-auto bg-valley-forest text-valley-ivory font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-valley-ink transition-colors disabled:opacity-60"
          >
            {busy ? "Sending…" : "Request reservation"}
          </button>
        </form>
      )}

      <div className="mt-14 border-t border-valley-ink/10 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-3">
          Check your booking
        </p>
        <form onSubmit={checkStatus} className="flex flex-col sm:flex-row gap-3">
          <input
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="GVR-XXXXXX"
            className="flex-1 border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none font-mono"
          />
          <button
            type="submit"
            className="border border-valley-ink/20 font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:border-valley-gold transition-colors"
          >
            Check status
          </button>
        </form>
        {lookupError ? <p className="mt-3 text-sm text-red-700">{lookupError}</p> : null}
        {lookupResult ? (
          <div className="mt-4 rounded-sm border border-valley-gold/40 bg-valley-ivory p-5">
            <p className="font-display text-lg capitalize">
              {lookupResult.status === "accepted"
                ? "Your table is confirmed 🎉"
                : lookupResult.status === "declined"
                  ? "Sorry, we could not confirm this booking"
                  : "Awaiting confirmation"}
            </p>
            <p className="mt-1 text-sm text-valley-ink/70">
              {lookupResult.reference} · {lookupResult.guests} guests · {lookupResult.reserve_date}{" "}
              at {lookupResult.reserve_time}
            </p>
            {lookupResult.admin_message ? (
              <p className="mt-2 text-sm text-valley-ink/80">{lookupResult.admin_message}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required, min }) {
  return (
    <div>
      <label className="block font-mono text-xs uppercase tracking-wide text-valley-ink/60 mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        className="w-full border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none"
      />
    </div>
  );
}
