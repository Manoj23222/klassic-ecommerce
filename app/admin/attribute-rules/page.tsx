"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
  level: number;
  isLeaf: boolean;
};

type Rule = {
  _id?: string;

  fieldName: string;
  fieldKey: string;
  fieldType: string;

  placeholder: string;
  unit: string;

  options: string[];

  required: boolean;
  filterable: boolean;
  searchable: boolean;
  showOnProductPage: boolean;

  sortOrder: number;
};

export default function AttributeRulesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [rules, setRules] = useState<Rule[]>([]);

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();

    if (data.success) {
      setCategories(
        (data.categories || []).filter(
          (x: Category) => x.isLeaf
        )
      );
    }
  }

  async function loadRules(categoryId: string) {
    if (!categoryId) return;

    const res = await fetch(
      `/api/admin/attribute-rules?category_id=${categoryId}`
    );

    const data = await res.json();

    if (data.success) {
      setRules(data.rules || []);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function addField() {
    setRules([
      ...rules,
      {
        fieldName: "",
        fieldKey: "",
        fieldType: "text",

        placeholder: "",
        unit: "",

        options: [],

        required: false,
        filterable: false,
        searchable: true,
        showOnProductPage: true,

        sortOrder: rules.length + 1,
      },
    ]);
  }

  async function saveRule(rule: Rule) {
    if (!selectedCategory) {
      toast.error("Select category");
      return;
    }

    const category = categories.find(
      (c) => c._id === selectedCategory
    );

    const res = await fetch(
      "/api/admin/attribute-rules",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          category_id: selectedCategory,
          category_name: category?.name,

          ...rule,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Rule Saved");
      loadRules(selectedCategory);
    } else {
      toast.error(data.message);
    }
  }

  async function deleteRule(id?: string) {
    if (!id) return;

    const res = await fetch(
      `/api/admin/attribute-rules?id=${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Rule Deleted");
      loadRules(selectedCategory);
    }
  }

  function updateRule(
    index: number,
    key: keyof Rule,
    value: any
  ) {
    const copy = [...rules];

    copy[index] = {
      ...copy[index],
      [key]: value,
    };

    setRules(copy);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Toaster />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white">
          <h1 className="text-3xl font-black">
            Attribute Rules Builder
          </h1>

          <p className="mt-2 text-gray-300">
            Amazon / Flipkart Dynamic Attributes
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                loadRules(e.target.value);
              }}
              className="rounded-2xl border p-3"
            >
              <option value="">
                Select Leaf Category
              </option>

              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={addField}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
            >
              + Add Field
            </button>
          </div>

          <div className="space-y-5">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="rounded-3xl border p-4"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <input
                    placeholder="Field Name"
                    value={rule.fieldName}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "fieldName",
                        e.target.value
                      )
                    }
                    className="rounded-xl border p-3"
                  />

                  <input
                    placeholder="field_key"
                    value={rule.fieldKey}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "fieldKey",
                        e.target.value
                      )
                    }
                    className="rounded-xl border p-3"
                  />

                  <select
                    value={rule.fieldType}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "fieldType",
                        e.target.value
                      )
                    }
                    className="rounded-xl border p-3"
                  >
                    <option value="text">
                      Text
                    </option>

                    <option value="textarea">
                      Textarea
                    </option>

                    <option value="number">
                      Number
                    </option>

                    <option value="dropdown">
                      Dropdown
                    </option>

                    <option value="checkbox">
                      Checkbox
                    </option>

                    <option value="radio">
                      Radio
                    </option>

                    <option value="color">
                      Color
                    </option>

                    <option value="date">
                      Date
                    </option>
                  </select>

                  <input
                    placeholder="Unit"
                    value={rule.unit}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "unit",
                        e.target.value
                      )
                    }
                    className="rounded-xl border p-3"
                  />

                  <input
                    placeholder="Placeholder"
                    value={rule.placeholder}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "placeholder",
                        e.target.value
                      )
                    }
                    className="rounded-xl border p-3 md:col-span-2"
                  />

                  <input
                    placeholder="Options (4GB,8GB,12GB)"
                    value={rule.options.join(",")}
                    onChange={(e) =>
                      updateRule(
                        index,
                        "options",
                        e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                      )
                    }
                    className="rounded-xl border p-3 md:col-span-2"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <Check
                    label="Required"
                    checked={rule.required}
                    onChange={() =>
                      updateRule(
                        index,
                        "required",
                        !rule.required
                      )
                    }
                  />

                  <Check
                    label="Filterable"
                    checked={rule.filterable}
                    onChange={() =>
                      updateRule(
                        index,
                        "filterable",
                        !rule.filterable
                      )
                    }
                  />

                  <Check
                    label="Searchable"
                    checked={rule.searchable}
                    onChange={() =>
                      updateRule(
                        index,
                        "searchable",
                        !rule.searchable
                      )
                    }
                  />

                  <Check
                    label="Show On Product Page"
                    checked={rule.showOnProductPage}
                    onChange={() =>
                      updateRule(
                        index,
                        "showOnProductPage",
                        !rule.showOnProductPage
                      )
                    }
                  />
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      saveRule(rule)
                    }
                    className="rounded-xl bg-green-600 px-5 py-2 font-black text-white"
                  >
                    Save
                  </button>

                  {rule._id && (
                    <button
                      onClick={() =>
                        deleteRule(rule._id)
                      }
                      className="rounded-xl bg-red-600 px-5 py-2 font-black text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      {label}
    </label>
  );
}