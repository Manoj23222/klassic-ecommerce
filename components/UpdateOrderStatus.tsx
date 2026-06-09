"use client";

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const nextStatus =
    currentStatus === "Pending"
      ? "Shipped"
      : currentStatus === "Shipped"
      ? "Delivered"
      : "Delivered";

  const updateStatus = async () => {
    const res = await fetch("/api/orders/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: orderId, status: nextStatus }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`Status updated to ${nextStatus}`);
      window.location.reload();
    } else {
      alert("Status update failed");
    }
  };

  if (currentStatus === "Delivered") {
    return (
      <p className="mt-4 text-green-600 font-bold">
        Order Delivered
      </p>
    );
  }

  return (
    <button
      onClick={updateStatus}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
    >
      Mark as {nextStatus}
    </button>
  );
}
