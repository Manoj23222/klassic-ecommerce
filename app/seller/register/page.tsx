"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}
function isIndianMobile(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}
function isPAN(pan: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}
function isGST(gst: string) {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}
function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

export default function SellerRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    store_name: "",
    business_type: "Individual",
    category: "",
    pan: "",
    gst: "",
    address: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sendOtp = async () => {
    if (!isGmail(form.email)) return toast.error("Please enter valid Gmail address first");

    try {
      setLoadingOtp(true);
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "seller-register" }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP sent to seller Gmail");
        setOtpSent(true);
        setOtpVerified(false);
      } else {
        toast.error(data.message || "OTP send failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) return toast.error("Please enter 6 digit OTP");

    try {
      setLoadingVerify(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp, purpose: "seller-register" }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Seller Gmail OTP verified");
        setOtpVerified(true);
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingVerify(false);
    }
  };

  const submitSellerRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name.trim().length < 3) return toast.error("Name must be at least 3 characters");
    if (!isGmail(form.email)) return toast.error("Only valid Gmail address allowed");
    if (!otpVerified) return toast.error("Please verify seller Gmail OTP first");
    if (!isIndianMobile(form.phone)) return toast.error("Enter valid 10 digit Indian mobile number");
    if (!isStrongPassword(form.password)) return toast.error("Password must be strong. Example: Klassic@123");
    if (form.password !== form.confirmPassword) return toast.error("Confirm password does not match");
    if (form.store_name.trim().length < 3) return toast.error("Store name must be at least 3 characters");
    if (!form.category) return toast.error("Please select product category");
    if (!isPAN(form.pan.toUpperCase())) return toast.error("Enter valid PAN number. Example: ABCDE1234F");
    if (form.gst.trim() && !isGST(form.gst.toUpperCase())) return toast.error("Enter valid GST number or leave it blank");
    if (form.address.trim().length < 10) return toast.error("Enter full pickup/store address");
    if (!agree) return toast.error("Please accept seller terms and conditions");

    try {
      setLoading(true);

      const res = await fetch("/api/seller-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email.toLowerCase(),
          pan: form.pan.toUpperCase(),
          gst: form.gst.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Seller request submitted successfully");
        setTimeout(() => router.push("/seller/register-success"), 1500);
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 border">
          <h1 className="text-2xl md:text-3xl font-extrabold">Klassic Seller Application</h1>
          <p className="text-gray-600 text-sm mt-2">Create your seller account. Admin approval is required.</p>

          <form onSubmit={submitSellerRequest} className="mt-6 grid md:grid-cols-2 gap-4">
            <input className="border p-3 rounded-xl" placeholder="Full Name *" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />

            <div className="flex gap-2">
              <input className="w-full border p-3 rounded-xl" placeholder="Gmail Address *" type="email" value={form.email} onChange={(e) => {
                updateField("email", e.target.value.toLowerCase());
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
              }} required />

              <button type="button" onClick={sendOtp} disabled={loadingOtp || otpVerified} className="bg-black text-white px-4 rounded-xl font-bold text-sm disabled:bg-gray-400">
                {loadingOtp ? "Sending..." : otpVerified ? "Done" : "OTP"}
              </button>
            </div>

            {otpSent && !otpVerified && (
              <div className="md:col-span-2 flex gap-2">
                <input className="w-full border p-3 rounded-xl" placeholder="Enter 6 digit OTP" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
                <button type="button" onClick={verifyOtp} disabled={loadingVerify} className="bg-green-600 text-white px-4 rounded-xl font-bold text-sm disabled:bg-gray-400">
                  {loadingVerify ? "Checking..." : "Verify"}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="md:col-span-2 bg-green-50 border border-green-200 p-3 rounded-xl text-xs text-green-700 font-bold">
                Seller Gmail OTP verified successfully ✅
              </div>
            )}

            <input className="border p-3 rounded-xl" placeholder="10 Digit Mobile Number *" value={form.phone} maxLength={10} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))} required />

            <input className="border p-3 rounded-xl" placeholder="Create Password *" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} required />

            <input className="border p-3 rounded-xl" placeholder="Confirm Password *" type="password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} required />

            <input className="border p-3 rounded-xl" placeholder="Store Name *" value={form.store_name} onChange={(e) => updateField("store_name", e.target.value)} required />

            <select className="border p-3 rounded-xl" value={form.business_type} onChange={(e) => updateField("business_type", e.target.value)}>
              <option value="Individual">Individual</option>
              <option value="Small Business">Small Business</option>
              <option value="Company">Company</option>
            </select>

            <select className="border p-3 rounded-xl" value={form.category} onChange={(e) => updateField("category", e.target.value)} required>
              <option value="">Select Product Category *</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Grocery">Grocery</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>

            <input className="border p-3 rounded-xl" placeholder="PAN Number *" value={form.pan} maxLength={10} onChange={(e) => updateField("pan", e.target.value.toUpperCase())} required />
            <input className="border p-3 rounded-xl" placeholder="GST Number" value={form.gst} maxLength={15} onChange={(e) => updateField("gst", e.target.value.toUpperCase())} />

            <textarea className="border p-3 rounded-xl md:col-span-2" placeholder="Store / Pickup Address *" rows={4} value={form.address} onChange={(e) => updateField("address", e.target.value)} required />

            <label className="md:col-span-2 flex gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
              <span>I agree that my products will be genuine, pricing will be correct, and Klassic admin can approve or reject my seller request.</span>
            </label>

            <button disabled={loading || !otpVerified} className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-extrabold disabled:from-gray-400 disabled:to-gray-400">
              {loading ? "Submitting..." : "Submit Seller Request"}
            </button>
          </form>
          <div className="mt-6 border-t pt-6">
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-center">
    <div className="text-3xl mb-2">🏪</div>

    <h3 className="text-lg font-bold text-gray-900">
      Already Approved Seller?
    </h3>

    <p className="text-sm text-gray-600 mt-1">
      Login to Seller Hub and manage your products, orders and business.
    </p>

    <Link
      href="/seller/login"
      className="inline-flex items-center justify-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
    >
      Login to Seller Hub →
    </Link>
  </div>
</div>
          <div className="mt-5 text-center text-sm">
  <span className="text-gray-600">Already approved seller? </span>

  <a
    href="/seller/login"
    className="text-blue-600 font-bold hover:underline"
  >
    Login to Seller Hub
  </a>
</div>
        </div>
      </section>
    </main>
  );
}