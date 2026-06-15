import mongoose from "mongoose";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return (
      <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-8">
        <div className="mx-auto mt-16 max-w-xl rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-black text-slate-900">
            Please login again
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Seller dashboard access ke liye login required hai.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/seller/login"
              className="rounded-2xl bg-slate-950 px-6 py-3 font-black text-white"
            >
              Login to Seller Hub
            </Link>

            <Link
              href="/become-seller"
              className="rounded-2xl bg-orange-500 px-6 py-3 font-black text-white"
            >
              Register as Seller
            </Link>
          </div>
        </div>
      </main>
    );
  }

  await connectDB();

  const seller: any = await Seller.findById(sellerId)
    .select("name email status store_name storeName")
    .lean();

  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-8">
        <div className="mx-auto mt-16 max-w-xl rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-black text-slate-900">
            Seller account not approved
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Approval ke baad dashboard open hoga.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/seller/login"
              className="rounded-2xl bg-slate-950 px-6 py-3 font-black text-white"
            >
              Login
            </Link>

            <Link
              href="/become-seller"
              className="rounded-2xl bg-orange-500 px-6 py-3 font-black text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [
    productsTotal,
    lowStockTotal,
    pendingTotal,
    approvedTotal,
    rejectedTotal,
    draftTotal,
    sellerOrdersRaw,
  ] = await Promise.all([
    Product.countDocuments({ seller_id: sellerId }),
    Product.countDocuments({ seller_id: sellerId, stock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ seller_id: sellerId, status: "Pending Approval" }),
    Product.countDocuments({ seller_id: sellerId, status: "Approved" }),
    Product.countDocuments({ seller_id: sellerId, status: "Rejected" }),
    Product.countDocuments({ seller_id: sellerId, status: "Draft" }),
    Order.find({ "items.seller_id": sellerId })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
      .catch(() => []),
  ]);

  const sellerOrderItems = sellerOrdersRaw.flatMap((order: any) =>
    (order.items || [])
      .filter((item: any) => String(item.seller_id || "") === sellerId)
      .map((item: any, index: number) => ({
        order_id: String(order._id),
        item_index: index,
        customer_name: order.customer_name,
        product_name: item.product_name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        status: item.item_status || order.status || "Pending",
      }))
  );

  const totalOrders = sellerOrderItems.length;
  const pendingOrders = sellerOrderItems.filter(
    (item: any) => item.status === "Pending"
  ).length;
  const deliveredOrders = sellerOrderItems.filter(
    (item: any) => item.status === "Delivered"
  ).length;

  const sellerRevenue = sellerOrderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const trustScore = Math.min(100, 60 + approvedTotal * 5 + deliveredOrders * 2);
  const aiScore = Math.min(
    100,
    50 + approvedTotal * 4 + totalOrders * 3 - rejectedTotal * 5
  );

  const sellerLevel =
    approvedTotal >= 50
      ? "Platinum Seller"
      : approvedTotal >= 20
      ? "Gold Seller"
      : approvedTotal >= 10
      ? "Silver Seller"
      : approvedTotal >= 3
      ? "Bronze Seller"
      : "New Seller";

  const storeName =
    seller.store_name || seller.storeName || "Klassic Seller Store";

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-3 pb-24 pt-4 md:px-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#101827] to-orange-600 p-4 text-white shadow md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-orange-200">
                Klassic Seller Hub
              </p>

              <h1 className="mt-1 text-2xl font-black md:text-4xl">
                Welcome, {seller.name}
              </h1>

              <p className="mt-1 text-sm text-slate-200">
                Store: {storeName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <HeroBadge label="Approved" value={seller.status} icon="✅" />
              <HeroBadge label="Level" value={sellerLevel} icon="🏆" />
              <HeroBadge label="Trust" value={`${trustScore}%`} icon="⭐" />
              <HeroBadge label="Reward" value="Active" icon="🎁" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          <MiniStat title="Products" value={productsTotal} color="text-slate-950" />
          <MiniStat title="Approved" value={approvedTotal} color="text-green-600" />
          <MiniStat title="Pending" value={pendingTotal} color="text-amber-600" />
          <MiniStat title="Rejected" value={rejectedTotal} color="text-red-600" />
          <MiniStat title="Draft" value={draftTotal} color="text-slate-500" />
          <MiniStat title="Low Stock" value={lowStockTotal} color="text-orange-600" />
          <MiniStat title="Orders" value={totalOrders} color="text-blue-600" />
          <MiniStat title="AI Score" value={aiScore} color="text-purple-600" suffix="%" />
        </section>

        <section className="grid grid-cols-3 gap-2 md:grid-cols-6">
          <Action href="/seller/products" icon="📦" title="Products" />
          <Action href="/seller/products/add" icon="➕" title="Add" />
          <Action href="/seller/orders" icon="🚚" title="Orders" />
          <Action href="/seller/products?status=Pending Approval" icon="⏳" title="Pending" />
          <Action href="/seller/earnings" icon="💰" title="Revenue" />
          <Action href="/seller/settings" icon="⚙️" title="Settings" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-4 shadow lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  AI Seller Growth Tools
                </h2>
                <p className="text-xs text-slate-500">
                  Listing, SEO aur sales growth ke liye smart tools.
                </p>
              </div>

              <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                AI Hub
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              <AITool href="/seller/products/add" icon="✍️" title="AI Title" text="Product title generate" />
              <AITool href="/seller/products/add" icon="📝" title="AI Description" text="Description auto fill" />
              <AITool href="/seller/products/add" icon="🔎" title="AI SEO" text="SEO title & keywords" />
              <AITool href="/seller/analytics/sales" icon="📈" title="AI Sales" text="Sales prediction" />
              <AITool href="/seller/products?stock=low" icon="🔥" title="AI Trends" text="Trending products" />
              <AITool href="/seller/products" icon="⭐" title="AI Score" text="Listing health score" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow">
            <h2 className="text-xl font-black text-slate-950">
              Seller Performance
            </h2>

            <div className="mt-4 space-y-3">
              <ScoreRow title="Trust Score" value={trustScore} />
              <ScoreRow title="AI Health Score" value={aiScore} />
              <ScoreRow title="Approval Rate" value={productsTotal ? Math.round((approvedTotal / productsTotal) * 100) : 0} />
            </div>

            <div className="mt-4 rounded-2xl bg-orange-50 p-3">
              <p className="text-sm font-black text-orange-700">
                Recommendation
              </p>
              <p className="mt-1 text-xs text-orange-700">
                More images, SEO keywords aur fast order delivery se seller score improve hoga.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          <RevenueCard title="Total Revenue" value={`₹${sellerRevenue.toFixed(0)}`} />
          <RevenueCard title="Pending Orders" value={pendingOrders} />
          <RevenueCard title="Delivered" value={deliveredOrders} />
          <RevenueCard title="Seller Level" value={sellerLevel} />
        </section>

        <section className="rounded-3xl bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">
                Latest items ordered from your store.
              </p>
            </div>

            <Link
              href="/seller/orders"
              className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
            >
              View All
            </Link>
          </div>

          {sellerOrderItems.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
              No orders yet
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="rounded-l-xl p-3 text-left">Order</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="rounded-r-xl p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sellerOrderItems.slice(0, 5).map((item: any) => (
                      <tr key={`${item.order_id}-${item.item_index}`} className="border-b">
                        <td className="p-3 font-black">#{item.order_id.slice(-6)}</td>
                        <td className="p-3">{item.product_name}</td>
                        <td className="p-3">{item.customer_name || "-"}</td>
                        <td className="p-3 font-black text-green-600">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 md:hidden">
                {sellerOrderItems.slice(0, 5).map((item: any) => (
                  <div
                    key={`${item.order_id}-${item.item_index}-mobile`}
                    className="rounded-2xl border bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black">#{item.order_id.slice(-6)}</p>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-700">
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm text-slate-700">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm font-black text-green-600">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function HeroBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2 backdrop-blur">
      <p className="text-[11px] font-bold text-slate-300">{label}</p>
      <p className="mt-0.5 text-sm font-black text-white">
        {icon} {value}
      </p>
    </div>
  );
}

function MiniStat({
  title,
  value,
  color,
  suffix = "",
}: {
  title: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <p className="text-[11px] font-bold text-slate-500">{title}</p>
      <h2 className={`mt-1 text-2xl font-black ${color}`}>
        {value}
        {suffix}
      </h2>
    </div>
  );
}

function Action({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-xl">{icon}</div>
      <p className="mt-1 text-xs font-black text-slate-800">{title}</p>
    </Link>
  );
}

function AITool({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-slate-50 p-3 transition hover:border-orange-300 hover:bg-orange-50"
    >
      <div className="text-xl">{icon}</div>
      <h3 className="mt-2 text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-[11px] text-slate-500">{text}</p>
    </Link>
  );
}

function ScoreRow({ title, value }: { title: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black">
        <span className="text-slate-600">{title}</span>
        <span className="text-slate-950">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-orange-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function RevenueCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-bold text-slate-500">{title}</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">{value}</h2>
    </div>
  );
}