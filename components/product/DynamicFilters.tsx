"use client";

import { useMemo } from "react";

export default function DynamicFilters({
  products,
  filters,
  setFilters,
}: {
  products: any[];
  filters: any;
  setFilters: (value: any) => void;
}) {
  const availableFilters = useMemo(() => {
    const attributes: Record<string, Set<string>> = {};

    products.forEach((product) => {
      const attrs = product.attributes || {};

      Object.entries(attrs).forEach(([key, value]) => {
        if (!attributes[key]) {
          attributes[key] = new Set();
        }

        if (value) {
          attributes[key].add(String(value));
        }
      });

      if (product.brand) {
        if (!attributes.brand) {
          attributes.brand = new Set();
        }

        attributes.brand.add(product.brand);
      }
    });

    return Object.entries(attributes).map(([key, values]) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      values: [...values],
    }));
  }, [products]);

  function toggleFilter(key: string, value: string) {
    const current = filters[key] || [];

    const next = current.includes(value)
      ? current.filter((x: string) => x !== value)
      : [...current, value];

    setFilters({
      ...filters,
      [key]: next,
    });
  }

  return (
    <div className="space-y-4">
      {availableFilters.map((filter) => (
        <div
          key={filter.key}
          className="rounded-2xl border bg-white p-4"
        >
          <h3 className="mb-3 font-black">
            {filter.label}
          </h3>

          <div className="space-y-2">
            {filter.values.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={
                    filters[filter.key]?.includes(value) ||
                    false
                  }
                  onChange={() =>
                    toggleFilter(filter.key, value)
                  }
                />

                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}