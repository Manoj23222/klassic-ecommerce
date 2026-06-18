import Header from "@/components/Header";
import Link from "next/link";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const reasons = [
  "Wrong Product Received",
  "Damaged Product",
  "Missing Parts",
  "Defective Item",
  "Quality Not As Expected",
  "Size Issue",
  "Changed Mind",
  "Other",
];

async function submitReturnRequest(orderId: string, formData: FormData) {
  "use server";

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    redirect("/my-orders");
  }

  const reason = String(formData.get("reason") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!reason) {
    redirect(`/my-orders/${orderId}/return`);
  }

  const order: any = await Order.findById(orderId);

  if (!order) {
    redirect("/my-orders");
  }

  if (order.status !== "Delivered") {
    redirect(`/my-orders/${orderId}`);
  }

  if (order.return_status === "Requested") {
    redirect(`/my-orders/${orderId}`);
  }

  order.status = "Return Requested";
  order.return_status = "Requested";
  order.return_reason = reason;
  order.return_message = message;
  order.refund_status = "Pending";
  order.refund_amount = Number(order.total_amount || 0);

  await order.save();

  redirect(`/my-orders/${orderId}`);
}

export default async function ReturnRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1 className="p-10 text-2xl font-black">Invalid Order</h1>;
  }

  const order: any = await Order.findById(id).lean();

  if (!order) {
    return <h1 className="p-10 text-2xl font-black">Order not found</h1>;
  }

  const orderId = String(order._id);

  if (order.status !== "Delivered") {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <Header />
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="rounded-[2rem] bg-white p-8 shadow">
            <h1 className="text-2xl font-black">Return not available</h1>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Return request is available only after delivery.
            </p>
            <Link
              href={`/my-orders/${orderId}`}
              className="mt-6 inline-block rounded-full bg-black px-8 py-3 font-black text-white"
            >
              Back To Order
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (order.return_status === "Requested") {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <Header />
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="rounded-[2rem] bg-white p-8 shadow">
            <h1 className="text-2xl font-black">Return already requested</h1>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Your return request is under review.
            </p>
            <Link
              href={`/my-orders/${orderId}`}
              className="mt-6 inline-block rounded-full bg-black px-8 py-3 font-black text-white"
            >
              Back To Order
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400">
            Account / Orders / Return Request
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Request Return
          </h1>

          <p className="mt-2 text-sm font-semibold text-gray-500">
            Tell us why you want to return this order.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] bg-white p-6 shadow">
            <form
              action={submitReturnRequest.bind(null, orderId)}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-black">
                  Return Reason
                </label>

                <select
                  name="reason"
                  className="w-full rounded-2xl border border-gray-200 p-4 font-semibold"
                  required
                >
                  <option value="">Select Reason</option>
                  {reasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Additional Details
                </label>

                <textarea
                  name="message"
                  rows={5}
                  className="w-full rounded-2xl border border-gray-200 p-4"
                  placeholder="Explain your issue..."
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-black px-8 py-4 font-black text-white"
              >
                Submit Return Request
              </button>
            </form>
          </div>

          <aside className="rounded-[2rem] bg-white p-6 shadow">
            <h2 className="text-xl font-black">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {(order.items || []).map((item: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.product_name || "Product"}
                    className="h-20 w-20 rounded-2xl bg-gray-50 object-contain"
                  />

                  <div>
                    <h3 className="line-clamp-2 font-black">
                      {item.product_name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="font-bold">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-600">Return Policy</p>

              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>• Return request within 7 days</li>
                <li>• Product should be unused</li>
                <li>• Original packaging required</li>
                <li>• Refund after inspection</li>
              </ul>
            </div>

            <Link
              href={`/my-orders/${orderId}`}
              className="mt-5 block rounded-full border border-gray-300 px-6 py-3 text-center font-black"
            >
              Back To Order
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}