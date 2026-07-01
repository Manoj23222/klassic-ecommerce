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

// 🌟 SMART QUANTITY SELECTOR (AMAZON STYLE) 🌟
function QuantitySelector({
  initialQty,
  onUpdate,
}: {
  initialQty: number;
  onUpdate: (q: number) => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const [customQty, setCustomQty] = useState(initialQty);

  useEffect(() => {
    setCustomQty(initialQty);
  }, [initialQty]);

  return (
    <div className="relative">
      <select
        value={initialQty}
        onChange={(e) => {
          const val = e.target.value;

          if (val === "more") {
            setShowMore(true);
            return;
          }

          onUpdate(Number(val));
        }}
        className="mt-1 w-[92px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-[12px] font-bold outline-none focus:border-black"
      >
        <option value={1}>Qty: 1</option>
<option value={2}>Qty: 2</option>
<option value={3}>Qty: 3</option>
{initialQty > 3 && (
  <option value={initialQty}>Qty: {initialQty}</option>
)}
<option value="more">More</option>
      </select>

      {showMore && (
        <div className="absolute left-0 top-10 z-[9999] w-[210px] rounded-md border border-gray-300 bg-white p-3 shadow-xl">
          <h3 className="text-[13px] font-bold text-gray-900">
            Enter Quantity
          </h3>

          <input
            type="number"
            min={1}
            value={customQty}
            onChange={(e) => setCustomQty(Number(e.target.value || 1))}
            className="mt-2 h-8 w-full rounded border border-gray-300 px-2 text-center text-sm font-bold outline-none focus:border-blue-600"
          />

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMore(false)}
              className="text-[12px] font-bold text-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdate(customQty);
                setShowMore(false);
              }}
              className="text-[12px] font-bold text-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(true);
  const [openDelivery, setOpenDelivery] = useState(true);
  const [openPayment, setOpenPayment] = useState(false);
  const [flat, setFlat] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Calculate estimated delivery date (4 days from today)
  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

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
            setOpenDelivery(true);
            setOpenPayment(true); // Address mil gaya toh seedha Payment tab kholo
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
            basePrice: product.regularPrice || product.price || basePrice * 1.2,
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

  function updateQuantity(index: number, newQty: number) {
    if (newQty < 1) newQty = 1; // Quantity kabhi 0 ya minus me nahi honi chahiye
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQty;
    updatedCart[index].buyQty = newQty;
    setCart(updatedCart);
    
    if (!productId) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }

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

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );

          const data = await res.json();

          setAddress(data.display_name || "");
          setCity(
            data.address.city ||
            data.address.town ||
            data.address.village ||
            ""
          );
          setState(data.address.state || "");
          setPincode(data.address.postcode || "");

          toast.success("Location detected");
        } catch {
          toast.error("Unable to fetch address.");
        }
      },
      () => toast.error("Location permission denied.")
    );
  }

  async function fetchPincodeDetails(pin: string) {
  if (pin.length !== 6) return;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await res.json();

    const office = data?.[0]?.PostOffice?.[0];

    if (!office) {
      toast.error("Invalid Pincode");
      return;
    }

    setCity(office.Name || "");
    setDistrict(office.District || "");
    setState(office.State || "");

    toast.success("City/Village, District & State Auto Filled");
  } catch {
    toast.error("Unable to fetch pincode");
  }
}

  function validateCheckout() {
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Please complete delivery address");
      setOpenDelivery(true);
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
          <Link href="/" className="text-2xl font-black tracking-tight md:text-3xl text-blue-600">
            Klassic
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-3 py-4 md:gap-8 md:px-4 md:py-8 lg:grid-cols-[1fr_420px]">
        
        {/* LEFT COLUMN: Delivery & Payment */}
        <div className="space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-xs font-semibold text-gray-500 md:text-sm">
              Secure, simple and fast checkout.
            </p>
          </div>

          {/* 1. DELIVERY ADDRESS */}
          <LuxuryCard title="1. Delivery Address">
            
          
           {true && (
              <>
                {!showAddressForm && hasSavedAddress ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-4 md:rounded-2xl md:p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <h3 className="text-[16px] font-bold md:text-[18px]">
                            {name}
                          </h3>
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                            {addressType}
                          </span>
                        </div>

                        <p className="mt-3 text-[14px] font-medium leading-relaxed text-gray-700">
                          {address}
                          {landmark ? `, ${landmark}` : ""}, {city}, {state}{" "}
                          <span className="font-bold text-gray-900">{pincode}</span>
                        </p>

                        <p className="mt-2 text-[14px] font-bold text-gray-800">
                          {phone}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenPayment(true);
                            setOpenDelivery(false);
                          }}
                          className="mt-5 rounded-md bg-[#fb641b] px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#e65a17]"
                        >
                          Deliver Here
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(true);
                        }}
                        className="shrink-0 rounded-md border border-gray-300 px-4 py-2 text-[12px] font-bold text-blue-600 hover:border-blue-600 shadow-sm"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 md:gap-4 mt-2">
                    <FloatingInput label="Full Name" value={name} setValue={setName} />
                    <FloatingInput label="Mobile Number" value={phone} setValue={setPhone} />
                    <FloatingInput label="Flat, House No." value={flat} setValue={setFlat} />
                    <FloatingInput label="Area, Colony" value={address} setValue={setAddress} />
                    <FloatingInput
  label="Pincode"
  value={pincode}
  setValue={(v) => {
    const onlyNumber = v.replace(/\D/g, "").slice(0, 6);

    setPincode(onlyNumber);

    if (onlyNumber.length === 6) {
      fetchPincodeDetails(onlyNumber);
    }
  }}
/>

                    <FloatingInput label="City / Village" value={city} setValue={setCity} />
<FloatingInput label="District" value={district} setValue={setDistrict} />
                    <StateSelect value={state} setValue={setState} />
                    

                    <label className="block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500 md:text-xs">
                        Address Type
                      </span>
                      <select
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-bold outline-none focus:border-black focus:bg-white md:rounded-xl md:px-4 md:py-3.5 md:text-sm"
                      >
                        <option>Home</option>
                        <option>Office</option>
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
                        setOpenDelivery(false);
                        setOpenPayment(true);
                      }}
                      className="rounded-xl bg-[#fb641b] py-3 text-sm font-black text-white transition hover:bg-[#e65a17] md:col-span-2 md:rounded-xl md:py-4 shadow-sm mt-2"
                    >
                      Save & Deliver Here
                    </button>
                  </div>
                )}
              </>
            )}
          </LuxuryCard>

          {/* 2. PAYMENT METHOD */}
          <LuxuryCard title="2. Payment Method">
            {openPayment && (
              <>
                <p className="mb-4 text-xs font-medium text-gray-500 md:text-sm">
                  All transactions are secure and encrypted.
                </p>
<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
  <PaymentOption
    value="UPI"
    selected={paymentMethod}
    setSelected={setPaymentMethod}
    title="UPI"
    text="Pay by any UPI app"
  />

  {paymentMethod === "UPI" && (
    <div className="border-t border-gray-100 bg-gray-50 p-4">
      <FloatingInput label="UPI ID" value={upiId} setValue={setUpiId} />
    </div>
  )}

  <PaymentOption
    value="Card"
    selected={paymentMethod}
    setSelected={setPaymentMethod}
    title="Credit / Debit / ATM Card"
    text="Add and secure cards as per RBI guidelines"
  />

  {paymentMethod === "Card" && (
    <div className="grid gap-3 border-t border-gray-100 bg-gray-50 p-4 md:grid-cols-3">
      <FloatingInput label="Card Number" value={cardNumber} setValue={setCardNumber} />
      <FloatingInput label="MM / YY" value={cardExpiry} setValue={setCardExpiry} />
      <FloatingInput label="CVV" value={cardCvv} setValue={setCardCvv} />
    </div>
  )}

  <PaymentOption
    value="EMI"
    selected={paymentMethod}
    setSelected={setPaymentMethod}
    title="EMI"
    text="Easy monthly installments"
  />

  <PaymentOption
    value="Net Banking"
    selected={paymentMethod}
    setSelected={setPaymentMethod}
    title="Net Banking"
    text="Pay using your bank account"
  />

  <PaymentOption
    value="Wallet"
    selected={paymentMethod}
    setSelected={setPaymentMethod}
    title="Wallet"
    text="Paytm, PhonePe wallet and more"
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
                  className="mt-6 hidden w-full rounded-xl bg-[#fb641b] py-4 text-base font-black text-white transition hover:bg-[#e65a17] shadow-md disabled:opacity-60 md:block"
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

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] md:rounded-[1rem] lg:sticky lg:top-8 overflow-hidden">
          
          <div className="bg-gray-50 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center">
             <h2 className="text-lg font-black tracking-tight text-gray-800 md:text-xl">
               Order Summary
             </h2>
             <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded-full">{cart.length} Item(s)</span>
          </div>

          <div className="p-4 md:p-5">
            <div className="space-y-5">
              {cart.length === 0 ? (
                <p className="text-xs font-semibold text-gray-500 md:text-sm text-center py-5">
                  Cart is empty
                </p>
              ) : (
                cart.map((item, index) => {
                  const qty = Number(item.quantity || 1);
                  const unitPrice = Number(item.price || 0);
                  const unitBasePrice = Number(item.basePrice || item.price || 0);
                  
                  const itemTotal = unitPrice * qty;
                  const itemMrpTotal = (unitBasePrice > unitPrice ? unitBasePrice : unitPrice * 1.25) * qty;
                  const itemDiscountPercent = Math.round(((itemMrpTotal - itemTotal) / itemMrpTotal) * 100);

                  return (
                    <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      
                      {/* Product Image & Qty Dropdown */}
                      <div className="flex flex-col items-center gap-2 w-24 shrink-0">
                        <div className="h-24 w-24 rounded-xl border border-gray-200 bg-white p-2">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        
                        <QuantitySelector
                          initialQty={qty}
                          onUpdate={(newQty) => updateQuantity(index, newQty)}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-start">
                        <h3 className="line-clamp-2 text-[14px] font-semibold text-gray-900 leading-tight">
                          {item.name}
                        </h3>
                        
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] font-medium text-gray-500 md:text-xs">
                          {item.color && <span>Color: <b className="text-gray-800">{item.color}</b></span>}
                          {item.size && <span>Size: <b className="text-gray-800">{item.size}</b></span>}
                        </div>

                        {/* Rating Badge */}
                        <div className="mt-2 flex items-center gap-2">
                           <span className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                             4.5 ★
                           </span>
                           <span className="text-[11px] text-gray-500 font-medium">(Assured Quality)</span>
                        </div>
                        
                        {/* Pricing & Discounts */}
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-[17px] font-black text-gray-900">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[13px] font-medium text-gray-400 line-through mb-0.5">
                            ₹{itemMrpTotal.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[11px] font-bold text-green-600 mb-0.5">
                            {itemDiscountPercent}% Off
                          </span>
                        </div>

                        <p className="mt-2 text-[11px] font-medium text-gray-700">
                          Delivery by <span className="font-bold">{deliveryDate}</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Coupon Section */}
            <div className="mt-6 flex gap-2 border-t border-gray-100 pt-5">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Apply Promo Code"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold outline-none focus:border-black md:text-sm bg-gray-50"
              />

              <button
                type="button"
                onClick={() => applyCouponCode(coupon)}
                className="rounded-xl bg-black px-6 text-xs font-black text-white md:text-sm hover:bg-gray-800 transition shadow-sm"
              >
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 space-y-3 text-xs md:text-sm border-t border-gray-100 pt-5">
              <SummaryRow label="Price Details" text={`(${cart.length} Items)`} />
              <SummaryRow label="Subtotal" value={subtotal} />
              <SummaryRow label="Discount applied" value={-discount} green />
              <SummaryRow label="Delivery Charges" text="FREE" green />
              <SummaryRow label="Secured Packaging Fee" text="₹0" />

              <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                <div className="flex justify-between text-lg font-black md:text-[19px] text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-green-700 font-bold text-[11px] mt-1 text-right">
                  You will save ₹{(subtotal * 1.25 - total).toLocaleString("en-IN")} on this order
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 text-[11px] font-bold text-gray-500 text-center border-t border-gray-100 flex items-center justify-center gap-4">
             <span className="flex items-center gap-1">🛡️ Safe & Secure</span>
             <span className="flex items-center gap-1">✅ 100% Authentic</span>
          </div>
        </aside>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] md:hidden pb-safe">
        <button
          type="button"
          disabled={loading}
          onClick={handlePaymentSubmit}
          className="w-full rounded-xl bg-[#fb641b] py-3.5 text-sm font-black text-white disabled:opacity-60 shadow-md"
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
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-6 transition">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <h2 className="text-[17px] font-black tracking-tight text-gray-800 md:text-xl">
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
      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-black hover:border-black md:px-4 md:py-2 md:text-sm transition"
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
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500 md:text-[11px]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[13px] font-bold outline-none transition focus:border-black focus:bg-white md:rounded-xl md:px-4 md:py-3.5 md:text-sm"
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
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500 md:text-[11px]">
        State
      </span>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[13px] font-bold outline-none transition focus:border-black focus:bg-white md:rounded-xl md:px-4 md:py-3.5 md:text-sm"
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
  const active = selected === value;

  return (
    <label
      className={`block cursor-pointer border-b border-gray-200 p-4 transition last:border-b-0 ${
        active ? "bg-gray-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          checked={active}
          onChange={() => setSelected(value)}
          className="mt-1 h-4 w-4 accent-blue-600"
        />

        <div>
          <p className="text-[15px] font-black text-gray-900">{title}</p>
          <p className="mt-1 text-[12px] font-semibold text-gray-500">{text}</p>

          {value === "Card" && (
            <p className="mt-2 text-[12px] font-bold text-green-700">
              Get upto 5% cashback • 2 offers available
            </p>
          )}
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
    <div className={`flex justify-between ${green ? "text-green-600 font-bold" : "text-gray-700 font-medium"}`}>
      <span>{label}</span>
      <span>{text || `₹${Number(value || 0).toLocaleString("en-IN")}`}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-bold">Loading secure checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}