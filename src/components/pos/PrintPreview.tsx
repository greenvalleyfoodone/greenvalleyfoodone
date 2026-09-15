import { useEffect, useRef } from "react";
import type { ReceiptData } from "@/lib/pos";
import Receipt from "./Receipt";

/**
 * Print preview modal. One click on Print sends exactly the number of identical
 * slips set in Receipt settings — no page range typing needed.
 */
export default function PrintPreview({
  data,
  onClose,
  title = "Receipt preview",
}: {
  data: ReceiptData;
  onClose: () => void;
  title?: string;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const paper = 80;
  const copies = 1;
  const printWidth = 72;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Paper size is a per-print setting, so it is injected while the preview is open.
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-receipt-page", "true");
    style.textContent = `@media print { @page { size: ${paper}mm auto; margin: 3mm; } html, body { width: ${paper}mm; } .print-area { width: ${printWidth}mm !important; } }`;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [paper, printWidth]);

  function handlePrint() {
    try {
      window.print();
    } catch {
      window.alert("Printing failed. Check that a printer is installed, then try again.");
    }
  }

  const slips = Array.from({ length: copies });

  return (
    <>
      {/* Printed output: identical slips, one per copy. */}
      <div className="print-area" aria-hidden="true">
        {slips.map((_, i) => (
          <div key={i} className={i < copies - 1 ? "receipt-slip receipt-break" : "receipt-slip"}>
            <Receipt data={data} />
          </div>
        ))}
      </div>

      <div className="no-print fixed inset-0 z-[100] flex items-start justify-center overflow-auto bg-black/60 p-4 sm:p-6">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[60vh] overflow-auto bg-slate-100 p-4">
            <div
              className="mx-auto bg-white p-3 shadow"
              style={{ width: `${Math.round(printWidth * 3.78)}px` }}
            >
              <Receipt data={data} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
            <span className="text-xs text-slate-500">
              1 slip · 80mm paper
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
