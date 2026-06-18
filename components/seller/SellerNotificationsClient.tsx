"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerNotificationsClient() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<any[]>([]);

  function sendNotification() {
    if (!title || !message) return;

    setSent([
      {
        id: Date.now(),
        title,
        message,
        status: "Draft",
      },
      ...sent,
    ]);

    setTitle("");
    setMessage("");
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Push Notifications</h1>
        <p className="text-gray-500">Create customer notification drafts.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <Input label="Notification Title" value={title} setValue={setTitle} />
          <Textarea label="Message" value={message} setValue={setMessage} />

          <button
            onClick={sendNotification}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Save Notification
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Notifications</h2>

          <div className="space-y-3">
            {sent.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-gray-50 p-4">
                <p className="font-black">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600">{item.message}</p>
              </div>
            ))}

            {sent.length === 0 && (
              <div className="rounded-2xl border bg-gray-50 p-10 text-center font-bold text-gray-500">
                No notifications saved
              </div>
            )}
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}

function Textarea({ label, value, setValue }: any) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}