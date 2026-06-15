import SellerTopBar from "@/components/SellerTopBar";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Order from "@/models/Order";
import mongoose from "mongoose";
export const dynamic = "force-dynamic";

function statusColor(status: string) {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Processing") return "bg-purple-100 text-purple-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const statusFilter = query?.status || "";

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
const seller: any = await Seller.findById(sellerId)
  .select("_id status storeName store_name seller_store_name")
  .lean();
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

  const sellerNames = [
  seller?.storeName,
  seller?.store_name,
  seller?.seller_store_name,
].filter(Boolean);

const orderQuery: any = {
  $or: [
    { "items.seller_id": sellerId },
    { "items.seller_id": String(seller?._id) },
    ...(sellerNames.length
      ? [{ "items.seller_store_name": { $in: sellerNames } }]
      : []),
  ],
};

  if (statusFilter) {
    orderQuery["items.item_status"] = statusFilter;
  }

  const ordersRaw = await Order.find(orderQuery)
    .sort({ createdAt: -1 })
    .lean();

  const orders = ordersRaw.flatMap((order: any) =>
    (order.items || [])
      .filter((item: any) => {
        const isSellerItem =
  String(item.seller_id || "") === sellerId ||
  String(item.seller_id || "") === String(seller?._id) ||
  sellerNames.includes(item.seller_store_name);
        const isStatusMatch = statusFilter
          ? item.item_status === statusFilter
          : true;

        return isSellerItem && isStatusMatch;
      })
      .map((item: any, index: number) => ({
        item_id: `${String(order._id)}-${index}`,
        order_id: String(order._id),
        item_index: index,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image,
        customer_name: order.customer_name,
        phone: order.phone,
        address: order.address,
        payment_method: order.payment_method,
        status: item.item_status || "Pending",
        created_at: order.createdAt,
      }))
  );

  const totalRevenue = orders.reduce(
    (sum: number, order: any) =>
      sum + Number(order.price || 0) * Number(order.quantity || 1),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {statusFilter ? `${statusFilter} Orders` : "Seller Orders"}
            </h1>
            <p className="text-gray-500 text-sm">
              Orders received for your products.
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Seller Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{totalRevenue.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <Link
                key={status || "All"}
                href={status ? `/seller/orders?status=${status}` : "/seller/orders"}
                className="bg-white border px-4 py-2 rounded-xl font-bold"
              >
                {status || "All Orders"}
              </Link>
            )
          )}
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full border text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border p-3 text-left">Order</th>
                <th className="border p-3 text-left">Product</th>
                <th className="border p-3 text-left">Customer</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Qty</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Payment</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border p-5 text-center text-gray-500">
                    No seller orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.item_id} className="hover:bg-gray-50">
                    <td className="border p-3 font-bold">
                      #{order.order_id.slice(-6)}
                    </td>

                    <td className="border p-3">
                      <div className="flex items-center gap-3">
                        {order.image ? (
                          <img
                            src={order.image}
                            alt={order.product_name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        )}

                        <div>
                          <p className="font-bold">{order.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {order.color && `Color: ${order.color} `}
                            {order.size && `Size: ${order.size}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="border p-3">{order.customer_name || "Guest"}</td>
                    <td className="border p-3">{order.phone || "-"}</td>
                    <td className="border p-3">{order.quantity || 1}</td>

                    <td className="border p-3 font-bold text-green-600">
                      ₹
                      {(
                        Number(order.price || 0) *
                        Number(order.quantity || 1)
                      ).toFixed(2)}
                    </td>

                    <td className="border p-3">{order.payment_method || "COD"}</td>

                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="border p-3">
                      <Link
                        href={`/seller/orders/${order.order_id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}