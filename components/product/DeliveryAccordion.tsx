"use client";

import { useState } from "react";

export default function DeliveryAccordion() {
  const [pincode, setPincode] = useState("");

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <details open>
        <summary className="cursor-pointer text-lg font-black">
          Delivery Details
        </summary>

        <div className="mt-4 space-y-4">
          <div className="flex overflow-hidden rounded-xl border">
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter delivery pincode"
              className="w-full p-3 text-sm outline-none"
            />

            <button className="bg-blue-600 px-5 text-sm font-black text-white">
              Check
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Mini title="Fast Delivery" text="3-5 working days" />
            <Mini title="COD" text="Available" />
            <Mini title="Return" text="Easy return policy" />
          </div>
        </div>
      </details>
    </section>
  );
}

function Mini({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl bg-blue-50 p-3">
      <p className="text-sm font-black text-blue-800">{title}</p>
      <p className="mt-1 text-xs font-semibold text-gray-600">{text}</p>
    </div>
  );
}