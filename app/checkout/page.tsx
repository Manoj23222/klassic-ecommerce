"use client";

import Link from "next/link";
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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);

  useEffect(() => {
    async function loadAddress() {
      try {
        const res = await fetch("/api/account/address", { cache: "no-store" });
        const data = await res.json();
        const saved = data.address || data.user;

        if (data.success && saved) {
          setName(saved.name || "");
          setPhone(saved.phone || "");
          setEmail(saved.email || "");
          setAddress(saved.address || "");
          setCity(saved.city || "");
          setState(saved.state || "");
          setPincode(saved.pincode || "");
          setLandmark(saved.landmark || "");
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
        const basePrice = Number(product.sale_price || product.salePrice || product.price);
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
  useEffect(() => {
  async function createOrderAfterPaytmSuccess() {
    const paytmStatus = searchParams.get("paytm_status");
    const paytmTxnId = searchParams.get("paytm_txn_id");

    if (paytmStatus !== "success") return;

    const pendingOrder = localStorage.getItem("pending_paytm_order");

    if (!pendingOrder) {
      toast.error("Payment success, but order data missing");
      return;
    }

    try {
      setLoading(true);

      const payload = JSON.parse(pendingOrder);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          payment_method: "Paytm",
          payment_status: "Paid",
          payment_transaction_id: paytmTxnId || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("pending_paytm_order");
        if (!productId) localStorage.removeItem("cart");

        toast.success("Payment successful. Order placed.");
        window.location.href = `/order-success?orderId=${data.orderId}`;
      } else {
        toast.error(data.message || "Order create failed after payment");
      }
    } catch {
      toast.error("Order create failed after payment");
    } finally {
      setLoading(false);
    }
  }

  createOrderAfterPaytmSuccess();
}, [searchParams, productId]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const deliveryCharge = subtotal > 0 ? 0 : 0;
  const gstAmount = 0;
  const total = Math.max(subtotal - discount + deliveryCharge + gstAmount, 0);

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

  function validateCheckout() {
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Please complete shipping details");
      return false;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    return true;
  }
async function startPaytmPayment() {
  if (!validateCheckout()) return;

  try {
    setLoading(true);

    const res = await fetch("/api/payment/paytm-initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();

    if (!data.success || !data.txnToken) {
      toast.error(data.message || "Paytm payment start failed");
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "pending_paytm_order",
      JSON.stringify({
        customer_name: name,
        phone,
        address,
        pincode,
        city,
        state,
        landmark,
        address_type: addressType,
        subtotal,
        delivery_charge: deliveryCharge,
        gst_amount: gstAmount,
        total,
        cart,
        payment_method: "Paytm",
        coupon_code: coupon,
        discount,
      })
    );

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${data.mid}&orderId=${data.orderId}`;

    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "txnToken";
    tokenInput.value = data.txnToken;

    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit();
  } catch {
    toast.error("Paytm payment failed");
    setLoading(false);
  }
}
  async function placeOrder() {
    if (!validateCheckout()) return;

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        phone,
        address,
        pincode,
        city,
        state,
        landmark,
        address_type: addressType,
        subtotal,
        delivery_charge: deliveryCharge,
        gst_amount: gstAmount,
        total,
        cart,
        payment_method: paymentMethod,
        coupon_code: coupon,
        discount,
      }),
    });

    const data = await res.json();
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
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-5">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Klassic
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Secure, simple and distraction-free checkout.
            </p>
          </div>

          <LuxuryCard title="Express Checkout">
            <div className="grid gap-3 sm:grid-cols-3">
              <ExpressButton text="GPay" />
              <ExpressButton text="UPI" />
              <ExpressButton text="Wallet" />
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Or continue below
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </LuxuryCard>

          <LuxuryCard title="1. Contact Information">
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInput label="Full Name" value={name} setValue={setName} />
              <FloatingInput label="Mobile Number" value={phone} setValue={setPhone} />
              <FloatingInput
                label="Email Address"
                value={email}
                setValue={setEmail}
                type="email"
              />
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input type="checkbox" className="h-4 w-4 accent-black" />
              Email me with updates and offers
            </label>
          </LuxuryCard>

          <LuxuryCard title="2. Shipping Address">
  {address && city && state && pincode && !showAddressForm ? (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black">{name}</p>
          <p className="mt-1 text-sm font-bold text-gray-600">{phone}</p>
          <p className="mt-2 text-sm font-semibold text-gray-600">
            {address}, {city}, {state} - {pincode}
          </p>

          {landmark && (
            <p className="mt-1 text-sm text-gray-500">
              Landmark: {landmark}
            </p>
          )}

          <span className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-xs font-black">
            {addressType}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowAddressForm(true)}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-black hover:border-black"
        >
          Change
        </button>
      </div>
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2">
      <FloatingInput label="Complete Address" value={address} setValue={setAddress} />
      <FloatingInput label="Pincode" value={pincode} setValue={setPincode} />
      <FloatingInput label="City" value={city} setValue={setCity} />
      <FloatingInput label="State" value={state} setValue={setState} />
      <FloatingInput label="Landmark" value={landmark} setValue={setLandmark} />

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
          Address Type
        </span>
        <select
          value={addressType}
          onChange={(e) => setAddressType(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-bold outline-none focus:border-black"
        >
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() => setShowAddressForm(false)}
        className="md:col-span-2 rounded-full bg-black py-4 font-black text-white"
      >
        Save Address
      </button>
    </div>
  )}
</LuxuryCard>

          <LuxuryCard title="3. Payment">
            <p className="mb-4 text-sm font-semibold text-gray-500">
              All transactions are secure and encrypted.
            </p>

            <div className="space-y-3">
              <PaymentOption
                value="Card"
                selected={paymentMethod}
                setSelected={setPaymentMethod}
                title="Credit / Debit Card"
                text="Visa, Mastercard, RuPay"
              />

              {paymentMethod === "Card" && (
                <div className="grid gap-3 rounded-3xl bg-gray-50 p-4 md:grid-cols-2">
                  <FloatingInput label="Card Number" value="" setValue={() => {}} />
                  <FloatingInput label="MM / YY" value="" setValue={() => {}} />
                  <FloatingInput label="CVV" value="" setValue={() => {}} />
                </div>
              )}

              <PaymentOption
                value="UPI"
                selected={paymentMethod}
                setSelected={setPaymentMethod}
                title="UPI"
                text="PhonePe, Google Pay, Paytm"
              />

              {paymentMethod === "UPI" && (
                <div className="rounded-3xl bg-gray-50 p-4">
                  <FloatingInput label="UPI ID" value="" setValue={() => {}} />
                </div>
              )}

              <PaymentOption
                value="COD"
                selected={paymentMethod}
                setSelected={setPaymentMethod}
                title="Cash on Delivery"
                text="Pay when your order is delivered"
              />
            </div>

            <button
              disabled={loading}
              onClick={paymentMethod === "COD" ? placeOrder : startPaytmPayment}
              className="mt-6 w-full rounded-full bg-black py-4 text-base font-black text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Processing..." : `Place Order ₹${total.toLocaleString("en-IN")}`}
            </button>
          </LuxuryCard>
        </div>

        <aside className="h-fit rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] lg:sticky lg:top-8">
          <h2 className="text-xl font-black tracking-tight">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {cart.length === 0 ? (
              <p className="text-sm font-semibold text-gray-500">Cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl bg-gray-50 object-contain p-2"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-black">{item.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-gray-500">
                      {item.color ? `${item.color}` : ""}
                      {item.size ? ` / ${item.size}` : ""}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="text-sm font-black">
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Promo code"
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-bold outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={() => applyCouponCode(coupon)}
              className="rounded-full bg-gray-900 px-5 text-sm font-black text-white"
            >
              Apply
            </button>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Discount" value={-discount} green />
            <SummaryRow label="Shipping" text="Free" green />
            <SummaryRow label="Estimated Taxes" text="Included" />

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-3xl bg-gray-50 p-4 text-xs font-bold text-gray-600">
            <p>🔒 Secure 256-bit SSL Encryption</p>
            <p>🛡️ 7-Day Free Returns</p>
            <p>✅ Trusted Klassic Checkout</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function LuxuryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:p-7">
      <h2 className="mb-5 text-xl font-black tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function FloatingInput({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-bold outline-none transition focus:border-black"
      />
    </label>
  );
}

function ExpressButton({ text }: { text: string }) {
  return (
    <button className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-black transition hover:border-black">
      {text}
    </button>
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
}) {
  return (
    <label
      className={`block cursor-pointer rounded-3xl border p-4 transition ${
        selected === value
          ? "border-black bg-gray-50"
          : "border-gray-200 bg-white hover:border-gray-400"
      }`}
    >
      <div className="flex gap-3">
        <input
          type="radio"
          checked={selected === value}
          onChange={() => setSelected(value)}
          className="mt-1 accent-black"
        />

        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm font-semibold text-gray-500">{text}</p>
        </div>
      </div>
    </label>
  );
}

function SummaryRow({
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
    <div className={`flex justify-between ${green ? "text-green-700" : ""}`}>
      <span className="font-semibold text-gray-500">{label}</span>
      <b>{text || `₹${Number(value || 0).toLocaleString("en-IN")}`}</b>
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