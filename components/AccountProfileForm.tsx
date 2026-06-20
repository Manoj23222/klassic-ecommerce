"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountProfileForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    role: string;
  };
}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/account/address", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success && data.user) {
          setName(data.user.name || user.name || "");
          setPhone(data.user.phone || "");
        }
      } catch {
        toast.error("Profile load failed");
      }
    };

    loadProfile();
  }, [user.name]);

  const saveProfile = async () => {
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter valid 10 digit Indian mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Profile updated successfully");
        setEdit(false);
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-black text-gray-900 md:text-2xl">
            Personal Information
          </h1>

          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Manage your Klassic account details.
          </p>
        </div>

        {!edit && (
          <button
            type="button"
            onClick={() => setEdit(true)}
            className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100 md:text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {!edit ? (
        <div className="grid gap-3 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 p-3 md:grid-cols-2 md:p-5">
          <InfoBox label="Name" value={name || "Not added"} />
          <InfoBox label="Phone" value={phone || "Not added"} />
          <InfoBox label="Email" value={user.email || "Not added"} />

          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400">
              Role
            </p>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-[10px] font-black text-green-700">
              {user.role}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <Input
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone Number"
            />

            <div className="rounded-xl border bg-gray-100 p-3 text-xs font-bold text-gray-700 md:text-sm">
              {user.email}
            </div>

            <div className="rounded-xl border bg-gray-100 p-3 text-xs font-bold text-gray-700 md:text-sm">
              {user.role}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:flex md:gap-3">
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="rounded-xl bg-black px-5 py-3 text-xs font-black text-white transition disabled:bg-gray-400 md:text-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setEdit(false)}
              className="rounded-xl bg-gray-200 px-5 py-3 text-xs font-black transition hover:bg-gray-300 md:text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <p className="text-[10px] font-black uppercase text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-900 md:text-base">
        {value}
      </p>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-xl border p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 md:text-sm"
    />
  );
}