"use client";

import toast from "react-hot-toast";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function getSizePrice(basePrice: number, size: string) {
  const clean = String(size || "").toLowerCase().replace(/\s/g, "");

  if (clean === "500g") return basePrice * 0.5;
  if (clean === "1kg") return basePrice;
  if (clean === "5kg") return basePrice * 5;
  if (clean === "10kg") return basePrice * 10;

  return basePrice;
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

  const offerCoupons = [
    { code: "WELCOME50", text: "₹50 OFF" },
    { code: "SAVE10", text: "10% OFF" },
    { code: "FLAT100", text: "₹100 OFF" },
  ];

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
        const data = await res.json();

        if (!data.success || !data.product) {
          toast.error("Product not found");
          return;
        }

        const product = data.product;
        const basePrice = Number(product.price);
        const finalPrice = getSizePrice(basePrice, sizeFromUrl || "");

        setCart([
          {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            price: finalPrice,
            basePrice,
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

  const applyCouponCode = async (code: string) => {
    if (!code.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    const res = await fetch("/api/coupons/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, subtotal }),
    });

    const data = await res.json();

    if (data.success) {
      setCoupon(code);
      setDiscount(data.discount);
      toast.success(`Coupon applied: ₹${data.discount} OFF`);
    } else {
      setDiscount(0);
      toast.error(data.message || "Invalid coupon");
    }
  };

  const applyCoupon = async () => {
    await applyCouponCode(coupon);
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
      toast.error("Order save failed");
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
      toast.error("Paytm initiate failed");
      return;
    }

    const txnToken = paytmData.data?.body?.txnToken;

    if (!txnToken) {
      toast.error("TxnToken not received");
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
      toast.error("Cart is empty");
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
        toast.error("Order failed");
      }

      return;
    }

    if (paymentMethod === "Razorpay") {
      const data = await saveOrder("Online Test Payment");

      if (data.success) {
        if (!productId) localStorage.removeItem("cart");
        toast.success("Test online payment successful!");
        window.location.href = `/order-success?orderId=${data.orderId}`;
      } else {
        toast.error("Order save failed");
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
                  <p className="font-bold text-green-600">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <input
              className="flex-1 border p-3 rounded-xl"
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            />

            <button
              type="button"
              onClick={applyCoupon}
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              Apply
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-bold mb-2">Available Offers</h3>

            <div className="grid gap-2">
              {offerCoupons.map((offer) => (
                <button
                  key={offer.code}
                  type="button"
                  onClick={() => applyCouponCode(offer.code)}
                  className="flex justify-between items-center border border-green-200 bg-green-50 hover:bg-green-100 p-3 rounded-xl text-left"
                >
                  <span>
                    <b>{offer.code}</b>
                    <span className="text-sm text-gray-600 ml-2">
                      {offer.text}
                    </span>
                  </span>

                  <span className="text-blue-600 font-bold">Apply</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>₹{subtotal.toFixed(2)}</b>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <b>-₹{discount.toFixed(2)}</b>
            </div>

            <div className="flex justify-between text-2xl font-bold border-t pt-3">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
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