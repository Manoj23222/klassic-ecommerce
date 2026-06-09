"use client";

import { useState } from "react";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");

  const searchProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={searchProduct} className="flex-1">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white text-black border-2 border-white outline-none focus:border-yellow-300"
      />
    </form>
  );
}