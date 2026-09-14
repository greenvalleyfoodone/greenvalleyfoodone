import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMenu,
  fetchSettings,
  fetchTables,
  money,
  type AppSettings,
  type ReceiptExtraLine,
} from "@/lib/pos";
import { useStaff } from "@/lib/useStaff";

export const Route = createFileRoute("/bill/settings")({ component: SettingsPage });

function SettingsPage() {
  const { isAdmin, loading } = useStaff();
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["pos", "settings"], queryFn: fetchSettings });
  const menuQuery = useQuery({ queryKey: ["pos", "menu"], queryFn: fetchMenu });
  const tablesQuery = useQuery({ queryKey: ["pos", "tables"], queryFn: fetchTables });
  const imagesQuery = useQuery({
    queryKey: ["pos", "site-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("id, key, label, image_url")
        .order("label");
      if (error) throw error;
      return data as { id: string; key: string; label: string; image_url: string | null }[];
    },
  });
  const [form, setForm] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settingsQuery.data && !form) setForm(settingsQuery.data);
  }, [settingsQuery.data, form]);

  if (loading) return <p className="p-8 text-slate-500">Loading…</p>;
  if (!isAdmin) {
    return (
      <p className="p-8 text-slate-600">Only an administrator can change billing settings.</p>
    );
  }

  async function save() {
    if (!form) return;
    if (form.tax_percent < 0 || form.tax_percent > 100) {
      toast.error("Tax percentage must be between 0 and 100.");
      return;
    }
    if (form.copies_per_bill < 1 || form.copies_per_bill > 5) {
      toast.error("Receipt copies must be between 1 and 5.");
      return;
    }
    if (form.receipt_text_size < 9 || form.receipt_text_size > 20) {
      toast.error("Receipt text size must be between 9px and 20px.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      extra_receipt_lines: JSON.stringify(form.extra_receipt_lines),
    };
    const { error } = await supabase.from("app_settings").update(payload).eq("id", true);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved.");
    void queryClient.invalidateQueries({ queryKey: ["pos", "settings"] });
  }

  async function toggleAvailability(id: string, next: boolean) {
    const { error } = await supabase.from("menu_items").update({ is_available: next }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["pos", "menu"] });
  }

  async function setTableStatus(id: string, status: "available" | "occupied" | "reserved") {
    const { error } = await supabase.from("restaurant_tables").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["pos", "tables"] });
  }

  return (
    <div className="no-print grid gap-3 p-4 lg:grid-cols-2">
      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Receipt &amp; tax
        </h2>
        {form ? (
          <div className="mt-3 grid gap-3">
            {(
              [
                ["restaurant_name", "Restaurant name", "text"],
                ["address", "Address", "text"],
                ["phone", "Phone", "text"],
                ["gstin", "GSTIN", "text"],
                ["tax_label", "Tax label (e.g. GST)", "text"],
                ["tax_percent", "Tax percentage", "number"],
                ["max_cashier_discount_percent", "Max cashier discount %", "number"],
                ["receipt_footer", "Receipt footer", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="text-sm">
                <span className="block font-medium text-slate-700">{label}</span>
                <input
                  type={type}
                  step="0.01"
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                />
              </label>
            ))}
            <div className="border-t border-slate-200 pt-3">
              <h3 className="text-sm font-semibold text-slate-700">Receipt output</h3>
              <p className="mt-1 text-xs text-slate-500">
                Print uses these settings automatically. No page ranges are needed.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="block font-medium text-slate-700">Copies per bill</span>
                  <select
                    value={form.copies_per_bill}
                    onChange={(e) =>
                      setForm({ ...form, copies_per_bill: Number(e.target.value) })
                    }
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                  >
                    {[1, 2, 3, 4, 5].map((count) => (
                      <option key={count} value={count}>
                        {count} slip{count === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block font-medium text-slate-700">Paper width</span>
                  <select
                    value={form.paper_width}
                    onChange={(e) => setForm({ ...form, paper_width: e.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                  >
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                    <option value="110mm">110mm</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block font-medium text-slate-700">Receipt text size</span>
                  <input
                    type="number"
                    min={9}
                    max={20}
                    value={form.receipt_text_size}
                    onChange={(e) =>
                      setForm({ ...form, receipt_text_size: Number(e.target.value) })
                    }
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                  />
                </label>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Extra receipt lines</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add address, licence, or other details below the restaurant information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      extra_receipt_lines: [...form.extra_receipt_lines, { label: "", value: "" }],
                    })
                  }
                  className="shrink-0 rounded-md border border-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  + Add line
                </button>
              </div>
              <div className="mt-3 grid gap-2">
                {form.extra_receipt_lines.map((line: ReceiptExtraLine, index: number) => (
                  <div key={`${line.label}-${index}`} className="flex items-center gap-2">
                    <input
                      value={line.label}
                      onChange={(e) => {
                        const next = [...form.extra_receipt_lines];
                        const current = next[index];
                        if (!current) return;
                        next[index] = { label: e.target.value, value: current.value };
                        setForm({ ...form, extra_receipt_lines: next });
                      }}
                      placeholder="Label"
                      className="h-10 w-28 rounded-md border border-slate-300 px-2 text-sm"
                    />
                    <input
                      value={line.value}
                      onChange={(e) => {
                        const next = [...form.extra_receipt_lines];
                        const current = next[index];
                        if (!current) return;
                        next[index] = { label: current.label, value: e.target.value };
                        setForm({ ...form, extra_receipt_lines: next });
                      }}
                      placeholder="Value"
                      className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          extra_receipt_lines: form.extra_receipt_lines.filter(
                            (_: ReceiptExtraLine, lineIndex: number) => lineIndex !== index,
                          ),
                        })
                      }
                      className="h-10 rounded-md border border-red-300 px-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                      aria-label={`Remove receipt line ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {form.extra_receipt_lines.length === 0 ? (
                  <p className="text-xs text-slate-500">No extra lines added.</p>
                ) : null}
              </div>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-emerald-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        ) : (
          <p className="mt-3 text-slate-500">Loading…</p>
        )}
      </section>

      <div className="grid gap-3">
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Website pictures
          </h2>
          <div className="mt-3 grid gap-2">
            {(imagesQuery.data ?? []).map((img) => (
              <div key={img.id} className="grid gap-2 sm:grid-cols-[auto_1fr]">
                <div className="flex items-center gap-2">
                  {img.image_url ? (
                    <img src={img.image_url} alt="" className="h-10 w-16 rounded object-cover" />
                  ) : null}
                  <span className="text-xs font-medium text-slate-600">{img.label}</span>
                </div>
                <input
                  defaultValue={img.image_url ?? ""}
                  placeholder="Picture URL"
                  onBlur={async (e) => {
                    if (e.target.value === (img.image_url ?? "")) return;
                    const { error } = await supabase
                      .from("site_images")
                      .update({ image_url: e.target.value })
                      .eq("id", img.id);
                    if (error) {
                      toast.error(error.message);
                      return;
                    }
                    toast.success("Picture updated on the website.");
                    void queryClient.invalidateQueries({ queryKey: ["pos", "site-images"] });
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                />
              </div>
            ))}
            {(imagesQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No editable pictures configured yet.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">Tables</h2>
          <div className="mt-3 grid gap-1.5">
            {(tablesQuery.data ?? []).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.label}</span>
                <select
                  value={t.status}
                  onChange={(e) =>
                    setTableStatus(t.id, e.target.value as "available" | "occupied" | "reserved")
                  }
                  className="h-9 rounded-md border border-slate-300 px-2"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Menu availability
          </h2>
          <div className="mt-3 max-h-[420px] overflow-auto">
            {(menuQuery.data ?? []).map((m) => (
              <label key={m.id} className="flex items-center justify-between border-b py-1.5 text-sm">
                <span>
                  {m.name}{" "}
                  <span className="text-xs text-slate-500">
                    · {m.category} · {money(Number(m.price))}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={m.is_available}
                  onChange={(e) => toggleAvailability(m.id, e.target.checked)}
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
