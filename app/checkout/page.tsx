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
  const quantityFromUrl = searchParams.get("quantity") || "";
  const priceFromUrl = searchParams.get("price") || "";
  const qtyFromUrl = Number(searchParams.get("qty") || 1);
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
  const [openPayment, setOpenPayment] = useState(true);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();

      if (!data.success) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          "/checkout"
        )}`;
        return;
      }

      if (data.user?.email) setEmail(data.user.email);
      if (data.user?.name) setName(data.user.name);
      if (data.user?.phone) setPhone(data.user.phone);
    }

    checkLogin();
  }, []);

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
          setAddressType(saved.addressType || saved.address_type || "Home");

          if (
            saved.name &&
            saved.phone &&
            saved.address &&
            saved.city &&
            saved.state &&
            saved.pincode
          ) {
            setShowAddressForm(false);
          }
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
        const basePrice = Number(
          product.sale_price || product.salePrice || product.price
        );

        const finalPrice =
          Number(priceFromUrl || 0) > 0
            ? Number(priceFromUrl)
            : getSizePrice(basePrice, sizeFromUrl);

        setCart([
          {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            price: finalPrice,
            basePrice,
            image: product.image,
            quantity: qtyFromUrl,
            buyQty: qtyFromUrl,
            color: colorFromUrl,
            size: quantityFromUrl || sizeFromUrl,
            selectedQuantity: quantityFromUrl,
          },
        ]);
      } else {
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
      }
    }

    loadCheckout();
  }, [productId, colorFromUrl, sizeFromUrl, quantityFromUrl, priceFromUrl, qtyFromUrl]);

  useEffect(() => {
    if (couponFromUrl) setCoupon(couponFromUrl);
  }, [couponFromUrl]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const deliveryCharge = subtotal > 0 ? 0 : 0;
  const gstAmount = 0;
  const total = Math.max(subtotal - discount + deliveryCharge + gstAmount, 0);

  const hasSavedAddress =
    name && phone && address && city && state && pincode;

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
      toast.error("Please complete delivery address");
      setShowAddressForm(true);
      return false;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    return true;
  }

  async function startPaytmPayment(method = paymentMethod) {
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
          email,
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
          payment_method: method === "Card" ? "Card" : "Paytm",
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
        email,
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

  function handlePaymentSubmit() {
    if (paymentMethod === "COD") {
      placeOrder();
      return;
    }

    startPaytmPayment(paymentMethod);
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-28 text-gray-900 md:pb-8">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3 md:py-5">
          <Link href="/" className="text-2xl font-black tracking-tight md:text-3xl">
            Klassic
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-3 py-4 md:gap-8 md:px-4 md:py-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-xs font-semibold text-gray-500 md:text-sm">
              Secure, simple and fast checkout.
            </p>
          </div>

          <LuxuryCard title="1. Delivery Address">
            {!showAddressForm && hasSavedAddress ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 md:rounded-2xl md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-500 md:text-sm">
                      Deliver to:
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black md:text-lg">
                        {name}
                      </h3>
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-black uppercase text-gray-600">
                        {addressType}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
                      {address}
                      {landmark ? `, ${landmark}` : ""}, {city}, {state}{" "}
                      {pincode}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="shrink-0 rounded-md border border-gray-300 px-4 py-2 text-xs font-black text-blue-600 hover:border-blue-600 md:text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <FloatingInput label="Full Name" value={name} setValue={setName} />
                <FloatingInput label="Mobile Number" value={phone} setValue={setPhone} />
                <FloatingInput label="Complete Address" value={address} setValue={setAddress} />
                <FloatingInput label="Pincode" value={pincode} setValue={setPincode} />
                <FloatingInput label="City" value={city} setValue={setCity} />
                <StateSelect value={state} setValue={setState} />
                <FloatingInput label="Landmark" value={landmark} setValue={setLandmark} />

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400 md:text-xs">
                    Address Type
                  </span>
                  <select
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold outline-none focus:border-black md:rounded-2xl md:px-4 md:py-4 md:text-sm"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (!name || !phone || !address || !city || !state || !pincode) {
                      toast.error("Please complete delivery address");
                      return;
                    }

                    setShowAddressForm(false);
                    setOpenPayment(true);
                  }}
                  className="rounded-xl bg-black py-3 text-sm font-black text-white md:col-span-2 md:rounded-full md:py-4"
                >
                  Save & Deliver Here
                </button>
              </div>
            )}
          </LuxuryCard>

          <LuxuryCard
            title="2. Payment Method"
            action={
              <ToggleSectionButton
                open={openPayment}
                onClick={() => setOpenPayment(!openPayment)}
              />
            }
          >
            {openPayment && (
              <>
                <p className="mb-3 text-xs font-semibold text-gray-500 md:text-sm">
                  All transactions are secure and encrypted.
                </p>

                <div className="space-y-2 md:space-y-3">
                  <PaymentOption
                    value="Card"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="Credit / Debit Card"
                    text="Visa, Mastercard, RuPay"
                  />

                  {paymentMethod === "Card" && (
                    <div className="grid gap-3 rounded-2xl bg-gray-50 p-3 md:grid-cols-3 md:rounded-3xl md:p-4">
                      <FloatingInput label="Card Number" value={cardNumber} setValue={setCardNumber} />
                      <FloatingInput label="MM / YY" value={cardExpiry} setValue={setCardExpiry} />
                      <FloatingInput label="CVV" value={cardCvv} setValue={setCardCvv} />
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
                    <div className="rounded-2xl bg-gray-50 p-3 md:rounded-3xl md:p-4">
                      <FloatingInput label="UPI ID" value={upiId} setValue={setUpiId} />
                    </div>
                  )}

                  <PaymentOption
                    value="Paytm"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="Paytm Wallet"
                    text="Pay using Paytm Wallet / Paytm App"
                  />

                  <PaymentOption
                    value="COD"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="Cash on Delivery"
                    text="Pay when delivered"
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePaymentSubmit}
                  className="mt-5 hidden w-full rounded-full bg-black py-4 text-base font-black text-white transition hover:bg-gray-800 disabled:opacity-60 md:block"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "COD"
                    ? `Place COD Order ₹${total.toLocaleString("en-IN")}`
                    : `Pay Now ₹${total.toLocaleString("en-IN")}`}
                </button>
              </>
            )}
          </LuxuryCard>
        </div>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:rounded-[2rem] md:p-5 lg:sticky lg:top-8">
          <h2 className="text-lg font-black tracking-tight md:text-xl">
            Order Summary
          </h2>

          <div className="mt-4 space-y-3 md:mt-5 md:space-y-4">
            {cart.length === 0 ? (
              <p className="text-xs font-semibold text-gray-500 md:text-sm">
                Cart is empty
              </p>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-3 md:gap-4">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl bg-gray-50 object-contain p-2 md:h-20 md:w-20 md:rounded-2xl"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-xs font-black md:text-sm">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold text-gray-500 md:text-xs">
                      {item.color ? `${item.color}` : ""}
                      {item.size ? ` / ${item.size}` : ""}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-500 md:text-xs">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="text-xs font-black md:text-sm">
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2 md:mt-6">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Promo code"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-3 text-xs font-bold outline-none focus:border-black md:rounded-full md:px-4 md:text-sm"
            />

            <button
              type="button"
              onClick={() => applyCouponCode(coupon)}
              className="rounded-xl bg-gray-900 px-4 text-xs font-black text-white md:rounded-full md:px-5 md:text-sm"
            >
              Apply
            </button>
          </div>

          <div className="mt-4 space-y-2 text-xs md:mt-6 md:space-y-3 md:text-sm">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Discount" value={-discount} green />
            <SummaryRow label="Shipping" text="Free" green />
            <SummaryRow label="Estimated Taxes" text="Included" />

            <div className="border-t pt-3 md:pt-4">
              <div className="flex justify-between text-lg font-black md:text-xl">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1 rounded-2xl bg-gray-50 p-3 text-[10px] font-bold text-gray-600 md:mt-6 md:rounded-3xl md:p-4 md:text-xs">
            <p>🔒 Secure SSL Encryption</p>
            <p>🛡️ 7-Day Free Returns</p>
            <p>✅ Trusted Klassic Checkout</p>
          </div>
        </aside>
      </section>

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t bg-white/95 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden">
        <button
          type="button"
          disabled={loading}
          onClick={handlePaymentSubmit}
          className="w-full rounded-xl bg-black py-3 text-sm font-black text-white disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "COD"
            ? `Place Order ₹${total.toLocaleString("en-IN")}`
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>
      </div>
    </main>
  );
}

function LuxuryCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] md:rounded-[2rem] md:p-7">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <h2 className="text-base font-black tracking-tight md:text-xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ToggleSectionButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-black hover:border-black md:px-4 md:py-2 md:text-sm"
    >
      {open ? "⌃" : "⌄"}
    </button>
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
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400 md:text-xs">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold outline-none transition focus:border-black md:rounded-2xl md:px-4 md:py-4 md:text-sm"
      />
    </label>
  );
}

function StateSelect({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400 md:text-xs">
        State
      </span>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold outline-none transition focus:border-black md:rounded-2xl md:px-4 md:py-4 md:text-sm"
      >
        <option value="">Select State</option>
        {states.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
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
      className={`block cursor-pointer rounded-2xl border p-3 transition md:rounded-3xl md:p-4 ${
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
          <p className="text-sm font-black md:text-base">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-gray-500 md:mt-1 md:text-sm">
            {text}
          </p>
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