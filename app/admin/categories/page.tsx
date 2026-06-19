"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parent_id?: string | null;
  path?: string[];
  isLeaf?: boolean;
  status?: string;
  commissionRate?: number;
  image?: string;
  description?: string;
  sortOrder?: number;
};

const emptyForm = {
  name: "",
  description: "",
  image: "",
  status: "Active",
  commissionRate: "",
  sortOrder: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [isRoot, setIsRoot] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        toast.error(data.message || "Categories load failed");
      }
    } catch {
      toast.error("Categories load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const childrenMap = useMemo(() => {
    const map: Record<string, Category[]> = {};

    categories.forEach((cat) => {
      const parentKey = cat.parent_id || "root";
      if (!map[parentKey]) map[parentKey] = [];
      map[parentKey].push(cat);
    });

    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => {
        const orderA = Number(a.sortOrder || 0);
        const orderB = Number(b.sortOrder || 0);
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
    });

    return map;
  }, [categories]);

  const selectedParent = useMemo(() => {
    if (isRoot || selectedPath.length === 0) return null;
    return categories.find((cat) => cat._id === selectedPath[selectedPath.length - 1]) || null;
  }, [categories, isRoot, selectedPath]);

  const parentBreadcrumb = useMemo(() => {
    if (isRoot) return "None (This is a Root Category)";

    const names = selectedPath
      .map((id) => categories.find((cat) => cat._id === id)?.name)
      .filter(Boolean);

    return names.length ? names.join(" → ") : "Please select parent category";
  }, [categories, isRoot, selectedPath]);

  const previewSlug = slugify(form.name);
  const previewLevel = isRoot ? 1 : selectedParent ? Number(selectedParent.level || 1) + 1 : 0;

  const previewBreadcrumb = useMemo(() => {
    if (!form.name.trim()) return parentBreadcrumb;
    if (isRoot) return form.name.trim();
    return selectedParent ? `${parentBreadcrumb} → ${form.name.trim()}` : parentBreadcrumb;
  }, [form.name, isRoot, parentBreadcrumb, selectedParent]);

  function resetForm() {
    setForm(emptyForm);
    setIsRoot(true);
    setSelectedPath([]);
    setEditingId(null);
  }

  function handlePathChange(levelIndex: number, value: string) {
    const next = selectedPath.slice(0, levelIndex);
    if (value) next[levelIndex] = value;
    setSelectedPath(next);
  }

  function startEdit(cat: Category) {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      status: cat.status || "Active",
      commissionRate: cat.commissionRate?.toString() || "",
      sortOrder: cat.sortOrder?.toString() || "",
    });

    if (cat.parent_id) {
      setIsRoot(false);
      const parentChain: string[] = [];
      let currentParentId: string | null | undefined = cat.parent_id;

      while (currentParentId) {
        const parent = categories.find((x) => x._id === currentParentId);
        if (!parent) break;
        parentChain.unshift(parent._id);
        currentParentId = parent.parent_id;
      }

      setSelectedPath(parentChain);
    } else {
      setIsRoot(true);
      setSelectedPath([]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!isRoot && !selectedParent) {
      toast.error("Please select parent hierarchy");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: previewSlug,
      description: form.description.trim(),
      image: form.image.trim(),
      status: form.status,
      commissionRate: Number(form.commissionRate || 0),
      sortOrder: Number(form.sortOrder || 0),
      parent_id: isRoot ? null : selectedParent?._id,
      level: previewLevel,
      path: previewBreadcrumb.split(" → "),
      isLeaf: true,
    };

    try {
      setSaving(true);

      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Save failed");
        return;
      }

      toast.success(editingId ? "Category updated" : "Category created");
      resetForm();
      loadCategories();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Category deleted");
        loadCategories();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  }

  function renderTree(parentId: string | null = null, depth = 0) {
    const list = childrenMap[parentId || "root"] || [];

    return list.map((cat) => (
      <div key={cat._id}>
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div style={{ paddingLeft: depth * 20 }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{cat.parent_id ? "↳" : "📁"}</span>
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                Level {cat.level || 1}
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-gray-500">
              /{cat.slug} • {cat.path?.join(" → ") || cat.name}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startEdit(cat)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold hover:bg-gray-50"
            >
              Edit
            </button>

            <button
              onClick={() => deleteCategory(cat._id)}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-2 space-y-2">{renderTree(cat._id, depth + 1)}</div>
      </div>
    ));
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Category Management</h1>
          <p className="text-sm text-gray-500">
            Luxury cascading hierarchy for root, sub and nested categories.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-sm text-gray-500">
                Parent, level, breadcrumb and slug auto update.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border px-4 py-2 text-sm font-bold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Smartphones"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category Placement *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoot(true);
                    setSelectedPath([]);
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                    isRoot
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  Root Category
                </button>

                <button
                  type="button"
                  onClick={() => setIsRoot(false)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                    !isRoot
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  Sub Category
                </button>
              </div>
            </div>

            {!isRoot && (
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <label className="mb-3 block text-sm font-bold text-gray-700">
                  Select Parent Hierarchy
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[0, 1, 2].map((index) => {
                    const parentId = index === 0 ? "root" : selectedPath[index - 1];
                    const options = childrenMap[parentId] || [];
                    const disabled = index > 0 && !selectedPath[index - 1];

                    return (
                      <select
                        key={index}
                        value={selectedPath[index] || ""}
                        disabled={disabled}
                        onChange={(e) => handlePathChange(index, e.target.value)}
                        className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black ${
                          disabled ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        <option value="">
                          {index === 0
                            ? "1. Select Main Category"
                            : index === 1
                            ? "2. Select Sub Category"
                            : "3. Select Nested Category"}
                        </option>

                        {options.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category Level Info
              </label>
              <div className="min-h-[72px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="font-black text-gray-900">
                  {previewLevel ? `Level ${previewLevel}` : "Pending..."}
                </p>
                <p className="mt-1 text-xs text-gray-500">{previewBreadcrumb}</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Auto Slug
              </label>
              <input
                value={previewSlug}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Commission Rate %
              </label>
              <input
                type="number"
                value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Image URL
              </label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/uploads/category.png"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Category description..."
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={saving}
              className="rounded-2xl bg-black px-7 py-3 text-sm font-black text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>

        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-xl font-black text-gray-900">Category Hierarchy</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories found.</p>
          ) : (
            <div className="space-y-3">{renderTree()}</div>
          )}
        </section>
      </div>
    </main>
  );
}