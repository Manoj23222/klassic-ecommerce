"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function SellerOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [sellerId, setSellerId] = useState("");

  async function loadOrders(id: string) {
    const res = await fetch(`/api/seller/orders?seller_id=${id}`);
    const data = await res.json();

    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const id = seller?._id || seller?.id;

    if (!id) {
      setLoading(false);
      return;
    }

    setSellerId(id);
    loadOrders(id);
  }, []);

  async function updateStatus(orderId: string, status: string) {
    if (!sellerId) return;

    const res = await fetch("/api/seller/orders/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        seller_id: sellerId,
        status,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Order status updated");
      loadOrders(sellerId);
    } else {
      toast.error(data.message || "Status update failed");
    }
  }

  const filteredOrders = useMemo(() => {
    if (activeStatus === "All") return orders;
    return orders.filter((order) => order.status === activeStatus);
  }, [orders, activeStatus]);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Orders Management</h1>
        <p className="text-gray-500">Manage all seller orders.</p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatus(tab)}
              className={`rounded-xl px-4 py-2 font-bold ${
                activeStatus === tab
                  ? "bg-blue-600 text-white"
                  : "border bg-white text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Update</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-3 font-black">
                    #{String(order._id).slice(-6)}
                  </td>

                  <td className="p-3">{order.customer_name}</td>

                  <td className="p-3">{order.items?.[0]?.product_name}</td>

                  <td className="p-3 font-bold">
                    ₹{Number(order.amount || 0).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">{order.payment_status}</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {["Processing", "Shipped", "Delivered"].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order._id, status)}
                          className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center font-bold text-gray-500">
                    No {activeStatus} orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerCentralLayout>
  );
}