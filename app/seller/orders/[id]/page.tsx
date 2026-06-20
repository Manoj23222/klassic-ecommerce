import SellerTopBar from "@/components/SellerTopBar";
import SellerOrderStatusUpdate from "@/components/SellerOrderStatusUpdate";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

function statusColor(status: string) {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Out For Delivery") return "bg-indigo-100 text-indigo-700";
  if (status === "Packed") return "bg-cyan-100 text-cyan-700";
  if (status === "Processing") return "bg-purple-100 text-purple-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

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

  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="mb-4 text-2xl font-black">Please login again</h1>
          <Link
            href="/seller/login"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            Seller Login
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

  const seller: any = await Seller.findById(sellerId)
    .select("_id status store_name storeName seller_store_name")
    .lean();

  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="mb-4 text-2xl font-black">Seller access required</h1>
          <Link
            href="/become-seller"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-black text-black"
          >
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
          <h1 className="mb-4 text-2xl font-black">Invalid order ID</h1>
          <Link href="/seller/orders" className="font-bold text-blue-600">
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
          <h1 className="mb-4 text-2xl font-black">Order not found</h1>
          <Link href="/seller/orders" className="font-bold text-blue-600">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const sellerNames = [
    seller.store_name,
    seller.storeName,
    seller.seller_store_name,
  ].filter(Boolean);

  const sellerItems = (order.items || [])
    .map((item: any, index: number) => ({ ...item, item_index: index }))
    .filter((item: any) => {
      return (
        String(item.seller_id || "") === sellerId ||
        String(item.seller_id || "") === String(seller._id) ||
        sellerNames.includes(item.seller_store_name)
      );
    });

  if (sellerItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10">
          <h1 className="mb-4 text-2xl font-black">Access denied</h1>
          <Link href="/seller/orders" className="font-bold text-blue-600">
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

      <section className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/seller/orders" className="font-bold text-blue-600">
          ← Back to Seller Orders
        </Link>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow md:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                Seller Order Details
              </p>
              <h1 className="text-3xl font-black">
                Order #{String(safeOrder._id).slice(-6).toUpperCase()}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Update only your seller items.
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 px-5 py-3 text-green-700">
              <p className="text-sm">Seller Total</p>
              <h2 className="text-2xl font-black">₹{sellerTotal.toFixed(2)}</h2>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Info title="Customer" value={safeOrder.customer_name || "-"} />
            <Info title="Phone" value={safeOrder.phone || "-"} />
            <Info title="Payment" value={safeOrder.payment_method || "COD"} />
            <Info title="Payment Status" value={safeOrder.payment_status || "Pending"} />
          </div>

          <div className="mb-6 rounded-2xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-black">{safeOrder.address || "-"}</p>

            {(safeOrder.city || safeOrder.state || safeOrder.pincode) && (
              <p className="mt-1 text-sm text-gray-600">
                {[safeOrder.city, safeOrder.state, safeOrder.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}

            {safeOrder.landmark && (
              <p className="mt-1 text-sm text-gray-600">
                Landmark: {safeOrder.landmark}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {safeItems.map((item: any) => (
              <div key={item.item_index} className="rounded-3xl border bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-[90px_1fr_280px]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="h-24 w-24 rounded-xl border bg-white object-contain"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-xl bg-gray-200" />
                  )}

                  <div>
                    <h2 className="text-xl font-black">{item.product_name}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity || 1} | Price: ₹{item.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.color && `Color: ${item.color} `}
                      {item.size && `Size: ${item.size}`}
                    </p>

                    <p className="mt-2 font-black text-green-600">
                      Amount: ₹
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </p>

                    <span
                      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-black ${statusColor(
                        item.item_status || "Pending"
                      )}`}
                    >
                      {item.item_status || "Pending"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <SellerOrderStatusUpdate
  orderId={String(safeOrder._id)}
  itemIndex={item.item_index}
  currentStatus={item.item_status || "Pending"}
  courierName={item.courier_name || safeOrder.courier_name || ""}
  trackingNumber={item.tracking_number || safeOrder.tracking_number || ""}
  deliveryEstimate={item.delivery_estimate || safeOrder.delivery_estimate || ""}
/>
                    
                  </div>
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
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-black">{value}</p>
    </div>
  );
}