import mongoose from "mongoose";
import Link from "next/link";
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
    return <h1 className="p-10 text-3xl font-black">Invalid order ID</h1>;
  }

  await connectDB();

  const order: any = await Order.findById(id).lean();

  if (!order) {
    return <h1 className="p-10 text-3xl font-black">Order not found</h1>;
  }

  const items = order.items || [];
  const orderId = String(order._id);

  const subtotal =
    order.subtotal ||
    items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

  const discount = Number(order.discount || 0);
  const delivery = Number(order.delivery_charge || 0);
  const gst = Number(order.gst_amount || 0);
  const total = Number(order.total_amount || subtotal - discount + delivery + gst);

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-black print:bg-white md:p-10">
      <div className="mx-auto mb-4 flex max-w-5xl justify-between print:hidden">
        <Link
          href={`/admin/orders/${orderId}`}
          className="rounded-xl bg-slate-950 px-5 py-3 font-black text-white"
        >
          ← Back
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow print:rounded-none print:shadow-none md:p-10">
        <div className="mb-8 flex flex-col gap-6 border-b pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-5xl font-black text-slate-950">Klassic</h1>
            <p className="mt-1 font-bold text-slate-600">
              Marketplace GST Invoice
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Klassic Ecommerce Store
              <br />
              India
              <br />
              Support: support@klassic.com
            </p>
          </div>

          <div className="text-left md:text-right">
            <h2 className="text-3xl font-black text-blue-700">INVOICE</h2>
            <p className="mt-2 text-sm">
              <b>Invoice No:</b> INV-{orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm">
              <b>Order ID:</b> #{orderId}
            </p>
            <p className="text-sm">
              <b>Date:</b>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
            <p className="text-sm">
              <b>Payment:</b> {order.payment_method || "COD"}
            </p>
            <p className="text-sm">
              <b>Payment Status:</b> {order.payment_status || "Pending"}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <h3 className="mb-3 text-lg font-black">Bill To</h3>
            <p>
              <b>Name:</b> {order.customer_name || "N/A"}
            </p>
            <p>
              <b>Phone:</b> {order.phone || "N/A"}
            </p>
            <p>
              <b>Address:</b> {order.address || "N/A"}
            </p>

            {(order.city || order.state || order.pincode) && (
              <p>
                <b>City/State:</b>{" "}
                {[order.city, order.state, order.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}

            {order.landmark && (
              <p>
                <b>Landmark:</b> {order.landmark}
              </p>
            )}

            <p>
              <b>Address Type:</b> {order.address_type || "Home"}
            </p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <h3 className="mb-3 text-lg font-black">Order Status</h3>
            <p>
              <b>Status:</b> {order.status || "Pending"}
            </p>
            <p>
              <b>Coupon:</b> {order.coupon_code || "No Coupon"}
            </p>
            <p>
              <b>GST:</b> Included / Applicable as per product category
            </p>
            <p>
              <b>Seller Split:</b> Marketplace seller-wise fulfilled order
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="mb-8 w-full min-w-[800px] border text-sm">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="border p-3 text-left">#</th>
                <th className="border p-3 text-left">Product</th>
                <th className="border p-3 text-left">Seller</th>
                <th className="border p-3 text-right">Price</th>
                <th className="border p-3 text-right">Qty</th>
                <th className="border p-3 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item: any, index: number) => {
                  const itemTotal =
                    Number(item.price || 0) * Number(item.quantity || 1);

                  return (
                    <tr key={`${item.product_id}-${index}`}>
                      <td className="border p-3">{index + 1}</td>

                      <td className="border p-3">
                        <p className="font-black">{item.product_name}</p>

                        <div className="text-xs text-gray-500">
                          {item.color && <span>Color: {item.color} </span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          Product ID: {item.product_id}
                        </p>
                      </td>

                      <td className="border p-3">
                        {item.seller_store_name || item.seller_id || "-"}
                      </td>

                      <td className="border p-3 text-right">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </td>

                      <td className="border p-3 text-right">
                        {item.quantity || 1}
                      </td>

                      <td className="border p-3 text-right font-black">
                        ₹{itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="ml-auto max-w-sm space-y-2 rounded-2xl border bg-slate-50 p-5">
          <Row label="Subtotal" value={subtotal} />
          <Row label="Discount" value={-discount} green />
          <Row label="Delivery Charge" value={delivery} />
          <Row label="GST" value={gst} />

          <div className="mt-3 border-t pt-3">
            <div className="flex justify-between text-2xl font-black text-green-700">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-600">
          Thank you for shopping with <b>Klassic</b>. This is a computer generated invoice.
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  green = false,
}: {
  label: string;
  value: number;
  green?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${green ? "text-green-600" : ""}`}>
      <span>{label}</span>
      <b>₹{Number(value || 0).toFixed(2)}</b>
    </div>
  );
}