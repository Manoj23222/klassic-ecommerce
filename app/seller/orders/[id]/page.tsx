import SellerTopBar from "@/components/SellerTopBar";
import SellerOrderStatusUpdate from "@/components/SellerOrderStatusUpdate";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Order from "@/models/Order";
// import SellerOrderStatusUpdate from "@/components/SellerOrderStatusUpdate";
export const dynamic = "force-dynamic";

export default async function SellerOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link href="/seller/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Seller Login
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();
if (!mongoose.Types.ObjectId.isValid(sellerId)) {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login again</h1>
        <Link
          href="/seller/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Seller Login
        </Link>
      </div>
    </main>
  );
}
  const seller: any = await Seller.findById(sellerId).select("_id status").lean();

  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Seller access required</h1>
          <Link href="/become-seller" className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
            Become a Seller
          </Link>
        </div>
      </main>
    );
  }
if (!mongoose.Types.ObjectId.isValid(id)) {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Invalid order ID</h1>
        <Link href="/seller/orders" className="text-blue-600 font-bold">
          Back to Orders
        </Link>
      </div>
    </main>
  );
}
  const order: any = await Order.findById(id).lean();

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/seller/orders" className="text-blue-600 font-bold">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const sellerItems = (order.items || [])
    .map((item: any, index: number) => ({ ...item, item_index: index }))
    .filter((item: any) => String(item.seller_id || "") === sellerId);

  if (sellerItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">Access denied</h1>
          <Link href="/seller/orders" className="text-blue-600 font-bold">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const sellerTotal = sellerItems.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const safeOrder = JSON.parse(JSON.stringify(order));
  const safeItems = JSON.parse(JSON.stringify(sellerItems));

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/seller/orders" className="text-blue-600 font-semibold">
          ← Back to Seller Orders
        </Link>

        <div className="bg-white rounded-2xl shadow p-6 mt-5">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Order #{String(safeOrder._id).slice(-6)}
              </h1>
              <p className="text-gray-500">
                Seller order details and item status update.
              </p>
            </div>

            <div className="bg-green-50 text-green-700 px-5 py-3 rounded-2xl">
              <p className="text-sm">Seller Total</p>
              <h2 className="text-2xl font-bold">₹{sellerTotal.toFixed(2)}</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Info title="Customer" value={safeOrder.customer_name || "-"} />
            <Info title="Phone" value={safeOrder.phone || "-"} />
            <Info title="Payment" value={safeOrder.payment_method || "COD"} />
          </div>

          <div className="border rounded-2xl p-4 mb-6 bg-gray-50">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-bold">{safeOrder.address || "-"}</p>
          </div>

          <div className="space-y-4">
            {safeItems.map((item: any) => (
              <div key={item.item_index} className="border rounded-2xl p-4">
                <div className="grid md:grid-cols-[80px_1fr_auto] gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                  )}

                  <div>
                    <h2 className="text-xl font-bold">{item.product_name}</h2>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || 1} | Price: ₹{item.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.color && `Color: ${item.color} `}
                      {item.size && `Size: ${item.size}`}
                    </p>
                    <p className="font-bold text-green-600 mt-2">
                      Amount: ₹
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <SellerOrderStatusUpdate
                    orderId={String(safeOrder._id)}
                    itemIndex={item.item_index}
                    currentStatus={item.item_status || "Pending"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-2xl p-4 bg-gray-50">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}