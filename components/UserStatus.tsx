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
  <div className="flex items-center">
    <span>👤 {user.name}</span>
  </div>
);
}