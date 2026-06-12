import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1 className="p-10 text-3xl">Invalid order ID</h1>;
  }

  await connectDB();

  const order: any = await Order.findById(id).lean();

  if (!order) {
    return <h1 className="p-10 text-3xl">Order not found</h1>;
  }

  const items = order.items || [];
  const orderId = String(order._id);

  return (
    <main className="min-h-screen bg-white p-4 md:p-10 text-black">
      <div className="max-w-4xl mx-auto border p-5 md:p-8">
        <div className="flex justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold">Klassic</h1>
            <p>Ecommerce Store</p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <p>Order #{orderId.slice(-8).toUpperCase()}</p>
            <p>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Customer Details</h3>
          <p><b>Name:</b> {order.customer_name || "N/A"}</p>
          <p><b>Phone:</b> {order.phone || "N/A"}</p>
          <p><b>Address:</b> {order.address || "N/A"}</p>
          <p><b>Payment:</b> {order.payment_method || "COD"}</p>
          <p><b>Status:</b> {order.status || "Pending"}</p>
        </div>

        <table className="w-full border mb-6 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Product</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3 text-left">Qty</th>
              <th className="border p-3 text-left">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="border p-4 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item: any, index: number) => (
                <tr key={`${item.product_id}-${index}`}>
                  <td className="border p-3">
                    <p className="font-bold">{item.product_name}</p>

                    {item.color && (
                      <p className="text-sm text-gray-600">
                        Color: <b>{item.color}</b>
                      </p>
                    )}

                    {item.size && (
                      <p className="text-sm text-gray-600">
                        Size: <b>{item.size}</b>
                      </p>
                    )}
                  </td>

                  <td className="border p-3">₹{Number(item.price || 0).toFixed(2)}</td>
                  <td className="border p-3">{item.quantity || 1}</td>
                  <td className="border p-3">
                    ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="text-right">
          <p className="text-2xl font-bold">
            Total: ₹{Number(order.total_amount || 0).toFixed(2)}
          </p>
        </div>

        <div className="mt-10 text-center text-gray-600">
          Thank you for shopping with Klassic.
        </div>

        <div className="mt-6 text-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Print / Save PDF
          </button>
        </div>
      </div>
    </main>
  );
}