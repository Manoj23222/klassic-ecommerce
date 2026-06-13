import SellerTopBar from "@/components/SellerTopBar";
import { cookies } from "next/headers";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function SellerEarningsPage() {
  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login again</h1>
          <Link href="/seller/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Seller Login
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

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

  const ordersRaw = await Order.find({
    "items.seller_id": sellerId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const earningItems = ordersRaw.flatMap((order: any) =>
    (order.items || [])
      .filter((item: any) => String(item.seller_id || "") === sellerId)
      .map((item: any, index: number) => {
        const amount = Number(item.price || 0) * Number(item.quantity || 1);

        return {
          id: `${String(order._id)}-${index}`,
          order_id: String(order._id),
          product_name: item.product_name,
          quantity: Number(item.quantity || 1),
          amount,
          status: item.item_status || "Pending",
          payment_method: order.payment_method || "COD",
          createdAt: order.createdAt,
        };
      })
  );

  const totalRevenue = earningItems.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );

  const deliveredRevenue = earningItems
    .filter((item: any) => item.status === "Delivered")
    .reduce((sum: number, item: any) => sum + item.amount, 0);

  const pendingSettlement = earningItems
    .filter((item: any) => item.status !== "Delivered" && item.status !== "Cancelled")
    .reduce((sum: number, item: any) => sum + item.amount, 0);

  const availableBalance = deliveredRevenue;

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="mt-5 mb-6">
          <h1 className="text-3xl font-bold">Seller Earnings</h1>
          <p className="text-gray-500">
            Revenue, settlement aur transaction history.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} color="text-green-700" />
          <Stat title="Delivered Revenue" value={`₹${deliveredRevenue.toFixed(0)}`} color="text-blue-700" />
          <Stat title="Pending Settlement" value={`₹${pendingSettlement.toFixed(0)}`} color="text-yellow-700" />
          <Stat title="Available Balance" value={`₹${availableBalance.toFixed(0)}`} color="text-purple-700" />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Withdraw Request</h2>
          <p className="text-gray-500 mb-4">
            Available balance delivered orders ke basis par calculate hota hai.
          </p>

          <button
            type="button"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold"
          >
            Withdraw Coming Soon
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Qty</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {earningItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No earnings yet
                  </td>
                </tr>
              ) : (
                earningItems.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td className="p-4 font-bold">
                      #{item.order_id.slice(-6)}
                    </td>

                    <td className="p-4">{item.product_name}</td>

                    <td className="p-4">{item.quantity}</td>

                    <td className="p-4 font-bold text-green-700">
                      ₹{item.amount.toFixed(2)}
                    </td>

                    <td className="p-4">{item.payment_method}</td>

                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.status}
                      </span>
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

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}