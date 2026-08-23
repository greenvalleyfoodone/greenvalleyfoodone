import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const RESTAURANT_PHONE = "+919866255533";

/* ============================================
   Canvas slip generator — zero dependencies
   ============================================ */
function generateSlipCanvas(booking) {
  const width = 600;
  const lineHeight = 52;
  const headerH = 150;
  const refH = 110;
  const footerH = 120;
  const detailCount = 8;
  const detailsH = detailCount * lineHeight + 32;
  const height = headerH + refH + detailsH + footerH;

  const canvas = document.createElement("canvas");
  const scale = 2; // retina crispness
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // --- Background ---
  ctx.fillStyle = "#FAF8F3";
  ctx.fillRect(0, 0, width, height);

  // --- Gold border ---
  ctx.strokeStyle = "#C7A339";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, width - 3, height - 3);

  // --- Header ---
  ctx.fillStyle = "#1F3A2A";
  ctx.fillRect(3, 3, width - 6, headerH - 6);

  // Top accent line
  ctx.fillStyle = "rgba(199,163,57,0.45)";
  ctx.fillRect(3, 3, width - 6, 3);

  // Title
  ctx.fillStyle = "#C7A339";
  ctx.font = "600 28px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText("GREEN VALLEY", width / 2, 58);

  // Subtitle
  ctx.fillStyle = "rgba(246,241,231,0.7)";
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText("Food One · Santhamaguluru", width / 2, 84);

  // Badge background
  const badgeW = 164;
  const badgeH = 30;
  const badgeX = (width - badgeW) / 2;
  const badgeY = 100;
  ctx.strokeStyle = "rgba(199,163,57,0.5)";
  ctx.lineWidth = 1;
  ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH);

  // Green dot
  ctx.fillStyle = "#4ade80";
  ctx.beginPath();
  ctx.arc(badgeX + 18, badgeY + 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Badge text
  ctx.fillStyle = "#C7A339";
  ctx.font = "700 10px Inter, system-ui, sans-serif";
  ctx.fillText("TABLE RESERVED", width / 2 + 5, badgeY + 19);

  // --- Reference Section ---
  ctx.fillStyle = "#F5F2EA";
  ctx.fillRect(3, headerH, width - 6, refH);

  ctx.fillStyle = "#8a8279";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Reservation Reference", width / 2, headerH + 32);

  ctx.fillStyle = "#1F3A2A";
  ctx.font = "600 38px Georgia, serif";
  ctx.fillText(booking.reference, width / 2, headerH + 78);

  // --- Details ---
  let y = headerH + refH + 24;
  const items = [
    { label: "Name", value: booking.customer_name },
    { label: "Email", value: booking.customer_email },
    { label: "Mobile", value: booking.phone },
    { label: "Guests", value: String(booking.guests) },
    { label: "Date", value: booking.reserve_date },
    {
      label: "Time",
      value: String(booking.reserve_time).slice(0, 5),
    },
    {
      label: "Table",
      value: `Table ${booking.table_number}`,
      bold: true,
    },
    { label: "Status", value: "RESERVED", status: true },
  ];

  items.forEach((item, i) => {
    // Label
    ctx.textAlign = "left";
    ctx.fillStyle = "#8a8279";
    ctx.font = "10px monospace";
    ctx.fillText(item.label.toUpperCase(), 40, y + 20);

    // Value (with truncation for long emails/names)
    ctx.textAlign = "right";
    let val = String(item.value);
    if (item.status) {
      ctx.fillStyle = "#166534";
      ctx.font = "700 12px Inter, sans-serif";
    } else if (item.bold) {
      ctx.fillStyle = "#20241F";
      ctx.font = "600 13px Inter, sans-serif";
    } else {
      ctx.fillStyle = "#20241F";
      ctx.font = "500 13px Inter, sans-serif";
    }

    const maxTextW = 280;
    let measured = ctx.measureText(val).width;
    while (measured > maxTextW && val.length > 3) {
      val = val.slice(0, -1);
      measured = ctx.measureText(val + "...").width;
    }
    if (val !== String(item.value)) val += "...";
    ctx.fillText(val, width - 40, y + 20);

    // Dashed separator
    if (i < items.length - 1) {
      ctx.strokeStyle = "rgba(31,58,42,0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, y + 38);
      ctx.lineTo(width - 40, y + 38);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    y += lineHeight;
  });

  // --- Footer ---
  ctx.fillStyle = "#F5F2EA";
  ctx.fillRect(3, height - footerH, width - 6, footerH - 3);

  ctx.textAlign = "center";
  ctx.fillStyle = "#6f645b";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("Green Valley Food One", width / 2, height - footerH + 32);
  ctx.fillText(
    "4XRH+3GM, Santhamaguluru, Andhra Pradesh 522603",
    width / 2,
    height - footerH + 52
  );
  ctx.fillText("Phone: 98662 55533", width / 2, height - footerH + 72);

  ctx.fillStyle = "#9a968a";
  ctx.font = "700 10px monospace";
  ctx.fillText(
    "Please show this slip on arrival",
    width / 2,
    height - footerH + 98
  );

  return canvas;
}

/* ============================================
   Component
   ============================================ */
export default function Reservation() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const [nameValue, setNameValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  function handleNameChange(e) {
    const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setNameValue(cleaned);
  }

  function handlePhoneChange(e) {
    const cleaned = e.target.value.replace(/[^0-9]/g, "");
    setPhoneValue(cleaned);
  }

  function handleDownloadImage() {
    if (!booking) return;
    const canvas = generateSlipCanvas(booking);
    const link = document.createElement("a");
    link.download = `GreenValley-${booking.reference}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function startNewBooking() {
    setBooking(null);
    setError("");
    setNameValue("");
    setPhoneValue("");
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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.customer_email)) {
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

    const { data, error: err } = await supabase.rpc("create_reservation", {
      p_name: payload.customer_name,
      p_email: payload.customer_email,
      p_phone: payload.phone,
      p_guests: payload.guests,
      p_date: payload.reserve_date,
      p_time: payload.reserve_time,
      p_occasion: payload.occasion,
      p_notes: payload.notes,
    });

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
      window.localStorage.setItem("gv_reservation_ref", row.reference);
    } catch {
      // ignore
    }

    e.currentTarget.reset();
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
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadImage}
              className="inline-flex items-center gap-2 bg-valley-forest text-valley-ivory font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-valley-ink transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Slip
            </button>

            <button
              type="button"
              onClick={startNewBooking}
              className="border border-valley-ink/20 font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm hover:border-valley-gold transition-colors text-valley-ink"
            >
              Book another table
            </button>
          </div>

          {/* Elegant Slip Card */}
          <div className="bg-white border-2 border-valley-gold/60 rounded-xl overflow-hidden shadow-2xl max-w-md mx-auto">
            {/* Header */}
            <div className="bg-valley-forest text-center py-8 px-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-valley-gold/50" />
              <h2 className="font-display text-[28px] text-valley-gold tracking-[0.12em]">
                GREEN VALLEY
              </h2>
              <p className="text-valley-ivory/70 text-[11px] uppercase tracking-[0.25em] mt-2 font-medium">
                Food One · Santhamaguluru
              </p>
              <div className="mt-5 inline-flex items-center gap-2 border border-valley-gold/50 rounded-full px-5 py-1.5 bg-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-valley-gold text-[10px] uppercase tracking-[0.2em] font-bold">
                  Table Reserved
                </span>
              </div>
            </div>

            {/* Reference */}
            <div className="text-center py-7 bg-valley-ivory/40 border-b border-valley-gold/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-valley-ink/40 mb-1">
                Reservation Reference
              </p>
              <p className="font-display text-[40px] text-valley-forest tracking-wider leading-none">
                {booking.reference}
              </p>
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <div className="space-y-1">
                {[
                  { label: "Name", value: booking.customer_name },
                  { label: "Email", value: booking.customer_email },
                  { label: "Mobile", value: booking.phone },
                  { label: "Guests", value: booking.guests },
                  { label: "Date", value: booking.reserve_date },
                  {
                    label: "Time",
                    value: String(booking.reserve_time).slice(0, 5),
                  },
                  {
                    label: "Table",
                    value: `Table ${booking.table_number}`,
                    bold: true,
                  },
                  { label: "Status", value: "RESERVED", status: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center border-b border-valley-ink/5 py-3 last:border-0"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-valley-ink/40">
                      {item.label}
                    </span>
                    <span
                      className={`text-sm text-right ${
                        item.bold
                          ? "font-semibold text-valley-ink"
                          : item.status
                          ? "font-bold text-green-700 uppercase tracking-wider text-xs"
                          : "text-valley-ink"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-valley-forest/5 border-t border-valley-gold/20 p-5 text-center">
              <p className="text-[11px] text-valley-ink/60 leading-relaxed">
                Green Valley Food One
                <br />
                4XRH+3GM, Santhamaguluru, Andhra Pradesh 522603
                <br />
                <a
                  href={`tel:${RESTAURANT_PHONE}`}
                  className="hover:text-valley-clay transition-colors"
                >
                  98662 55533
                </a>
              </p>
              <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.15em] text-valley-ink/30">
                Please show this slip on arrival
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Field label="Date" name="date" type="date" required />
            <Field label="Time" name="time" type="time" required />
          </div>

          <Field label="Occasion (optional)" name="occasion" />

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
    </div>
  );
}

function Field({ label, name, type = "text", required = false, min }) {
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