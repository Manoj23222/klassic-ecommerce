"use client";

import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parent_id: string;
  path: string[];
  isLeaf: boolean;
  status: string;
  commissionRate?: number;
  image?: string;
  description?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isLeaf, setIsLeaf] = useState(false);
  const [commissionRate, setCommissionRate] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();

    if (data.success) {
      setCategories(data.categories || []);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function createCategory() {
    if (!name.trim()) {
      toast.error("Category name required");
      return;
    }

    const parent = categories.find((c) => c._id === parentId);
    const level = parent ? parent.level + 1 : 1;
    const path = parent ? [...parent.path, name.trim()] : [name.trim()];

    setLoading(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        slug: slugify(path.join("-")),
        level,
        parent_id: parentId,
        path,
        isLeaf,
        status,
        image,
        description,
        commissionRate: Number(commissionRate || 0),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Category created");
      setName("");
      setParentId("");
      setIsLeaf(false);
      setCommissionRate("");
      setStatus("Active");
      setImage("");
      setDescription("");
      loadCategories();
    } else {
      toast.error(data.message || "Create failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white">
          <h1 className="text-2xl font-black md:text-4xl">
            Category Management
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Category tree, leaf category and commission rate manager.
          </p>
        </div>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Create Category</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Category Name" value={name} setValue={setName} />

            <label>
              <span className="mb-1 block text-sm font-bold">
                Parent Category
              </span>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full rounded-2xl border p-3"
              >
                <option value="">Root Category</option>
                {sortedCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {"— ".repeat(cat.level - 1)}
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Commission Rate %"
              value={commissionRate}
              setValue={setCommissionRate}
              type="number"
            />

            <label>
              <span className="mb-1 block text-sm font-bold">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border p-3"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>

            <Input label="Image URL" value={image} setValue={setImage} />

            <button
              type="button"
              onClick={() => setIsLeaf(!isLeaf)}
              className={`rounded-2xl border p-3 text-left font-bold ${
                isLeaf
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              Leaf Category: {isLeaf ? "Yes" : "No"}
            </button>

            <div className="md:col-span-3">
              <Textarea
                label="Description"
                value={description}
                setValue={setDescription}
              />
            </div>

            <button
              onClick={createCategory}
              disabled={loading}
              className="rounded-2xl bg-blue-600 p-3 font-black text-white md:col-span-3"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Category Tree</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3">Category</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Leaf</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Path</th>
                </tr>
              </thead>

              <tbody>
                {sortedCategories.map((cat) => (
                  <tr key={cat._id} className="border-b text-sm">
                    <td className="p-3 font-bold">
                      {"— ".repeat(cat.level - 1)}
                      {cat.name}
                    </td>

                    <td className="p-3 text-gray-500">{cat.slug}</td>
                    <td className="p-3">{cat.level}</td>

                    <td className="p-3">
                      {cat.isLeaf ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                          No
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-black text-blue-700">
                      {Number(cat.commissionRate || 0)}%
                    </td>

                    <td className="p-3">{cat.status}</td>

                    <td className="p-3 text-gray-500">
                      {cat.path?.join(" → ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border p-3"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border p-3"
      />
    </label>
  );
}