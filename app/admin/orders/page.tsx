import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default async function AdminOrdersPage() {
  await connectDB();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .lean();

  const cleanOrders = orders.map((order: any) => ({
    id: order._id.toString(),
    customer_name: order.customer_name,
    phone: order.phone,
    total_amount: Number(order.total_amount || 0),
    status: order.status,
    payment_method: order.payment_method,
    created_at: order.createdAt
      ? String(order.createdAt)
      : "",
  }));

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">
        Admin Orders
      </h1>

      <AdminOrdersTable orders={cleanOrders} />
    </>
  );
}