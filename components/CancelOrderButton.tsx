"use client";

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  const cancelOrder = async () => {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");

    if (!confirmCancel) return;

    const res = await fetch("/api/orders/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order cancelled successfully");
      window.location.reload();
    } else {
      alert("Cancel failed");
    }
  };

  return (
    <button
      onClick={cancelOrder}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
    >
      Cancel Order
    </button>
  );
}