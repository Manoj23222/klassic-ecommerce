"use client";

import { useMemo, useState } from "react";

type ProductType = {
  _id: string;

  attributes?: Record<string, any>;

  attributeMeta?: {
    fieldKey: string;
    fieldName: string;
    filterable?: boolean;
  }[];
};

export default function DynamicFilters({
  products,
  selectedFilters,
  setSelectedFilters,
}: {
  products: ProductType[];

  selectedFilters: Record<string, string[]>;

  setSelectedFilters: (
    filters: Record<string, string[]>
  ) => void;
}) {
  const [openSections, setOpenSections] = useState<
    Record<string, boolean>
  >({});

  const filterGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        label: string;
        values: Set<string>;
      }
    > = {};

    products.forEach((product) => {
      const meta = product.attributeMeta || [];
      const attrs = product.attributes || {};

      meta.forEach((field) => {
        if (!field.filterable) return;

        const value = attrs[field.fieldKey];

        if (!value) return;

        if (!groups[field.fieldKey]) {
          groups[field.fieldKey] = {
            label: field.fieldName,
            values: new Set(),
          };
        }

        groups[field.fieldKey].values.add(
          String(value)
        );
      });
    });

    return Object.entries(groups).map(
      ([fieldKey, item]) => ({
        fieldKey,
        label: item.label,
        values: Array.from(item.values).sort(),
      })
    );
  }, [products]);

  function toggleFilter(
    fieldKey: string,
    value: string
  ) {
    const current =
      selectedFilters[fieldKey] || [];

    const exists =
      current.includes(value);

    setSelectedFilters({
      ...selectedFilters,

      [fieldKey]: exists
        ? current.filter((x) => x !== value)
        : [...current, value],
    });
  }

  function clearFilters() {
    setSelectedFilters({});
  }

  return (
    <aside className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black">
          Filters
        </h3>

        <button
          onClick={clearFilters}
          className="text-xs font-black text-blue-600"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {filterGroups.map((group) => {
          const open =
            openSections[group.fieldKey] ??
            true;

          return (
            <div
              key={group.fieldKey}
              className="overflow-hidden rounded-xl border"
            >
              <button
                onClick={() =>
                  setOpenSections({
                    ...openSections,
                    [group.fieldKey]:
                      !open,
                  })
                }
                className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left"
              >
                <span className="font-black">
                  {group.label}
                </span>

                <span>
                  {open ? "−" : "+"}
                </span>
              </button>

              {open && (
                <div className="space-y-2 p-4">
                  {group.values.map(
                    (value) => {
                      const checked =
                        (
                          selectedFilters[
                            group.fieldKey
                          ] || []
                        ).includes(value);

                      return (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleFilter(
                                group.fieldKey,
                                value
                              )
                            }
                          />

                          <span>
                            {value}
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filterGroups.length === 0 && (
          <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
            No dynamic filters found.
          </div>
        )}
      </div>
    </aside>
  );
}