"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function PaytmPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const startPayment = async () => {
    try {
      setLoading(true);
      setStatus("Creating secure Paytm order...");

      const orderId = "ORDER_" + Date.now();

      const res = await fetch("/api/paytm/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount: "1.00",
          customerId: "CUST001",
          email: "3ddesigner5546@gmail.com",
          phone: "9999999999",
        }),
      });

      const data = await res.json();

      console.log("Paytm Response:", data);

      if (!data.success) {
        toast.error(data.message || "Paytm initiate failed");
        setStatus("Payment setup failed");
        return;
      }

      const txnToken = data.data?.body?.txnToken;

      if (!txnToken) {
        toast.error("TxnToken not found");
        setStatus("Paytm token not received");
        console.log(data);
        return;
      }

      toast.success("Paytm connected successfully");
      setStatus("Paytm connected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Payment error. Please try again.");
      setStatus("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-4">
          💳
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Secure Paytm Payment
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Test Paytm payment connection for Klassic checkout.
        </p>

        <div className="mt-6 rounded-2xl bg-gray-50 border p-4 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Order Type</span>
            <b>Test Payment</b>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Amount</span>
            <b>₹1.00</b>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gateway</span>
            <b>Paytm</b>
          </div>
        </div>

        {status && (
          <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl text-sm font-bold">
            {status}
          </div>
        )}

        <button
          type="button"
          onClick={startPayment}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white px-6 py-3 rounded-xl font-extrabold transition disabled:from-gray-400 disabled:to-gray-400"
        >
          {loading ? "Connecting Paytm..." : "Pay with Paytm"}
        </button>

        <p className="text-[11px] text-gray-400 mt-4">
          Your payment details are processed securely by the payment gateway.
        </p>
      </div>
    </main>
  );
}