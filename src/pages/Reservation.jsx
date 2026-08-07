import { useState } from "react";

export default function Reservation() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire this up to a real backend (Formspree, EmailJS, or your own API)
    // before launch — right now this only confirms in the UI.
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">Reservation</p>
      <h1 className="font-display text-4xl md:text-5xl mb-8">Reserve a table.</h1>

      {submitted ? (
        <div className="bg-valley-ivory border border-valley-gold/40 rounded-sm p-8">
          <p className="font-display text-xl mb-2">Request received.</p>
          <p className="text-valley-ink/70">
            We'll call you shortly to confirm your table at Green Valley.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" name="name" required />
            <Field label="Phone number" name="phone" type="tel" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Date" name="date" type="date" required />
            <Field label="Time" name="time" type="time" required />
          </div>
          <Field label="Number of guests" name="guests" type="number" min="1" required />
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
          <button
            type="submit"
            className="bg-valley-forest text-valley-ivory font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-valley-ink transition-colors"
          >
            Request reservation
          </button>
        </form>
      )}
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
