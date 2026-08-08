import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchMenu, fetchSettings, fetchTables, money, type AppSettings } from "@/lib/pos";
import { useStaff } from "@/lib/useStaff";

export const Route = createFileRoute("/bill/settings")({ component: SettingsPage });

function SettingsPage() {
  const { isAdmin, loading } = useStaff();
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["pos", "settings"], queryFn: fetchSettings });
  const menuQuery = useQuery({ queryKey: ["pos", "menu"], queryFn: fetchMenu });
  const tablesQuery = useQuery({ queryKey: ["pos", "tables"], queryFn: fetchTables });
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
    setSaving(true);
    const { error } = await supabase.from("app_settings").update(form).eq("id", true);
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
