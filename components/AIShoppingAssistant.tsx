"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export default function AIShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [reply, setReply] = useState("Hi! Main Klassic AI hoon. Aap product, order, payment, delivery ya return ke baare me puch sakte ho.");

  const quickReply = (q: string) => {
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hello! Main Klassic AI Assistant hoon. Aap product, order, delivery, return, payment, account ya shopping advice puch sakte ho.";
  }

  if (q.includes("gift") || q.includes("present")) {
    return "Gift ke liye watch, bag, kitchen set ya stylish accessories best rahenge. Aap budget batao, jaise ₹500, ₹1000 ya ₹2000.";
  }

  if (q.includes("budget") || q.includes("cheap") || q.includes("low price")) {
    return "Aap budget batao, main us price ke andar best products suggest kar dunga. Example: bag under 1000.";
  }

  if (q.includes("size") || q.includes("fit")) {
    return "Size select karne se pehle product page par available sizes check karo. Agar doubt ho to ek size बड़ा लेना better hota hai.";
  }

  if (q.includes("color")) {
    return "Product page par available color options dikhte hain. Aap apna पसंदीदा color select karke cart me add kar sakte ho.";
  }

  if (q.includes("delivery") || q.includes("shipping")) {
    return "Delivery usually 3-5 working days me hoti hai. Exact status My Account → My Orders me check kar sakte ho.";
  }

  if (q.includes("late") || q.includes("delay")) {
    return "Agar order late ho raha hai to My Orders me status check karo. Status same rahe to support request create kar sakte ho.";
  }

  if (q.includes("return") || q.includes("refund")) {
    return "Delivered order ke baad return/refund request ki ja sakti hai. Product condition aur policy ke hisaab se approval hota hai.";
  }

  if (q.includes("cancel")) {
    return "Agar order Pending status me hai to order details page se cancel kar sakte ho. Shipped/Delivered order cancel nahi hota.";
  }

  if (q.includes("payment") || q.includes("cod") || q.includes("upi") || q.includes("card")) {
    return "Klassic me COD, Paytm/UPI aur online payment options available hain.";
  }

  if (q.includes("failed") || q.includes("payment problem")) {
    return "Payment failed ho jaye to amount usually bank side se auto reverse hota hai. Aap COD bhi choose kar sakte ho.";
  }

  if (q.includes("order") || q.includes("track")) {
    return "Order track karne ke liye My Account → My Orders open karo. Waha status, details aur invoice mil jayega.";
  }

  if (q.includes("invoice") || q.includes("bill")) {
    return "Invoice download karne ke liye My Orders → Order Details → Download Invoice button use karo.";
  }

  if (q.includes("coupon") || q.includes("discount") || q.includes("offer")) {
    return "Available coupons: WELCOME50, SAVE10, FLAT100. Checkout page par coupon apply karo.";
  }

  if (q.includes("wishlist")) {
    return "Wishlist me product save karne ke liye product page par Wishlist button press karo.";
  }

  if (q.includes("login") || q.includes("register")) {
    return "Login/Register ke liye header me Account option use karo. Login ke baad orders, wishlist aur address save ho jayenge.";
  }

  if (q.includes("address")) {
    return "My Account page me Home, Office ya Other address save/edit kar sakte ho.";
  }

  if (q.includes("phone") || q.includes("mobile")) {
    return "Mobile number update karne ke liye My Account → Personal Information → Edit button use karo.";
  }

  if (q.includes("password")) {
    return "Password bhool gaye ho to Forgot Password option use karo. Waha se reset process start hoga.";
  }

  if (q.includes("complaint") || q.includes("support") || q.includes("help")) {
    return "Aap apni problem batao: order issue, payment issue, delivery delay, return ya product damage. Main guide kar dunga.";
  }

  if (q.includes("damage") || q.includes("broken")) {
    return "Product damaged mila ho to delivery ke baad jaldi return/support request create karo aur product photo ready rakho.";
  }

  if (q.includes("best")) {
    return "Best product suggest karne ke liye mujhe category aur budget batao. Example: best shoes under 1500.";
  }

  return "";
};

  const askAI = async () => {
    if (!message.trim()) return;

    const q = message.toLowerCase();
    const normalReply = quickReply(q);

    if (normalReply) {
      setReply(normalReply);
      setResults([]);
      return;
    }

    const res = await fetch("/api/products", { cache: "no-store" });
    const products: Product[] = await res.json();

    let filtered = products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const price = Number(p.price);
      const words = q.split(" ").filter((w) => w.length > 2);

      const matchText =
        name.includes(q) ||
        category.includes(q) ||
        words.some((word) => name.includes(word) || category.includes(word));

      const priceNumber = q.match(/\d+/)?.[0];

      if ((q.includes("under") || q.includes("below") || q.includes("less")) && priceNumber) {
        return matchText ? price <= Number(priceNumber) : price <= Number(priceNumber);
      }

      return matchText;
    });

    if (filtered.length === 0) {
      filtered = products.slice(0, 4);
      setReply("Exact match nahi mila, lekin ye products aapko pasand aa sakte hain:");
    } else {
      setReply("Ye best matching products hain:");
    }

    setResults(filtered.slice(0, 4));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg font-bold text-sm"
      >
        💬 Ask AI
      </button>

      {open && (
        <div className="fixed bottom-24 right-3 z-50 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex justify-between text-sm">
            <b>Klassic AI Assistant</b>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-700 mb-3">{reply}</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border p-3 rounded-xl text-sm"
                placeholder="Ask anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askAI();
                }}
              />

              <button
                onClick={askAI}
                className="bg-black text-white px-4 rounded-xl text-sm"
              >
                Ask
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="flex gap-3 border rounded-xl p-2 hover:bg-gray-50"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 object-contain bg-gray-100 rounded"
                  />

                  <div>
                    <p className="text-sm font-bold line-clamp-2">{p.name}</p>
                    <p className="text-green-600 font-bold text-sm">
                      ₹{Number(p.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {[
                "hello",
                "track order",
                "delivery time",
                "return policy",
                "coupon",
                "bag under 1000",
                "kitchen",
                "payment options",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setMessage(item)}
                  className="bg-gray-100 px-3 py-2 rounded-full"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}