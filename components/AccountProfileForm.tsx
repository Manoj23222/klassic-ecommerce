"use client";

import { useEffect, useState } from "react";

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
      const res = await fetch("/api/account/address", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success && data.user) {
        setName(data.user.name || user.name || "");
        setPhone(data.user.phone || "");
      }
    };

    loadProfile();
  }, [user.name]);

  const saveProfile = async () => {
    setLoading(true);

    const res = await fetch("/api/account/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Profile updated successfully");
      setEdit(false);
    } else {
      alert("Profile update failed");
    }
  };

  return (
    <div className="bg-white p-5 md:p-8 rounded-xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          Personal Information
        </h1>

        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="text-blue-600 font-bold"
          >
            Edit
          </button>
        )}
      </div>

      {!edit ? (
        <div className="border rounded-2xl p-5 bg-gray-50 space-y-3">
          <p>
            <span className="text-gray-500">Name: </span>
            <b>{name}</b>
          </p>

          <p>
            <span className="text-gray-500">Phone: </span>
            <b>{phone || "Not added"}</b>
          </p>

          <p>
            <span className="text-gray-500">Email: </span>
            <b>{user.email}</b>
          </p>

          <p>
            <span className="text-gray-500">Role: </span>
            <b>{user.role}</b>
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className="border p-3 rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />

            <div className="border p-3 rounded-xl bg-gray-100 font-bold">
              {user.email}
            </div>

            <div className="border p-3 rounded-xl bg-gray-100 font-bold">
              {user.role}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={saveProfile}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEdit(false)}
              className="bg-gray-200 px-6 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}