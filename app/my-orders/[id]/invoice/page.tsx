import Header from "@/components/Header";
import db from "@/lib/db";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function CustomerInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link href="/login" className="bg-blue-600 text-white px-5 py-3 rounded">
            Login
          </Link>
        </div>
      </main>
    );
  }

  const [orders]: any = await db.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  if (orders.length === 0) {
    return <h1 className="p-10 text-2xl font-bold">Invoice not found</h1>;
  }

  const order = orders[0];

  const [items]: any = await db.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [id]
  );

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const discount = Number(order.discount || 0);
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const total = Number(order.total_amount || subtotal - discount + deliveryCharge);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-4xl mx-auto px-3 md:px-6 py-6">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <Link href={`/my-orders/${id}`} className="text-blue-600 font-semibold">
            ← Back to Order
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
          >
            Print / Download
          </button>
        </div>

        <div className="bg-white p-6 md:p-8 rounded shadow print:shadow-none">
          <div className="flex justify-between border-b pb-5 mb-5">
            <div>
              <h1 className="text-2xl font-bold">KLASSIC</h1>
              <p className="text-sm text-gray-500">Customer Invoice</p>
            </div>

            <div className="text-right text-sm">
              <p><b>Invoice No:</b> INV-{order.id}</p>
              <p>
                <b>Date:</b>{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
              <p><b>Status:</b> {order.status}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6 text-sm">
            <div>
              <h2 className="font-bold mb-2">Bill To</h2>
              <p>{order.customer_name || "Customer"}</p>
              <p>{order.phone || "-"}</p>
              <p>{order.address || "-"}</p>
            </div>

            <div>
              <h2 className="font-bold mb-2">Payment</h2>
              <p><b>Method:</b> {order.payment_method || "COD"}</p>
              <p><b>Coupon:</b> {order.coupon_code || "No Coupon"}</p>
            </div>
          </div>

          <table className="w-full border text-sm mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    {item.product_name}
                    {(item.color || item.size) && (
                      <p className="text-xs text-gray-500">
                        {item.color ? `Color: ${item.color}` : ""}{" "}
                        {item.size ? `Size: ${item.size}` : ""}
                      </p>
                    )}
                  </td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">
                    ₹{Number(item.price).toFixed(2)}
                  </td>
                  <td className="border p-2 text-center">
                    ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="max-w-sm ml-auto text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>₹{subtotal.toFixed(2)}</b>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <b className="text-green-600">-₹{discount.toFixed(2)}</b>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <b>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}</b>
            </div>

            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            Thank you for shopping with Klassic.
          </p>
        </div>
      </section>
    </main>
  );
}