"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    store_name: "",
    business_type: "Individual",
    category: "",
    pan: "",
    gst: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitSellerRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      alert("Please accept seller terms and conditions");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/seller-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Seller request submitted successfully");
      router.push("/become-seller");
    } else {
      alert(data.message || "Request failed");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Klassic Seller Application
          </h1>

          <p className="text-gray-600 text-sm mt-2">
            Fill your seller details. Our admin team will review your request.
          </p>

          <form
            onSubmit={submitSellerRequest}
            className="mt-6 grid md:grid-cols-2 gap-4"
          >
            <input
              className="border p-3 rounded-xl"
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Email *"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Mobile Number *"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Store Name *"
              value={form.store_name}
              onChange={(e) => updateField("store_name", e.target.value)}
              required
            />

            <select
              className="border p-3 rounded-xl"
              value={form.business_type}
              onChange={(e) => updateField("business_type", e.target.value)}
            >
              <option value="Individual">Individual</option>
              <option value="Small Business">Small Business</option>
              <option value="Company">Company</option>
            </select>

            <select
              className="border p-3 rounded-xl"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
            >
              <option value="">Select Product Category *</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Grocery">Grocery</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="PAN Number"
              value={form.pan}
              onChange={(e) => updateField("pan", e.target.value)}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="GST Number Optional"
              value={form.gst}
              onChange={(e) => updateField("gst", e.target.value)}
            />

            <textarea
              className="border p-3 rounded-xl md:col-span-2"
              placeholder="Store / Pickup Address *"
              rows={4}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              required
            />

            <label className="md:col-span-2 flex gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />

              <span>
                I agree that my products will be genuine, pricing will be
                correct, and Klassic admin can approve or reject my seller
                request.
              </span>
            </label>

            <button
              disabled={loading}
              className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Seller Request"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}