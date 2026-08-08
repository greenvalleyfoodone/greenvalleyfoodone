import { useEffect, useRef } from "react";
import type { ReceiptData } from "@/lib/pos";
import Receipt from "./Receipt";

/**
 * Print preview modal: cashier can look at the receipt, print it, or cancel.
 * Printing uses the browser print system (window.print) with @media print CSS
 * that hides the POS interface and prints the 80mm receipt only.
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handlePrint() {
    try {
      window.print();
    } catch {
      window.alert("Printing failed. Check that a printer is installed in Windows, then try again.");
    }
  }

  return (
    <div className="no-print fixed inset-0 z-[100] flex items-start justify-center overflow-auto bg-black/60 p-6">
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

        <div className="max-h-[65vh] overflow-auto bg-slate-100 p-4">
          <div className="mx-auto w-[302px] bg-white p-3 shadow print-area">
            <Receipt data={data} />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-3">
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
  );
}
