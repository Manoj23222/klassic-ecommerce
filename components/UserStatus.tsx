"use client";

import { useEffect, useState } from "react";

export default function UserStatus() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="flex gap-4">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <span>👤 {user.name}</span>

      {user.role === "admin" && (
        <a
          href="/admin"
          className="bg-yellow-500 text-black px-3 py-1 rounded"
        >
          Admin
        </a>
      )}

      <button
        onClick={logout}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}