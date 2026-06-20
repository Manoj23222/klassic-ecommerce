"use client";

import { useState } from "react";
import { Search, Mic, Camera } from "lucide-react";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");

  const searchProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={searchProduct} className="w-full">
      <div className="relative flex items-center">
        <button
          type="submit"
          className="absolute left-3 text-gray-400"
        >
          <Search size={18} />
        </button>

        <input
          type="text"
          placeholder="Search products, brands & more"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            h-11
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-white
            pl-10
            pr-20
            text-sm
            font-medium
            text-black
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

        <div className="absolute right-3 flex items-center gap-2">
          <button
            type="button"
            className="text-gray-400"
          >
            <Mic size={16} />
          </button>

          <button
            type="button"
            className="text-gray-400"
          >
            <Camera size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}