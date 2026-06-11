"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountAddressForm() {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await fetch("/api/account/address", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success && data.user) {
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
          setCity(data.user.city || "");
          setPincode(data.user.pincode || "");
          setAddressType(data.user.address_type || "Home");

          if (data.user.address || data.user.phone || data.user.city) {
            setHasAddress(true);
            setEditMode(false);
          }
        }
      } catch (error) {
        console.log("Address load error", error);
        toast.error("Address load failed");
      }
    };

    loadAddress();
  }, []);

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          address,
          city,
          pincode,
          address_type: addressType,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Address saved successfully");
        setHasAddress(true);
        setEditMode(false);
      } else {
        toast.error(data.message || "Address save failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (hasAddress && !editMode) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">🏠 Saved Delivery Address</h2>

          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>

        <div className="border rounded-2xl p-5 bg-gray-50">
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
            {addressType}
          </div>

          <p className="font-bold text-lg">{phone}</p>
          <p className="text-gray-700 mt-2">{address}</p>
          <p className="text-gray-700">
            {city} - {pincode}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={saveAddress}
      className="bg-white p-6 md:p-8 rounded-2xl shadow"
    >
      <h2 className="text-2xl font-bold mb-5">
        {hasAddress ? "✏️ Edit Address" : "🏠 Add Delivery Address"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          className="border p-3 rounded-xl"
          value={addressType}
          onChange={(e) => setAddressType(e.target.value)}
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
        </select>

        <input
          className="border p-3 rounded-xl"
          placeholder="Phone Number"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          required
        />

        <input
          className="border p-3 rounded-xl"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          className="border p-3 rounded-xl"
          placeholder="Pincode"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          required
        />

        <textarea
          className="border p-3 rounded-xl md:col-span-2"
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-3 mt-5">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>

        {hasAddress && (
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="bg-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}