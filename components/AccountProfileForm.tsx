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
    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            Personal Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your Klassic account details.
          </p>
        </div>

        {!edit && (
          <button
            type="button"
            onClick={() => setEdit(true)}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition"
          >
            Edit
          </button>
        )}
      </div>

      {!edit ? (
        <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-bold">Name</p>
            <p className="text-lg font-extrabold text-gray-900">{name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold">Phone</p>
            <p className="font-bold text-gray-800">{phone || "Not added"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold">Email</p>
            <p className="font-bold text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold">Role</p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold">
              {user.role}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone Number"
            />

            <div className="border p-3 rounded-xl bg-gray-100 font-bold text-gray-700">
              {user.email}
            </div>

            <div className="border p-3 rounded-xl bg-gray-100 font-bold text-gray-700">
              {user.role}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setEdit(false)}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}