import type { ReceiptData } from "@/lib/pos";
import { money } from "@/lib/pos";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

const METHOD_LABEL: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

/** Thermal receipt. Rendered on screen as a preview and alone when printing. */
export default function Receipt({ data }: { data: ReceiptData }) {
  const { bill, items, settings } = data;
  const { date, time } = fmtDate(bill.created_at);
  const base = settings.receipt_font_px || 12;
  const nameSize = settings.receipt_name_font_px || 18;
  const extraLines = Array.isArray(settings.receipt_extra_lines) ? settings.receipt_extra_lines : [];

  return (
    <div className="receipt-80mm" style={{ fontSize: `${base}px`, lineHeight: 1.35 }}>
      <div className="text-center">
        <div
          className="font-bold uppercase leading-tight"
          data-receipt-brand="true"
          style={{ fontSize: `${nameSize}px` }}
        >
          {settings.restaurant_name}
        </div>
        {settings.address ? <div>{settings.address}</div> : null}
        {settings.phone ? <div>Ph: {settings.phone}</div> : null}
        {settings.gstin ? <div>GSTIN: {settings.gstin}</div> : null}
        {extraLines.map((l, i) => (
          <div key={`x-${i}`}>
            {l.label ? `${l.label}: ` : ""}
            {l.value}
          </div>
        ))}
      </div>

      <div className="rc-sep" />

      <div className="flex justify-between">
        <span>Bill: {bill.bill_number}</span>
        <span>{bill.order_type === "takeaway" ? "Takeaway" : bill.table_label}</span>
      </div>
      <div className="flex justify-between">
        <span>{date}</span>
        <span>{time}</span>
      </div>
      {bill.status === "cancelled" ? (
        <div className="mt-1 text-center font-bold">*** CANCELLED ***</div>
      ) : null}

      <div className="rc-sep" />

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={`${it.item_name}-${i}`}>
              <td className="pr-1 align-top">{it.item_name}</td>
              <td className="text-right align-top">{it.quantity}</td>
              <td className="text-right align-top">{Number(it.unit_price).toFixed(2)}</td>
              <td className="text-right align-top">{Number(it.line_total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rc-sep" />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{money(bill.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Discount</span>
        <span>-{money(bill.discount_amount)}</span>
      </div>
      <div className="flex justify-between">
        <span>
          {settings.tax_label} ({Number(bill.tax_percent).toFixed(2)}%)
        </span>
        <span>{money(bill.tax_amount)}</span>
      </div>

      <div className="rc-sep" />

      <div className="flex justify-between font-bold" style={{ fontSize: `${base + 3}px` }}>
        <span>TOTAL</span>
        <span>{money(bill.total)}</span>
      </div>

      <div className="rc-sep" />

      <div>Payment: {METHOD_LABEL[bill.payment_method] ?? bill.payment_method}</div>
      <div>Status: {bill.payment_status === "paid" ? "PAID" : bill.payment_status.toUpperCase()}</div>
      {bill.payment_status === "paid" ? <div>Paid: {money(bill.paid_amount)}</div> : null}

      <div className="rc-sep" />

      <div className="whitespace-pre-line text-center">{settings.receipt_footer}</div>
    </div>
  );
}
