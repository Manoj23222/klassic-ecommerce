"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");
  const couponFromUrl = searchParams.get("coupon");
  const colorFromUrl = searchParams.get("color");
  const sizeFromUrl = searchParams.get("size");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
  const loadSavedAddress = async () => {
    try {
      const res = await fetch("/api/account/address", {
        cache: "no-store",
      });

      const data = await res.json();

      const saved = data.address || data.user;

      if (data.success && saved) {
        setName(saved.name || "");
        setPhone(saved.phone || "");

        const fullAddress = [
          saved.address,
          saved.city,
          saved.state,
          saved.pincode,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress(fullAddress);
      }
    } catch (error) {
      console.error("Address auto-fill error:", error);
    }
  };

  loadSavedAddress();
}, []);

  useEffect(() => {
    const loadCheckout = async () => {
      if (productId) {
        const res = await fetch(`/api/products/${productId}`);
        const product = await res.json();

        setCart([
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: 1,
            color: colorFromUrl || "",
            size: sizeFromUrl || "",
          },
        ]);
      } else {
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
      }
    };

    loadCheckout();
  }, [productId, colorFromUrl, sizeFromUrl]);

  useEffect(() => {
    if (couponFromUrl) setCoupon(couponFromUrl);
  }, [couponFromUrl]);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const total = Math.max(subtotal - discount, 0);

  useEffect(() => {
    if (couponFromUrl && subtotal > 0) {
      if (couponFromUrl === "WELCOME50") setDiscount(50);
      else if (couponFromUrl === "SAVE10")
        setDiscount(Math.round(subtotal * 0.1));
      else if (couponFromUrl === "FLAT100") setDiscount(100);
    }
  }, [couponFromUrl, subtotal]);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      alert("Enter coupon code");
      return;
    }

    const res = await fetch("/api/coupons/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: coupon, subtotal }),
    });

    const data = await res.json();

    if (data.success) {
      setDiscount(data.discount);
      alert(`Coupon applied: ₹${data.discount} OFF`);
    } else {
      setDiscount(0);
      alert(data.message || "Invalid coupon");
    }
  };

  const saveOrder = async (method: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: name,
        phone,
        address,
        total,
        cart,
        payment_method: method,
        coupon_code: coupon,
        discount,
      }),
    });

    return res.json();
  };

  const startPaytm = async () => {
    const orderData = await saveOrder("Paytm");

    if (!orderData.success) {
      alert("Order save failed");
      return;
    }

    const paytmRes = await fetch("/api/paytm/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        amount: total,
        customerId: phone,
        email: "",
        phone,
      }),
    });

    const paytmData = await paytmRes.json();

    if (!paytmData.success) {
      alert("Paytm initiate failed");
      return;
    }

    const txnToken = paytmData.data?.body?.txnToken;

    if (!txnToken) {
      alert("TxnToken not received");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${paytmData.mid}&orderId=${paytmData.orderId}`;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "txnToken";
    input.value = txnToken;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (paymentMethod === "Paytm") {
      await startPaytm();
      return;
    }

    if (paymentMethod === "COD") {
      const data = await saveOrder("COD");

      if (data.success) {
        if (!productId) localStorage.removeItem("cart");
        window.location.href = `/order-success?orderId=${data.orderId}`;
      } else {
        alert("Order failed");
      }

      return;
    }

    if (paymentMethod === "Razorpay") {
      const data = await saveOrder("Online Test Payment");

      if (data.success) {
        if (!productId) localStorage.removeItem("cart");
        alert("Test online payment successful!");
        window.location.href = `/order-success?orderId=${data.orderId}`;
      } else {
        alert("Order save failed");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-3 md:px-6 py-6 md:py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-5 md:p-8 rounded-2xl shadow">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Checkout</h1>

          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm">
            ✅ Saved address auto-fill enabled. You can edit it before placing order.
          </div>

          <form onSubmit={placeOrder} className="space-y-4">
            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="w-full border p-3 rounded-xl"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <textarea
              className="w-full border p-3 rounded-xl"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              required
            />

            <div className="border p-4 rounded-xl bg-gray-50">
              <h3 className="font-bold mb-3">Payment Method</h3>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3 mt-2">
                <input
                  type="radio"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                />
                Online Payment / UPI / Card
              </label>

              <label className="flex items-center gap-3 mt-2">
                <input
                  type="radio"
                  checked={paymentMethod === "Paytm"}
                  onChange={() => setPaymentMethod("Paytm")}
                />
                Paytm / UPI / Wallet / Cards
              </label>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg md:text-xl font-bold">
              {paymentMethod === "COD"
                ? "Place COD Order"
                : paymentMethod === "Paytm"
                ? "Pay with Paytm"
                : "Pay Now"}
            </button>
          </form>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-2xl shadow h-fit">
          <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-gray-100 rounded"
                />

                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>

                  {item.color && (
                    <p className="text-sm text-gray-600">
                      Color: <b>{item.color}</b>
                    </p>
                  )}

                  {item.size && (
                    <p className="text-sm text-gray-600">
                      Size: <b>{item.size}</b>
                    </p>
                  )}

                  <p>Qty: {item.quantity || 1}</p>
                  <p className="font-bold text-green-600">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <input
              className="flex-1 border p-3 rounded-xl"
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            <button
              type="button"
              onClick={applyCoupon}
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              Apply
            </button>
          </div>

          <div className="mt-6 space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>₹{subtotal}</b>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <b>-₹{discount}</b>
            </div>

            <div className="flex justify-between text-2xl font-bold border-t pt-3">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="mt-5 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm">
            Coupons: <b>WELCOME50</b>, <b>SAVE10</b>, <b>FLAT100</b>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}