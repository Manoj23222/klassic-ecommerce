"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
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

  const [step, setStep] = useState(1);

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

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sendOtp = async () => {
    if (!isGmail(form.email)) return toast.error("Please enter valid Gmail");

    try {
      setLoadingOtp(true);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "seller-register" }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("seller_register_form");
        toast.success("OTP sent to Gmail");
        setOtpSent(true);
        setOtpVerified(false);
      } else {
        toast.error(data.message || "OTP send failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoadingOtp(false);
    }
  };

  useEffect(() => {
  const saved = localStorage.getItem("seller_register_form");

  if (saved) {
    setForm(JSON.parse(saved));
  }
}, []);
useEffect(() => {
  const savedStep = localStorage.getItem("seller_register_step");

  if (savedStep) {
    setStep(Number(savedStep));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "seller_register_step",
    String(step)
  );
}, [step]);
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) return toast.error("Enter 6 digit OTP");

    try {
      setLoadingVerify(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp, purpose: "seller-register" }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Gmail verified");
        setOtpVerified(true);
      } else {
        toast.error(data.message || "OTP failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoadingVerify(false);
    }
  };

  const continueStep = () => {
    if (!isIndianMobile(form.phone)) return toast.error("Enter valid mobile number");
    if (!isGmail(form.email)) return toast.error("Only valid Gmail allowed");
    if (!otpVerified) return toast.error("Please verify Gmail OTP");
    if (!isStrongPassword(form.password)) {
      return toast.error("Use strong password. Example: Klassic@123");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Password not matched");
    }

    localStorage.setItem(
  "seller_register_step",
  "2"
);

setStep(2);
  };

  const submitSellerRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name.trim().length < 3) return toast.error("Name minimum 3 characters");
    if (form.store_name.trim().length < 3) return toast.error("Store name required");
    if (!form.category) return toast.error("Select category");
    if (!isPAN(form.pan.toUpperCase())) return toast.error("Enter valid PAN");
  
    if (form.address.trim().length < 10) return toast.error("Enter full address");

    try {
      setLoading(true);

      const res = await fetch("/api/seller-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email.toLowerCase(),
          pan: form.pan.toUpperCase(),
          gst: form.gst ? form.gst.toUpperCase() : "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("seller_register_form");
localStorage.removeItem("seller_register_step");
        toast.success("Seller request submitted");
        setTimeout(() => router.push("/seller/register-success"), 1200);
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen bg-white">
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold">
          Klassic <span className="text-blue-600">Seller</span>
        </Link>

        <Link href="/seller/login" className="font-bold text-blue-600">
          Login
        </Link>
      </div>
    </header>

    <section className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-3 md:gap-5 mb-8 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full border-2 border-gray-700 flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <span className={`text-lg md:text-2xl font-extrabold ${step === 1 ? "text-gray-900" : "text-gray-500"}`}>
            EMAIL & PASSWORD
          </span>
        </div>

        <div className="w-10 md:w-16 h-[3px] bg-gray-300 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <span className={`text-lg md:text-2xl font-extrabold ${step === 2 ? "text-gray-900" : "text-gray-500"}`}>
            BUSINESS DETAILS
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl border shadow-sm p-4 md:p-8">
          <div className="space-y-5">
            <input
              className="field"
              placeholder="Enter Mobile Number *"
              value={form.phone}
              maxLength={10}
              onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
            />

            <div className="flex gap-2">
              <input
                className="field"
                placeholder="Email ID *"
                type="email"
                value={form.email}
                onChange={(e) => {
                  updateField("email", e.target.value.toLowerCase());
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtp("");
                }}
              />

              <button
                type="button"
                onClick={sendOtp}
                disabled={loadingOtp || otpVerified}
                className="min-w-[95px] md:min-w-[120px] border-2 border-gray-200 rounded-2xl text-blue-600 font-extrabold disabled:text-gray-400"
              >
                {loadingOtp ? "..." : otpVerified ? "Done" : "Send OTP"}
              </button>
            </div>

            {otpSent && !otpVerified && (
              <div className="flex gap-2">
                <input
                  className="field"
                  placeholder="Enter 6 Digit OTP *"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loadingVerify}
                  className="min-w-[95px] md:min-w-[120px] bg-green-600 text-white rounded-2xl font-bold"
                >
                  {loadingVerify ? "..." : "Verify"}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-2xl text-green-700 font-bold text-sm">
                Gmail OTP verified successfully ✅
              </div>
              
            )}

            <input
              className="field"
              placeholder="Create Password *"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />

            <input
              className="field"
              placeholder="Confirm Password *"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
            />

            <p className="text-gray-600 text-sm md:text-base">
              By continuing, I agree to Klassic&apos;s{" "}
              <span className="text-blue-600 font-bold">Terms of Use</span> &{" "}
              <span className="text-blue-600 font-bold">Privacy Policy</span>
            </p>

            <button
              type="button"
              onClick={continueStep}
              className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-lg md:text-xl font-extrabold"
            >
              Register & Continue →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submitSellerRequest} className="bg-white rounded-3xl border shadow-sm p-4 md:p-8 space-y-5">
          <button type="button" onClick={() => setStep(1)} className="text-blue-600 font-bold">
            ← Back
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            <input className="field" placeholder="Full Name *" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            <input className="field" placeholder="Store Name *" value={form.store_name} onChange={(e) => updateField("store_name", e.target.value)} />

            <select className="field" value={form.business_type} onChange={(e) => updateField("business_type", e.target.value)}>
              <option value="Individual">Individual</option>
              <option value="Small Business">Small Business</option>
              <option value="Company">Company</option>
            </select>

            <select className="field" value={form.category} onChange={(e) => updateField("category", e.target.value)}>
              <option value="">Select Product Category *</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Grocery">Grocery</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>

            <input className="field" placeholder="PAN Number *" value={form.pan} maxLength={10} onChange={(e) => updateField("pan", e.target.value.toUpperCase())} />
            <input className="field" placeholder="GST Number " value={form.gst} maxLength={15} onChange={(e) => updateField("gst", e.target.value.toUpperCase())} />

            <textarea className="field md:col-span-2" placeholder="Store / Pickup Address *" rows={4} value={form.address} onChange={(e) => updateField("address", e.target.value)} />
          </div>

          <button disabled={loading} className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-lg md:text-xl font-extrabold disabled:bg-gray-400">
            {loading ? "Submitting..." : "Submit Seller Request →"}
          </button>
        </form>
      )}
    </section>

    <style jsx>{`
      .field {
        width: 100%;
        border: 2px solid #d1d5db;
        padding: 14px 18px;
        border-radius: 16px;
        font-size: 16px;
        outline: none;
      }
      .field:focus {
        border-color: #2563eb;
      }
      @media (min-width: 768px) {
        .field {
          padding: 18px 24px;
          font-size: 18px;
        }
      }
    `}</style>
  </main>
);
}