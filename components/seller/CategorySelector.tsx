"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parent_id: string;
  isLeaf: boolean;
};

export default function CategorySelector({
  selectedCategory,
  setSelectedCategory,
  setCategorySlug,
}: {
  selectedCategory: any;
  setSelectedCategory: (value: any) => void;
  setCategorySlug: (slug: string) => void;
}) {
  const [level1, setLevel1] = useState<Category[]>([]);
  const [level2, setLevel2] = useState<Category[]>([]);
  const [level3, setLevel3] = useState<Category[]>([]);

  const [root, setRoot] = useState<Category | null>(null);
  const [node, setNode] = useState<Category | null>(null);
  const [leaf, setLeaf] = useState<Category | null>(null);

  async function loadRootCategories() {
    const res = await fetch("/api/admin/categories?level=1");
    const data = await res.json();

    if (data.success) {
      setLevel1(data.categories || []);
    }
  }

  async function loadChildren(parentId: string) {
    const res = await fetch(
      `/api/admin/categories?parent_id=${parentId}`
    );

    return await res.json();
  }

  useEffect(() => {
    loadRootCategories();
  }, []);

  async function selectRoot(category: Category) {
    setRoot(category);
    setNode(null);
    setLeaf(null);

    setLevel3([]);

    const data = await loadChildren(category._id);

    setLevel2(data.categories || []);
  }

  async function selectNode(category: Category) {
    setNode(category);
    setLeaf(null);

    const data = await loadChildren(category._id);

    setLevel3(data.categories || []);
  }

  function selectLeaf(category: Category) {
    setLeaf(category);

    setSelectedCategory(category);

    setCategorySlug(category.slug);
  }

  return (
    <div className="rounded-3xl border bg-white p-5">
      <h2 className="mb-4 text-xl font-black">
        Category Selection
      </h2>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEVEL 1 */}

        <div className="rounded-2xl border">
          <div className="border-b bg-gray-50 p-3 font-bold">
            Main Category
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {level1.map((item) => (
              <button
                key={item._id}
                onClick={() => selectRoot(item)}
                className={`block w-full border-b p-3 text-left transition ${
                  root?._id === item._id
                    ? "bg-blue-50 font-bold text-blue-700"
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* LEVEL 2 */}

        <div className="rounded-2xl border">
          <div className="border-b bg-gray-50 p-3 font-bold">
            Sub Category
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {level2.map((item) => (
              <button
                key={item._id}
                onClick={() => selectNode(item)}
                className={`block w-full border-b p-3 text-left transition ${
                  node?._id === item._id
                    ? "bg-blue-50 font-bold text-blue-700"
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* LEVEL 3 */}

        <div className="rounded-2xl border">
          <div className="border-b bg-gray-50 p-3 font-bold">
            Product Category
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {level3.map((item) => (
              <button
                key={item._id}
                onClick={() => selectLeaf(item)}
                className={`block w-full border-b p-3 text-left transition ${
                  leaf?._id === item._id
                    ? "bg-green-50 font-bold text-green-700"
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {leaf && (
        <div className="mt-5 rounded-2xl border border-green-300 bg-green-50 p-4">
          <p className="font-bold text-green-700">
            Selected Category
          </p>

          <p className="mt-1 text-sm">
            {root?.name} → {node?.name} → {leaf?.name}
          </p>
        </div>
      )}
    </div>
  );
}