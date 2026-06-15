"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  const deleteProduct = async () => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Product deleted successfully");
      router.refresh();
    } else {
      toast.error(data.message || "Delete failed");
    }
  };

  return (
    <button
      onClick={deleteProduct}
      className="bg-red-600 text-white py-2 rounded-xl text-sm"
    >
      Delete
    </button>
  );
}