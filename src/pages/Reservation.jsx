import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const RESTAURANT_PHONE = "+919866255533";

export default function Reservation() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const [nameValue, setNameValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);

  function handleNameChange(e) {
    const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setNameValue(cleaned);
  }

  function handlePhoneChange(e) {
    const cleaned = e.target.value.replace(/[^0-9]/g, "");
    setPhoneValue(cleaned);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const form = new FormData(e.currentTarget);

    const payload = {
      customer_name: nameValue.trim(),
      customer_email: String(form.get("email") || "").trim(),
      phone: phoneValue.trim(),
      guests: Number(form.get("guests")),
      reserve_date: String(form.get("date") || ""),
      reserve_time: String(form.get("time") || ""),
      occasion: String(form.get("occasion") || "").trim() || null,
      notes: String(form.get("notes") || "").trim() || null,
    };

    if (!payload.customer_name) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(payload.customer_name)) {
      setError("Name should contain letters only.");
      return;
    }

    if (
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(
        payload.customer_email
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{8,15}$/.test(payload.phone)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!Number.isInteger(payload.guests) || payload.guests < 1) {
      setError("The number of guests must be at least 1.");
      return;
    }

    if (!payload.reserve_date) {
      setError("Please select a reservation date.");
      return;
    }

    if (!payload.reserve_time) {
      setError("Please select a reservation time.");
      return;
    }

    setBusy(true);

    const { data, error: err } = await supabase.rpc(
      "create_reservation",
      {
        p_name: payload.customer_name,
        p_email: payload.customer_email,
        p_phone: payload.phone,
        p_guests: payload.guests,
        p_date: payload.reserve_date,
        p_time: payload.reserve_time,
        p_occasion: payload.occasion,
        p_notes: payload.notes,
      }
    );

    setBusy(false);

    if (err) {
      const message = err.message || "";

      if (
        message.toLowerCase().includes("all tables") ||
        message.toLowerCase().includes("table")
      ) {
        setError(
          "Sorry, all tables are currently booked for this date. Please choose another date."
        );
      } else {
        setError(
          message.replace(/^.*?:\s*/, "") ||
            "Could not create your reservation. Please call 98662 55533."
        );
      }

      return;
    }

    if (!data || data.length === 0) {
      setError(
        "Could not create your reservation. Please call 98662 55533."
      );
      return;
    }

    const row = data[0];

    setBooking(row);

    try {
      window.localStorage.setItem(
        "gv_reservation_ref",
        row.reference
      );
    } catch {
      // Local storage may be unavailable.
    }

    e.currentTarget.reset();
    setNameValue("");
    setPhoneValue("");
  }

  async function checkStatus(e) {
    e.preventDefault();

    setLookupError("");
    setLookupResult(null);

    const reference = lookup.trim().toUpperCase();

    if (!reference) {
      setLookupError("Please enter your reservation reference.");
      return;
    }

    setLookupBusy(true);

    const { data, error: err } = await supabase.rpc(
      "reservation_status",
      {
        p_reference: reference,
      }
    );

    setLookupBusy(false);

    if (err) {
      setLookupError(
        "Could not check the reservation status. Please try again."
      );
      return;
    }

    if (!data || data.length === 0) {
      setLookupError("No booking found with that reference.");
      return;
    }

    setLookupResult(data[0]);
  }

  function startNewBooking() {
    setBooking(null);
    setError("");
    setNameValue("");
    setPhoneValue("");
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <img
        src="/images/logo-1.png"
        alt="Hotel Green Valley Food One"
        className="h-14 w-auto mb-6"
        loading="lazy"
      />

      <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">
        Reservation
      </p>

      <h1 className="font-display text-4xl md:text-5xl mb-8">
        Reserve a table.
      </h1>

      {booking ? (
        <div className="bg-valley-ivory border border-valley-gold/40 rounded-sm p-6 md:p-8">
          <p className="font-display text-xl mb-2">
            Your reservation request has been received.
          </p>

          <p className="text-valley-ink/70">
            A request email is being sent to{" "}
            <strong>{booking.customer_email}</strong>.
          </p>

          <div className="mt-5 rounded-sm bg-valley-forest/5 border border-valley-gold/40 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-widest text-valley-ink/50">
              Reservation reference
            </p>

            <p className="font-display text-3xl mt-1">
              {booking.reference}
            </p>
          </div>

          <div className="mt-5 rounded-sm bg-valley-forest/5 border border-valley-gold/40 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-widest text-valley-ink/50">
              Assigned table
            </p>

            <p className="font-display text-4xl mt-1">
              Table {booking.table_number}
            </p>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm text-valley-ink/80">
            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Name
            </dt>
            <dd>{booking.customer_name}</dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Email
            </dt>
            <dd className="break-all">
              {booking.customer_email}
            </dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Mobile
            </dt>
            <dd>{booking.phone}</dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Guests
            </dt>
            <dd>{booking.guests}</dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Date
            </dt>
            <dd>{booking.reserve_date}</dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Time
            </dt>
            <dd>
              {String(booking.reserve_time).slice(0, 5)}
            </dd>

            <dt className="font-mono uppercase text-xs text-valley-ink/50">
              Status
            </dt>
            <dd className="capitalize">
              {booking.status || "pending"}
            </dd>
          </dl>

          <p className="mt-5 text-sm text-valley-ink/60">
            Your request is currently pending. We will contact you if
            anything needs to change.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${RESTAURANT_PHONE}`}
              className="border border-valley-ink/20 font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:border-valley-gold transition-colors"
            >
              Call 98662 55533
            </a>
          </div>

          <button
            type="button"
            onClick={startNewBooking}
            className="mt-5 text-xs underline text-valley-ink/60"
          >
            Book another table
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-valley-ink/60 mb-2">
                Full name
              </label>

              <input
                name="name"
                type="text"
                value={nameValue}
                onChange={handleNameChange}
                required
                className="w-full border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none"
              />
            </div>

            <Field
              label="Email address"
              name="email"
              type="email"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-valley-ink/60 mb-2">
                Mobile number
              </label>

              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                value={phoneValue}
                onChange={handlePhoneChange}
                maxLength={15}
                required
                className="w-full border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none"
              />
            </div>

            <Field
              label="Number of guests"
              name="guests"
              type="number"
              min="1"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Date"
              name="date"
              type="date"
              required
            />

            <Field
              label="Time"
              name="time"
              type="time"
              required
            />
          </div>

          <Field
            label="Occasion (optional)"
            name="occasion"
          />

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
            <p
              className="text-sm text-red-700"
              role="alert"
            >
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

        <form
          onSubmit={checkStatus}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            value={lookup}
            onChange={(e) => {
              setLookup(e.target.value.toUpperCase());
              setLookupError("");
            }}
            placeholder="GVR-XXXXXX"
            className="flex-1 border border-valley-ink/20 rounded-sm px-4 py-3 bg-valley-paper focus:border-valley-gold outline-none font-mono"
          />

          <button
            type="submit"
            disabled={lookupBusy}
            className="border border-valley-ink/20 font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:border-valley-gold transition-colors disabled:opacity-60"
          >
            {lookupBusy ? "Checking…" : "Check status"}
          </button>
        </form>

        {lookupError ? (
          <p
            className="mt-3 text-sm text-red-700"
            role="alert"
          >
            {lookupError}
          </p>
        ) : null}

        {lookupResult ? (
          <div className="mt-4 rounded-sm border border-valley-gold/40 bg-valley-ivory p-5">
            <p className="font-display text-lg">
              {lookupResult.status === "accepted"
                ? "Your reservation is confirmed"
                : lookupResult.status === "declined"
                ? "Sorry, we could not confirm this reservation"
                : "Reservation request received"}
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-y-3 text-sm text-valley-ink/80">
              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Reference
              </dt>

              <dd className="font-mono">
                {lookupResult.reference}
              </dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Name
              </dt>

              <dd>{lookupResult.customer_name}</dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Guests
              </dt>

              <dd>{lookupResult.guests}</dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Date
              </dt>

              <dd>{lookupResult.reserve_date}</dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Time
              </dt>

              <dd>
                {String(lookupResult.reserve_time).slice(0, 5)}
              </dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Table
              </dt>

              <dd>Table {lookupResult.table_number}</dd>

              <dt className="font-mono uppercase text-xs text-valley-ink/50">
                Status
              </dt>

              <dd className="capitalize">
                {lookupResult.status}
              </dd>
            </dl>

            {lookupResult.admin_message ? (
              <p className="mt-3 text-sm text-valley-ink/80">
                {lookupResult.admin_message}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  min,
}) {
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