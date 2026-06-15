"use client";

import toast from "react-hot-toast";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const colorFromUrl = searchParams.get("color") || "";
  const sizeFromUrl = searchParams.get("size") || "";
  const couponFromUrl = searchParams.get("coupon") || "";

  const [step, setStep] = useState(1);
const [showAddressForm, setShowAddressForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const offerCoupons = [
    { code: "WELCOME50", text: "₹50 OFF" },
    { code: "SAVE10", text: "10% OFF" },
    { code: "FLAT100", text: "₹100 OFF" },
  ];

  useEffect(() => {
    async function loadAddress() {
      try {
        const res = await fetch("/api/account/address", { cache: "no-store" });
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
      } catch {}
    }

    loadAddress();
  }, []);

  useEffect(() => {
    async function loadCheckout() {
      if (productId) {
        const res = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data.success || !data.product) {
          toast.error("Product not found");
          return;
        }

        const product = data.product;
        const basePrice = Number(product.price);
        const finalPrice = getSizePrice(basePrice, sizeFromUrl);

        setCart([
          {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            price: finalPrice,
            basePrice,
            image: product.image,
            quantity: 1,
            color: colorFromUrl,
            size: sizeFromUrl,
          },
        ]);
      } else {
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
      }
    }

    loadCheckout();
  }, [productId, colorFromUrl, sizeFromUrl]);

  useEffect(() => {
    if (couponFromUrl) setCoupon(couponFromUrl);
  }, [couponFromUrl]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const total = Math.max(subtotal - discount, 0);

  async function applyCouponCode(code: string) {
    if (!code.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    const res = await fetch("/api/coupons/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });

    const data = await res.json();

    if (data.success) {
      setCoupon(code);
      setDiscount(Number(data.discount || 0));
      toast.success(`Coupon applied: ₹${data.discount} OFF`);
    } else {
      setDiscount(0);
      toast.error(data.message || "Invalid coupon");
    }
  }

  async function saveOrder(method: string) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  }

  function continueAddress() {
    if (!name || !phone || !address) {
      toast.error("Please complete address details");
      return;
    }

    setStep(2);
  }

  function continueSummary() {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setStep(3);
  }

  async function placeOrder() {
    if (!name || !phone || !address) {
      toast.error("Address details required");
      setStep(1);
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    const method =
  paymentMethod === "COD"
    ? "COD"
    : paymentMethod === "UPI"
    ? "UPI"
    : paymentMethod === "Card"
    ? "Card"
    : paymentMethod === "EMI"
    ? "EMI"
    : paymentMethod === "Wallet"
    ? "Wallet"
    : "Online Test Payment";

    const data = await saveOrder(method);

    setLoading(false);

    if (data.success) {
      if (!productId) localStorage.removeItem("cart");
      toast.success("Order placed successfully");
      window.location.href = `/order-success?orderId=${data.orderId}`;
    } else {
      toast.error(data.message || "Order failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-2xl bg-white p-4 shadow">
          <div className="grid grid-cols-3 text-center text-sm font-black">
            <Step active={step >= 1} number="1" title="Address" />
            <Step active={step >= 2} number="2" title="Order Summary" />
            <Step active={step >= 3} number="3" title="Complete Payment" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="space-y-5">
            <div className="rounded-2xl bg-white shadow">
              <StepHeader
                number="1"
                title="Delivery Address"
                active={step === 1}
                done={step > 1}
                onEdit={() => setStep(1)}
              />

              {step === 1 && (
  <div className="space-y-4 border-t p-5">

    <div className="rounded-xl border bg-green-50 p-4">
      <p className="font-bold">{name}</p>
      <p>{phone}</p>
      <p className="text-gray-600">{address}</p>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => setShowAddressForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Edit Address
        </button>

        <button
          type="button"
          onClick={() => {
            setName("");
            setPhone("");
            setAddress("");
            setShowAddressForm(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Add New Address
        </button>
      </div>
    </div>

    {showAddressForm && (
      <>
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          className="w-full rounded-xl border p-3"
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
        />
      </>
    )}

    <button
      onClick={continueAddress}
      className="rounded-xl bg-orange-500 px-8 py-3 font-black text-white hover:bg-orange-600"
    >
      Deliver Here
    </button>
  </div>
)}

              {step > 1 && (
                <div className="border-t p-5 text-sm">
                  <p className="font-black">{name}</p>
                  <p>{phone}</p>
                  <p className="text-gray-600">{address}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white shadow">
              <StepHeader
                number="2"
                title="Order Summary"
                active={step === 2}
                done={step > 2}
                onEdit={() => setStep(2)}
              />

              {step === 2 && (
                <div className="border-t p-5">
                  <OrderItems cart={cart} />

                  <div className="mt-5 flex gap-2">
                    <input
                      className="flex-1 rounded-xl border p-3"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    />

                    <button
                      type="button"
                      onClick={() => applyCouponCode(coupon)}
                      className="rounded-xl bg-blue-600 px-5 font-bold text-white"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {offerCoupons.map((offer) => (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => applyCouponCode(offer.code)}
                        className="flex justify-between rounded-xl border border-green-200 bg-green-50 p-3 text-left"
                      >
                        <span>
                          <b>{offer.code}</b>
                          <span className="ml-2 text-sm text-gray-600">
                            {offer.text}
                          </span>
                        </span>
                        <b className="text-blue-600">Apply</b>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={continueSummary}
                    className="mt-5 rounded-xl bg-orange-500 px-8 py-3 font-black text-white hover:bg-orange-600"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white shadow">
              <StepHeader
                number="3"
                title="Complete Payment"
                active={step === 3}
                done={false}
                onEdit={() => setStep(3)}
              />

              {step === 3 && (
                <div className="space-y-3 border-t p-5">
                 <PaymentOption
  value="UPI"
  selected={paymentMethod}
  setSelected={setPaymentMethod}
  title="UPI"
  text="Pay by any UPI app - PhonePe, GPay, Paytm"
/>

<PaymentOption
  value="Card"
  selected={paymentMethod}
  setSelected={setPaymentMethod}
  title="Credit / Debit / ATM Card"
  text="Pay using Visa, Mastercard, RuPay card"
/>

<PaymentOption
  value="COD"
  selected={paymentMethod}
  setSelected={setPaymentMethod}
  title="Cash on Delivery"
  text="Pay when your order is delivered."
/>

<PaymentOption
  value="EMI"
  selected={paymentMethod}
  setSelected={setPaymentMethod}
  title="EMI"
  text="Credit card EMI / No cost EMI"
/>

<PaymentOption
  value="Wallet"
  selected={paymentMethod}
  setSelected={setPaymentMethod}
  title="Wallet"
  text="Paytm Wallet / Amazon Pay / Other wallets"
/>
{paymentMethod === "UPI" && (
  <div className="rounded-xl border bg-slate-50 p-4">
    <label className="font-bold">UPI ID</label>
    <input
      className="mt-2 w-full rounded-xl border p-3"
      placeholder="example@upi"
    />
  </div>
)}

{paymentMethod === "Card" && (
  <div className="grid gap-3 rounded-xl border bg-slate-50 p-4 md:grid-cols-2">
    <input className="rounded-xl border p-3 md:col-span-2" placeholder="Card Number" />
    <input className="rounded-xl border p-3" placeholder="MM / YY" />
    <input className="rounded-xl border p-3" placeholder="CVV" />
  </div>
)}

{paymentMethod === "Wallet" && (
  <div className="rounded-xl border bg-slate-50 p-4">
    <label className="font-bold">Wallet Mobile Number</label>
    <input
      className="mt-2 w-full rounded-xl border p-3"
      placeholder="Enter wallet mobile number"
    />
  </div>
)}
                  <button
                    disabled={loading}
                    onClick={placeOrder}
                    className="mt-4 w-full rounded-xl bg-green-600 py-4 text-lg font-black text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {loading
  ? "Processing..."
  : paymentMethod === "COD"
  ? "Place COD Order"
  : paymentMethod === "UPI"
  ? "Pay with UPI"
  : paymentMethod === "Card"
  ? "Pay with Card"
  : paymentMethod === "EMI"
  ? "Pay with EMI"
  : "Pay with Wallet"}
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-4 text-xl font-black">Price Details</h2>

            <div className="space-y-3 text-sm">
              <PriceRow label={`Price (${cart.length} items)`} value={subtotal} />
              <PriceRow label="Discount" value={-discount} green />
              <PriceRow label="Delivery Charges" text="FREE" green />

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-black">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {discount > 0 && (
                <p className="rounded-xl bg-green-50 p-3 font-bold text-green-700">
                  You saved ₹{discount.toFixed(2)} on this order
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Step({
  active,
  number,
  title,
}: {
  active: boolean;
  number: string;
  title: string;
}) {
  return (
    <div className={active ? "text-blue-600" : "text-gray-400"}>
      <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-current text-xs">
        <span className="text-white">{number}</span>
      </span>
      {title}
    </div>
  );
}

function StepHeader({
  number,
  title,
  active,
  done,
  onEdit,
}: {
  number: string;
  title: string;
  active: boolean;
  done: boolean;
  onEdit: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-t-2xl p-4 ${
        active ? "bg-blue-600 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md text-sm font-black ${
            active ? "bg-white text-blue-600" : "bg-gray-100 text-blue-600"
          }`}
        >
          {number}
        </span>
        <h2 className="font-black">{title}</h2>
        {done && <span className="text-green-500">✅</span>}
      </div>

      {done && (
        <button onClick={onEdit} className="text-sm font-black text-blue-600">
          CHANGE
        </button>
      )}
    </div>
  );
}

function OrderItems({ cart }: { cart: any[] }) {
  if (cart.length === 0) {
    return <p className="text-center font-bold text-gray-500">Cart is empty</p>;
  }

  return (
    <div className="space-y-4">
      {cart.map((item, index) => (
        <div key={`${item.id}-${index}`} className="flex gap-4 border-b pb-4">
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-20 rounded bg-gray-100 object-contain"
          />

          <div className="flex-1">
            <h3 className="font-black">{item.name}</h3>

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

            <p className="text-sm">Qty: {item.quantity || 1}</p>
            <p className="font-black text-green-600">
              ₹{Number(item.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentOption({
  value,
  selected,
  setSelected,
  title,
  text,
}: {
  value: string;
  selected: string;
  setSelected: (v: string) => void;
  title: string;
  text: string;
})
 {
  
  return (
    <label
      className={`block cursor-pointer rounded-xl border p-4 ${
        selected === value ? "border-blue-600 bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex gap-3">
        <input
          type="radio"
          checked={selected === value}
          onChange={() => setSelected(value)}
        />

        <div>
          <p className="font-black">{title}</p>
          <p className="text-sm text-gray-500">{text}</p>
        </div>
      </div>
    </label>
  );
}

function PriceRow({
  label,
  value,
  text,
  green = false,
}: {
  label: string;
  value?: number;
  text?: string;
  green?: boolean;
}) {
  return (
    <div className={`flex justify-between ${green ? "text-green-600" : ""}`}>
      <span>{label}</span>
      <b>{text || `₹${Number(value || 0).toFixed(2)}`}</b>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
} 
