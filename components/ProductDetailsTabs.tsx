"use client";

import { useState } from "react";

type Spec = {
  key: string;
  value: string;
};

export default function ProductDetailsTabs({
  description,
  specifications,
  returnPolicy,
}: {
  description?: string;
  specifications?: Spec[];
  returnPolicy?: any;
}) {
  const [active, setActive] = useState("Specifications");

  const tabs = ["Description", "Specifications", "Warranty", "Manufacturer Info"];

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-4 text-2xl font-black">All details</h2>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 font-black ${
              active === tab
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Description" && (
        <p className="leading-8 text-gray-700">
          {description || "No description available"}
        </p>
      )}

      {active === "Specifications" && (
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          {(specifications || []).length > 0 ? (
            specifications?.map((spec, index) => (
              <div key={index} className="border-b pb-3">
                <p className="text-sm text-gray-500">{spec.key}</p>
                <p className="text-lg font-bold">{spec.value}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No specifications added.</p>
          )}
        </div>
      )}

      {active === "Warranty" && (
        <div className="space-y-5">
          <Detail title="Warranty Summary" value={returnPolicy?.warrantySummary || returnPolicy?.warranty} />
          <Detail title="Covered in Warranty" value={returnPolicy?.coveredWarranty} />
          <Detail title="Not Covered in Warranty" value={returnPolicy?.notCoveredWarranty} />
          <Detail title="Warranty Service Type" value={returnPolicy?.warrantyServiceType} />
        </div>
      )}

      {active === "Manufacturer Info" && (
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          <Detail title="Generic Name" value={returnPolicy?.genericName} />
          <Detail title="Country of Origin" value={returnPolicy?.countryOfOrigin} />
          <div className="md:col-span-2">
            <Detail
              title="Name and address of the Importer"
              value={returnPolicy?.importerNameAddress}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ title, value }: { title: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="border-b pb-3">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}