"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerSettingsClient() {
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    store_name: "",
    store_description: "",
    store_logo: "",
    store_banner: "",

    gst_number: "",
    pan_number: "",
    business_name: "",
    business_address: "",

    account_holder: "",
    bank_name: "",
    account_number: "",
    ifsc: "",
    upi_id: "",

    return_policy: "",
    shipping_policy: "",
    store_visibility: "Public",

    support_email: "",
    support_phone: "",
  });

  useEffect(() => {
    const savedSeller = JSON.parse(localStorage.getItem("seller") || "{}");
    const id = savedSeller?._id || savedSeller?.id;

    if (!id) return;

    setSellerId(id);

    fetch(`/api/seller/settings?seller_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm((prev: any) => ({
            ...prev,
            ...data.seller,
          }));
        }
      });
  }, []);

  function update(key: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveSettings() {
    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/seller/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seller_id: sellerId,
        ...form,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Settings saved");
      localStorage.setItem("seller", JSON.stringify(data.seller));
    } else {
      toast.error(data.message || "Save failed");
    }
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Store Settings</h1>
        <p className="text-gray-500">
          Manage profile, business, bank and policies.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Store Profile">
          <Input
            label="Store Name"
            value={form.store_name}
            setValue={(v) => update("store_name", v)}
          />
          <Input
            label="Store Logo URL"
            value={form.store_logo}
            setValue={(v) => update("store_logo", v)}
          />
          <Input
            label="Store Banner URL"
            value={form.store_banner}
            setValue={(v) => update("store_banner", v)}
          />
          <Textarea
            label="Store Description"
            value={form.store_description}
            setValue={(v) => update("store_description", v)}
          />
        </Card>

        <Card title="Business Details">
          <Input
            label="GST Number"
            value={form.gst_number}
            setValue={(v) => update("gst_number", v)}
          />
          <Input
            label="PAN Number"
            value={form.pan_number}
            setValue={(v) => update("pan_number", v)}
          />
          <Input
            label="Business Name"
            value={form.business_name}
            setValue={(v) => update("business_name", v)}
          />
          <Textarea
            label="Business Address"
            value={form.business_address}
            setValue={(v) => update("business_address", v)}
          />
        </Card>

        <Card title="Bank Details">
          <Input
            label="Account Holder Name"
            value={form.account_holder}
            setValue={(v) => update("account_holder", v)}
          />
          <Input
            label="Bank Name"
            value={form.bank_name}
            setValue={(v) => update("bank_name", v)}
          />
          <Input
            label="Account Number"
            value={form.account_number}
            setValue={(v) => update("account_number", v)}
          />
          <Input
            label="IFSC Code"
            value={form.ifsc}
            setValue={(v) => update("ifsc", v)}
          />
          <Input
            label="UPI ID"
            value={form.upi_id}
            setValue={(v) => update("upi_id", v)}
          />
        </Card>

        <Card title="Store Policies">
          <Textarea
            label="Return Policy"
            value={form.return_policy}
            setValue={(v) => update("return_policy", v)}
          />
          <Textarea
            label="Shipping Policy"
            value={form.shipping_policy}
            setValue={(v) => update("shipping_policy", v)}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-bold">
              Store Visibility
            </span>
            <select
              value={form.store_visibility}
              onChange={(e) => update("store_visibility", e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
        </Card>

        <Card title="Support Details">
          <Input
            label="Support Email"
            value={form.support_email}
            setValue={(v) => update("support_email", v)}
          />
          <Input
            label="Support Phone"
            value={form.support_phone}
            setValue={(v) => update("support_phone", v)}
          />
        </Card>
      </div>

      <div className="mt-6">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-8 py-3 font-black text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </SellerCentralLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
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
    <label className="block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <textarea
        rows={3}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}