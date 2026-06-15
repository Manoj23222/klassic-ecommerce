"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminCouponActions({
  couponId,
  status,
}: {
  couponId: string;
  status: boolean;
}) {
  const router = useRouter();

  const toggleStatus = async () => {
    const res = await fetch(`/api/admin/coupons/${couponId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !status }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Coupon updated");
      router.refresh();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const deleteCoupon = async () => {
    const ok = confirm("Delete this coupon?");
    if (!ok) return;

    const res = await fetch(`/api/admin/coupons/${couponId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Coupon deleted");
      router.refresh();
    } else {
      toast.error(data.message || "Delete failed");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={toggleStatus}
        className={`px-3 py-2 rounded-lg text-sm font-bold ${
          status
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {status ? "Deactivate" : "Activate"}
      </button>

      <button
        onClick={deleteCoupon}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
      >
        Delete
      </button>
    </div>
  );
}