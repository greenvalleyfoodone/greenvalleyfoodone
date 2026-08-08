import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBill, fetchBills, fetchReceipt, money, type ReceiptData } from "@/lib/pos";
import { useStaff } from "@/lib/useStaff";
import PrintPreview from "@/components/pos/PrintPreview";

export const Route = createFileRoute("/bill/history")({ component: HistoryPage });

function HistoryPage() {
  const { isAdmin } = useStaff();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const billsQuery = useQuery({
    queryKey: ["pos", "bills", { search, date, method, status }],
    queryFn: () => fetchBills({ search, date, method, status }),
  });

  async function openReceipt(billId: string) {
    try {
      setReceipt(await fetchReceipt(billId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load the bill");
    }
  }

  async function doCancel(billId: string, billNumber: string) {
    const reason = window.prompt(`Reason for cancelling ${billNumber}?`);
    if (!reason) return;
    try {
      await cancelBill(billId, reason);
      toast.success(`${billNumber} cancelled (record kept for audit).`);
      void queryClient.invalidateQueries({ queryKey: ["pos", "bills"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel the bill");
    }
  }

  const bills = billsQuery.data ?? [];

  return (
    <div className="no-print p-4">
      <div className="flex flex-wrap items-end gap-2 rounded-lg bg-white p-3 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Bill number…"
          className="h-10 rounded-md border border-slate-300 px-3 text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 rounded-md border border-slate-300 px-3 text-sm"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="h-10 rounded-md border border-slate-300 px-2 text-sm"
        >
          <option value="all">All payments</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-md border border-slate-300 px-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setDate("");
            setMethod("all");
            setStatus("all");
          }}
          className="h-10 rounded-md border border-slate-300 px-3 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg bg-white shadow-sm">
        {billsQuery.isLoading ? (
          <p className="p-8 text-center text-slate-500">Loading bills…</p>
        ) : billsQuery.isError ? (
          <p className="p-8 text-center text-red-700" role="alert">
            {(billsQuery.error as Error).message}
          </p>
        ) : bills.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No bills found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Bill</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Table</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bills.map((b) => {
                const d = new Date(b.created_at);
                return (
                  <tr key={b.id} className={b.status === "cancelled" ? "text-slate-400" : ""}>
                    <td className="px-3 py-2 font-semibold">{b.bill_number}</td>
                    <td className="px-3 py-2">{d.toLocaleDateString("en-IN")}</td>
                    <td className="px-3 py-2">
                      {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2">
                      {b.order_type === "takeaway" ? "Takeaway" : (b.table_label ?? "—")}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">{money(b.total)}</td>
                    <td className="px-3 py-2 uppercase">
                      {b.payment_method} · {b.payment_status}
                    </td>
                    <td className="px-3 py-2 capitalize">{b.status}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => openReceipt(b.id)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        View / Reprint
                      </button>
                      {isAdmin && b.status === "active" ? (
                        <button
                          onClick={() => doCancel(b.id, b.bill_number)}
                          className="ml-2 rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {receipt ? (
        <PrintPreview
          data={receipt}
          title={`Reprint ${receipt.bill.bill_number}`}
          onClose={() => setReceipt(null)}
        />
      ) : null}
    </div>
  );
}
