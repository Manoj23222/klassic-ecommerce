"use client";

import { useState } from "react";

export default function PaytmPaymentPage() {
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    try {
      setLoading(true);

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
        alert("Paytm initiate failed");
        return;
      }

      const txnToken = data.data?.body?.txnToken;

      if (!txnToken) {
        alert("TxnToken not found");
        console.log(data);
        return;
      }

      alert("Paytm Connected Successfully");
    } catch (error) {
      console.error(error);
      alert("Payment Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={startPayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Loading..." : "Pay with Paytm"}
      </button>
    </div>
  );
}