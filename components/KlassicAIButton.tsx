"use client";

import Link from "next/link";
import { useState } from "react";

type AIProduct = {
  _id: string;
  name: string;
  image: string;
  category?: string;
  brand?: string;
  price: number;
  stock: number;
};

const quickPrompts = [
  "Order help",
  "Return request help",
  "Refund status",
  "Delivery issue",
  "Payment problem",
  "Seller support",
  "Product recommendation",
];

export default function KlassicAIButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<AIProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hi, I am Klassic AI Support. I can help with orders, returns, refunds, delivery issues, seller support, and product recommendations.",
    },
  ]);

  async function sendMessage(text?: string) {
    const cleanText = (text || input).trim();
    if (!cleanText) return;

    setMessages((prev) => [...prev, { role: "user", text: cleanText }]);
    setInput("");
    setProducts([]);
    setLoading(true);

    const lower = cleanText.toLowerCase();

    if (lower.includes("order")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "For order help, please go to My Orders and open your order details. You can track, cancel, request return, download invoice, or contact support from there.",
        },
      ]);
      return;
    }

    if (lower.includes("return")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "For return help, open My Orders, choose the delivered order, then click Request Return. After admin approval, refund status will update automatically.",
        },
      ]);
      return;
    }

    if (lower.includes("refund")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Refund status is available inside Order Details. If return is approved, refund will show Pending first, then Completed after admin processing.",
        },
      ]);
      return;
    }

    if (lower.includes("delivery") || lower.includes("shipping")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "For delivery issues, check your Order Details tracking section. If delivery is delayed, use Need Help from My Orders.",
        },
      ]);
      return;
    }

    if (lower.includes("payment")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "For payment problems, check payment status in Order Details. If money was deducted but order failed, contact support with your order ID.",
        },
      ]);
      return;
    }

    if (lower.includes("seller")) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "For seller support, open Seller Dashboard. You can manage products, orders, wallet, returns, payouts, questions, and store settings there.",
        },
      ]);
      return;
    }

    const res = await fetch("/api/ai/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: cleanText }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.message || "Sorry, I could not find products right now.",
        },
      ]);
      return;
    }

    setProducts(data.products || []);

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text:
          data.products?.length > 0
            ? `I found ${data.products.length} matching products for you.`
            : "No exact product found. Try category name like Fashion, Electronics, Grocery, Home.",
      },
    ]);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[92vw] max-w-md overflow-hidden rounded-[2rem] border bg-white shadow-2xl">
          <div className="bg-black p-4 text-white">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
              Klassic Help & Support
            </p>
            <h2 className="mt-1 text-xl font-black">
              AI Support Assistant
            </h2>
          </div>

          <div className="max-h-[380px] space-y-3 overflow-y-auto bg-[#f7f5f1] p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-6 ${
                  msg.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "mr-auto bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-white p-3 text-sm font-bold text-gray-500">
                Checking...
              </div>
            )}

            {products.length > 0 && (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="h-14 w-14 rounded-xl border object-contain"
                    />

                    <div className="flex-1">
                      <p className="line-clamp-2 text-sm font-black">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.brand || product.category || "Klassic"}
                      </p>
                      <p className="mt-1 text-sm font-black">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 rounded-full border px-3 py-2 text-xs font-bold"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask for help..."
                className="flex-1 rounded-full border px-4 py-3 text-sm outline-none focus:border-black"
              />

              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="rounded-full bg-black px-5 py-3 text-sm font-black text-white disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-20 right-4 z-[9999] rounded-full bg-black px-5 py-4 text-sm font-black text-white shadow-2xl sm:bottom-6"
      >
        {open ? "Close Help" : "Help & AI"}
      </button>
    </>
  );
}