"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Mode = "view" | "edit" | "preview";

export default function SellerStoreProfilePage() {
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");
  const [mode, setMode] = useState<Mode>("edit");

  const [form, setForm] = useState({
    store_name: "",
    store_description: "",
    support_email: "",
    support_phone: "",
    store_logo: "",
    store_banner: "",
    business_address: "",
    city: "",
    state: "",
    pincode: "",
    return_policy: "",
    shipping_policy: "",
    store_category: "",
    facebook: "",
    instagram: "",
    website: "",
  });

  useEffect(() => {
    async function loadSeller() {
      const sellerData = localStorage.getItem("seller");
      if (!sellerData) return;

      const seller = JSON.parse(sellerData);
      const id = seller._id || seller.id;
      setSellerId(id);

      try {
        const res = await fetch(`/api/seller/profile?seller_id=${id}`);
        const data = await res.json();

        if (data.success && data.seller) {
          const loaded = {
            store_name: data.seller.store_name || "",
            store_description: data.seller.store_description || "",
            support_email: data.seller.support_email || "",
            support_phone: data.seller.support_phone || "",
            store_logo: data.seller.store_logo || "",
            store_banner: data.seller.store_banner || "",
            business_address: data.seller.business_address || "",
            city: data.seller.city || "",
            state: data.seller.state || "",
            pincode: data.seller.pincode || "",
            return_policy: data.seller.return_policy || "",
            shipping_policy: data.seller.shipping_policy || "",
            store_category: data.seller.store_category || "",
            facebook: data.seller.facebook || "",
            instagram: data.seller.instagram || "",
            website: data.seller.website || "",
          };

          setForm(loaded);

          if (loaded.store_name || loaded.store_description || loaded.store_logo || loaded.store_banner) {
            setMode("view");
          }
        }
      } catch {
        toast.error("Failed to load profile");
      }
    }

    loadSeller();
  }, []);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File, field: "store_logo" | "store_banner") {
    if (!file) return;
    setUploading(field);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        updateField(field, data.imageUrl);
        toast.success(field === "store_logo" ? "Logo uploaded" : "Banner uploaded");
      } else {
        toast.error(data.message || "Image upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading("");
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: sellerId,
          ...form,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Store profile updated");
        setMode("view");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }
async function deleteProfile() {
  if (!confirm("Delete store profile?")) return;

  try {
    const res = await fetch("/api/seller/profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: sellerId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Store profile deleted");

      setForm({
        store_name: "",
        store_description: "",
        support_email: "",
        support_phone: "",
        store_logo: "",
        store_banner: "",
        business_address: "",
        city: "",
        state: "",
        pincode: "",
        return_policy: "",
        shipping_policy: "",
        store_category: "",
        facebook: "",
        instagram: "",
        website: "",
      });

      setMode("edit");
    } else {
      toast.error(data.message || "Delete failed");
    }
  } catch {
    toast.error("Server error");
  }
}
  if (mode === "preview") {
    return (
      <main className="min-h-screen bg-gray-100 pb-24">
        <section className="mx-auto max-w-7xl px-3 py-4 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setMode("view")}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
            >
              ← Back
            </button>

            <button
              onClick={() => setMode("edit")}
              className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-black text-white"
            >
              ✏️ Edit Store
            </button>
          </div>

          <StoreLivePreview form={form} full />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      <section className="mx-auto max-w-7xl px-3 py-4 md:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/seller" className="text-sm font-black text-blue-600">
            ← Back to Dashboard
          </Link>

          {mode === "view" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode("preview")}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white"
              >
                👁 Full Preview
              </button>
<button
  onClick={deleteProfile}
  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"
>
  🗑 Delete Store
</button>
              <button
                onClick={() => setMode("edit")}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-black text-white"
              >
                ✏️ Edit
              </button>
            </div>
          )}
        </div>

        {mode === "view" ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StoreLivePreview form={form} />
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black text-slate-950">Store Details</h2>

              <div className="mt-4 space-y-3 text-sm">
                <Info label="Support Email" value={form.support_email} />
                <Info label="Support Phone" value={form.support_phone} />
                <Info label="Category" value={form.store_category} />
                <Info label="Address" value={form.business_address} />
                <Info label="City" value={form.city} />
                <Info label="State" value={form.state} />
                <Info label="Pincode" value={form.pincode} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <form
              onSubmit={updateProfile}
              
              className="rounded-3xl bg-white p-5 shadow lg:col-span-2"
            >
              <p className="text-sm font-black text-orange-600">
                KLASSIC SELLER STORE
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-950">
                Edit Store Profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Save ke baad form hide hoga aur live store preview show hoga.
              </p>

              <div className="mt-6 grid gap-4">
                <UploadBox
                  title="Store Banner"
                  subtitle="Drag banner image here or click to upload"
                  image={form.store_banner}
                  loading={uploading === "store_banner"}
                  onUpload={(file) => uploadImage(file, "store_banner")}
                />

                <UploadBox
                  title="Store Logo"
                  subtitle="Drag logo image here or click to upload"
                  image={form.store_logo}
                  loading={uploading === "store_logo"}
                  onUpload={(file) => uploadImage(file, "store_logo")}
                  round
                />

                <Input label="Store Name" value={form.store_name} onChange={(v) => updateField("store_name", v)} />

                <Textarea label="Store Description" value={form.store_description} onChange={(v) => updateField("store_description", v)} />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Support Email" value={form.support_email} onChange={(v) => updateField("support_email", v)} />
                  <Input label="Support Phone" value={form.support_phone} onChange={(v) => updateField("support_phone", v)} />
                  <Input label="Store Category" value={form.store_category} onChange={(v) => updateField("store_category", v)} />
                  <Input label="Pincode" value={form.pincode} onChange={(v) => updateField("pincode", v)} />
                  <Input label="City" value={form.city} onChange={(v) => updateField("city", v)} />
                  <Input label="State" value={form.state} onChange={(v) => updateField("state", v)} />
                </div>

                <Textarea label="Business Address" value={form.business_address} onChange={(v) => updateField("business_address", v)} />
                <Textarea label="Return Policy" value={form.return_policy} onChange={(v) => updateField("return_policy", v)} />
                <Textarea label="Shipping Policy" value={form.shipping_policy} onChange={(v) => updateField("shipping_policy", v)} />

                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Facebook Link" value={form.facebook} onChange={(v) => updateField("facebook", v)} />
                  <Input label="Instagram Link" value={form.instagram} onChange={(v) => updateField("instagram", v)} />
                  <Input label="Website Link" value={form.website} onChange={(v) => updateField("website", v)} />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-orange-600 py-4 font-black text-white disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save Store Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="rounded-2xl bg-slate-100 px-6 py-4 font-black text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>

            <aside className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black text-slate-950">Live Preview</h2>
              <div className="mt-4">
                <StorePreviewCard form={form} />
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function StoreLivePreview({ form, full = false }: { form: any; full?: boolean }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className={`${full ? "h-72" : "h-56"} bg-slate-200`}>
        {form.store_banner ? (
          <img src={form.store_banner} alt="Store Banner" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-black text-slate-400">
            Store Banner
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="-mt-14 h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-slate-200 shadow">
              {form.store_logo ? (
                <img src={form.store_logo} alt="Store Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-black text-slate-400">
                  Logo
                </div>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">
              {form.store_name || "Your Store Name"}
            </h1>

            <p className="mt-1 text-sm font-bold text-slate-500">
              {form.store_category || "General Store"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge text="✅ Verified Seller" />
            <Badge text="⭐ Trusted Store" />
            <Badge text="🚚 Fast Shipping" />
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          {form.store_description || "Store description preview will show here."}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <PolicyCard title="Return Policy" text={form.return_policy || "Return policy not added yet."} />
          <PolicyCard title="Shipping Policy" text={form.shipping_policy || "Shipping policy not added yet."} />
          <PolicyCard title="Support" text={`${form.support_email || "-"}\n${form.support_phone || "-"}`} />
        </div>

        {full && (
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Business Information</h2>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <Info label="Address" value={form.business_address} />
              <Info label="City" value={form.city} />
              <Info label="State" value={form.state} />
              <Info label="Pincode" value={form.pincode} />
              <Info label="Facebook" value={form.facebook} />
              <Info label="Instagram" value={form.instagram} />
              <Info label="Website" value={form.website} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StorePreviewCard({ form }: { form: any }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-slate-50">
      <div className="h-36 bg-slate-200">
        {form.store_banner ? (
          <img src={form.store_banner} alt="Store Banner" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="p-4">
        <div className="-mt-12 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow">
          {form.store_logo ? (
            <img src={form.store_logo} alt="Store Logo" className="h-full w-full object-cover" />
          ) : null}
        </div>

        <h3 className="mt-3 text-2xl font-black text-slate-950">
          {form.store_name || "Your Store Name"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {form.store_category || "General Store"}
        </p>

        <p className="mt-3 line-clamp-4 text-sm text-slate-600">
          {form.store_description || "Store description preview will show here."}
        </p>
      </div>
    </div>
  );
}

function UploadBox({
  title,
  subtitle,
  image,
  loading,
  onUpload,
  round = false,
}: {
  title: string;
  subtitle: string;
  image: string;
  loading: boolean;
  onUpload: (file: File) => void;
  round?: boolean;
}) {
  function handleFile(file?: File) {
    if (!file) return;
    onUpload(file);
  }

  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className="block cursor-pointer rounded-3xl border-2 border-dashed border-orange-300 bg-orange-50 p-4 transition hover:bg-orange-100"
    >
      <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div
          className={`flex h-28 w-full items-center justify-center overflow-hidden bg-white md:w-44 ${
            round ? "rounded-full md:h-28 md:w-28" : "rounded-2xl"
          }`}
        >
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-black text-slate-400">No Image</span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
          <p className="mt-2 text-xs font-bold text-orange-700">
            {loading ? "Uploading..." : "PNG, JPG, WEBP supported"}
          </p>
        </div>
      </div>
    </label>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      className="w-full rounded-2xl border p-4 font-semibold outline-none focus:border-orange-500"
      placeholder={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      className="h-32 w-full rounded-2xl border p-4 font-semibold outline-none focus:border-orange-500"
      placeholder={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-black text-orange-700">
      {text}
    </span>
  );
}

function PolicyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}