"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminBannerForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    button_text: "",
    button_link: "",
    position: "Home Top",
    active: true,
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Banner added successfully");
      setForm({
        title: "",
        subtitle: "",
        image: "",
        button_text: "",
        button_link: "",
        position: "Home Top",
        active: true,
      });
      router.refresh();
    } else {
      toast.error(data.message || "Banner add failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="input" placeholder="Banner Title" value={form.title} onChange={(e) => update("title", e.target.value)} />

      <input className="input" placeholder="Subtitle" value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} />

      <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => update("image", e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" placeholder="Button Text" value={form.button_text} onChange={(e) => update("button_text", e.target.value)} />

        <input className="input" placeholder="Button Link" value={form.button_link} onChange={(e) => update("button_link", e.target.value)} />
      </div>

      <select className="input" value={form.position} onChange={(e) => update("position", e.target.value)}>
        <option>Home Top</option>
        <option>Home Middle</option>
        <option>Category</option>
        <option>Mobile App</option>
      </select>

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => update("active", e.target.checked)}
        />
        Active Banner
      </label>

      <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
        Add Banner
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 14px;
          padding: 12px 14px;
          outline: none;
        }
      `}</style>
    </form>
  );
}