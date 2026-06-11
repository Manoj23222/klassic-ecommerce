"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

function isIndianMobile(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    setOtpMessage("");
    setOtpError("");

    if (!isGmail(email)) {
      toast.error("Please enter valid Gmail address first");
      setOtpError("Please enter valid Gmail address first");
      return;
    }

    try {
      setLoadingOtp(true);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "register" }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp("");
        setTimer(60);
        setOtpMessage("OTP sent to your Gmail. Please check inbox.");
        toast.success("OTP sent to your Gmail");
      } else {
        setOtpError(data.message || "OTP send failed");
        toast.error(data.message || "OTP send failed");
      }
    } catch {
      setOtpError("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setOtpMessage("");
    setOtpError("");

    if (!otp || otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      setOtpError("Please enter 6 digit OTP");
      return;
    }

    try {
      setLoadingVerify(true);
      setOtpMessage("Verifying OTP...");

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose: "register" }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpVerified(true);
        setTimer(0);
        setOtpError("");
        setOtpMessage("OTP verified successfully.");
        toast.success("OTP verified successfully");
      } else {
        setOtpVerified(false);
        setOtpMessage("");
        setOtpError(data.message || "Invalid OTP. Please try again.");
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setOtpVerified(false);
      setOtpMessage("");
      setOtpError("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingVerify(false);
    }
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 3) return toast.error("Name must be at least 3 characters");
    if (!isGmail(email)) return toast.error("Only valid Gmail address allowed");
    if (!otpVerified) return toast.error("Please verify Gmail OTP first");
    if (!isIndianMobile(phone)) return toast.error("Enter valid 10 digit Indian mobile number");
    if (!isStrongPassword(password)) return toast.error("Password is not strong");
    if (password !== confirmPassword) return toast.error("Confirm password does not match");

    try {
      setLoadingRegister(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpMessage("Account created successfully. Redirecting to login...");
        toast.success("Account created successfully");

        setTimeout(() => {
          window.location.href =
            "/login?registered=true&email=" + encodeURIComponent(email);
        }, 1500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 flex items-center justify-center px-3 py-6">
      <div className="bg-white p-5 md:p-7 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
            Klassic Secure Signup
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Verify Gmail OTP and start shopping on Klassic.
          </p>
        </div>

        <form onSubmit={registerUser} className="space-y-3">
          <input
            className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <input
              className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Gmail Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                setOtpVerified(false);
                setOtpSent(false);
                setOtp("");
                setTimer(0);
                setOtpMessage("");
                setOtpError("");
              }}
              required
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={loadingOtp || otpVerified || timer > 0}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm disabled:bg-gray-400"
            >
              {loadingOtp ? "Sending" : otpVerified ? "Done" : timer > 0 ? `${timer}s` : otpSent ? "Resend" : "OTP"}
            </button>
          </div>

          {otpSent && !otpVerified && (
            <div>
              <div className="flex gap-2">
                <input
                  className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 6 digit OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loadingVerify}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm disabled:bg-gray-400"
                >
                  {loadingVerify ? "Wait..." : "Verify"}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-1">
                OTP valid for 1 minute. {timer > 0 ? `Resend available in ${timer}s` : "You can resend OTP now."}
              </p>
            </div>
          )}

          {otpMessage && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-xl text-xs text-green-700 font-bold">
              ✅ {otpMessage}
            </div>
          )}

          {otpError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-bold">
              {otpError}
            </div>
          )}

          <input
            className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10 Digit Mobile Number"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
          />

          <div>
            <div className="flex gap-2">
              <input
                className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="border px-4 rounded-xl font-bold text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              className="w-full border p-3 rounded-xl text-sm mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="mt-2 bg-blue-50 border border-blue-200 p-3 rounded-xl text-[11px] space-y-1">
              <p className={password.length >= 8 ? "text-green-600" : "text-gray-600"}>
                {password.length >= 8 ? "✅" : "○"} Minimum 8 characters
              </p>
              <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-600"}>
                {/[A-Z]/.test(password) ? "✅" : "○"} One uppercase letter
              </p>
              <p className={/[a-z]/.test(password) ? "text-green-600" : "text-gray-600"}>
                {/[a-z]/.test(password) ? "✅" : "○"} One lowercase letter
              </p>
              <p className={/\d/.test(password) ? "text-green-600" : "text-gray-600"}>
                {/\d/.test(password) ? "✅" : "○"} One number
              </p>
              <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-600"}>
                {/[^A-Za-z0-9]/.test(password) ? "✅" : "○"} One special character
              </p>
            </div>
          </div>

          <button
            disabled={loadingRegister || !otpVerified}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-extrabold text-sm disabled:from-gray-400 disabled:to-gray-400 hover:opacity-95 transition"
          >
            {loadingRegister ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs mt-5 text-gray-600">
          Already have account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}