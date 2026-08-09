import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/lib/useStaff";
import { loadMenuTree } from "@/lib/siteMenu";

export const Route = createFileRoute("/bill/menu")({ component: MenuAdminPage });

type Category = {
  id: string;
  side: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  side: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
};

const emptyItem = (side: string, category: string) => ({
  id: "",
  name: "",
  category,
  price: 0,
  side,
  description: "",
  image_url: "",
  sort_order: 0,
  is_available: true,
});

function MenuAdminPage() {
  const { isAdmin, loading } = useStaff();
  const qc = useQueryClient();
  const [side, setSide] = useState<"cafe" | "restaurant">("cafe");
  const [editing, setEditing] = useState<Item | null>(null);
  const [newCat, setNewCat] = useState({ slug: "", name: "", image_url: "" });

  const catsQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("side")
        .order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const itemsQuery = useQuery({
    queryKey: ["admin", "items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data as Item[];
    },
  });

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["admin"] });
    void qc.invalidateQueries({ queryKey: ["pos", "menu"] });
    void loadMenuTree(true);
  }

  if (loading) return <p className="p-8 text-slate-500">Loading…</p>;
  if (!isAdmin) return <p className="p-8 text-slate-600">Administrators only.</p>;

  const cats = (catsQuery.data ?? []).filter((c) => c.side === side);
  const items = (itemsQuery.data ?? []).filter((i) => i.side === side);

  async function saveItem() {
    if (!editing) return;
    const payload = {
      name: editing.name.trim(),
      category: editing.category,
      price: Number(editing.price),
      side: editing.side,
      description: editing.description || null,
      image_url: editing.image_url || null,
      sort_order: Number(editing.sort_order) || 0,
      is_available: editing.is_available,
    };
    if (!payload.name || !payload.category) {
      toast.error("Name and category are required.");
      return;
    }
    const { error } = editing.id
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved — the website is updated.");
    setEditing(null);
    refresh();
  }

  async function removeItem(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from the menu?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Item removed.");
    refresh();
  }

  async function addCategory() {
    const slug = newCat.slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug || !newCat.name.trim()) {
      toast.error("Category name and slug are required.");
      return;
    }
    const { error } = await supabase.from("menu_categories").insert({
      side,
      slug,
      name: newCat.name.trim(),
      image_url: newCat.image_url || null,
      sort_order: cats.length + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewCat({ slug: "", name: "", image_url: "" });
    toast.success("Category added.");
    refresh();
  }

  async function updateCategory(c: Category, patch: Partial<Category>) {
    const { error } = await supabase.from("menu_categories").update(patch).eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  return (
    <div className="no-print p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["cafe", "restaurant"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${
              side === s ? "bg-emerald-700 text-white" : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => setEditing(emptyItem(side, cats[0]?.slug ?? ""))}
          className="ml-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          + Add item
        </button>
      </div>

      <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">Categories</h2>
        <div className="mt-3 grid gap-2">
          {cats.map((c) => (
            <div key={c.id} className="grid gap-2 border-b pb-2 sm:grid-cols-[1fr_2fr_auto]">
              <input
                defaultValue={c.name}
                onBlur={(e) => e.target.value !== c.name && updateCategory(c, { name: e.target.value })}
                className="h-10 rounded-md border border-slate-300 px-3 text-sm"
              />
              <input
                defaultValue={c.image_url ?? ""}
                placeholder="Picture URL"
                onBlur={(e) =>
                  e.target.value !== (c.image_url ?? "") &&
                  updateCategory(c, { image_url: e.target.value || null })
                }
                className="h-10 rounded-md border border-slate-300 px-3 text-sm"
              />
              <button
                onClick={() => updateCategory(c, { is_active: !c.is_active })}
                className="h-10 rounded-md border border-slate-300 px-3 text-xs"
              >
                {c.is_active ? "Visible" : "Hidden"}
              </button>
            </div>
          ))}
          <div className="grid gap-2 pt-2 sm:grid-cols-[1fr_1fr_2fr_auto]">
            <input
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="New category name"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <input
              value={newCat.slug}
              onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
              placeholder="url-slug"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <input
              value={newCat.image_url}
              onChange={(e) => setNewCat({ ...newCat, image_url: e.target.value })}
              placeholder="Picture URL"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            />
            <button
              onClick={addCategory}
              className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="mt-3 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2">On website</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {i.image_url ? (
                      <img src={i.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : null}
                    <span className="font-medium">{i.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-500">{i.category}</td>
                <td className="px-3 py-2 text-right">₹{Number(i.price)}</td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={i.is_available}
                    onChange={async (e) => {
                      await supabase
                        .from("menu_items")
                        .update({ is_available: e.target.checked })
                        .eq("id", i.id);
                      refresh();
                    }}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setEditing({ ...i, description: i.description ?? "", image_url: i.image_url ?? "" })}
                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeItem(i.id, i.name)}
                    className="ml-2 rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-lg rounded-t-xl bg-white p-4 sm:rounded-xl">
            <h3 className="text-base font-bold">{editing.id ? "Edit item" : "New item"}</h3>
            <div className="mt-3 grid gap-3">
              <label className="text-sm">
                <span className="font-medium text-slate-700">Name</span>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="font-medium text-slate-700">Side</span>
                  <select
                    value={editing.side}
                    onChange={(e) => setEditing({ ...editing, side: e.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-2"
                  >
                    <option value="cafe">Cafe</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-700">Category</span>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-2"
                  >
                    {(catsQuery.data ?? [])
                      .filter((c) => c.side === editing.side)
                      .map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="font-medium text-slate-700">Price (₹)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-700">Order</span>
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                  />
                </label>
              </div>
              <label className="text-sm">
                <span className="font-medium text-slate-700">Picture URL</span>
                <input
                  value={editing.image_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
                />
              </label>
              <label className="text-sm">
                <span className="font-medium text-slate-700">Description</span>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                  rows={2}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_available}
                  onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })}
                />
                Show on the website
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={saveItem}
                className="flex-1 rounded-md bg-emerald-700 py-2.5 text-sm font-semibold text-white"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md border border-slate-300 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
