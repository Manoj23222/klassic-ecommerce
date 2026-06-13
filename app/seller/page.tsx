import mongoose from "mongoose";
import SellerTopBar from "@/components/SellerTopBar";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const menuSections = [
  {
    title: "Products",
    icon: "📦",
    links: [
      { name: "All Products", href: "/seller/products" },
      { name: "Add Product", href: "/seller/products/add" },
      { name: "Pending Approval", href: "/seller/products?status=Pending Approval" },
      { name: "Draft Products", href: "/seller/products?status=Draft" },
      { name: "Out of Stock", href: "/seller/products?stock=out" },
      { name: "Product Reviews", href: "/seller/products/reviews" },
    ],
  },
  {
    title: "Orders",
    icon: "🚚",
    links: [
      { name: "All Orders", href: "/seller/orders" },
      { name: "New Orders", href: "/seller/orders?status=Pending" },
      { name: "Processing Orders", href: "/seller/orders?status=Processing" },
      { name: "Shipped Orders", href: "/seller/orders?status=Shipped" },
      { name: "Delivered Orders", href: "/seller/orders?status=Delivered" },
      { name: "Cancelled Orders", href: "/seller/orders?status=Cancelled" },
      { name: "Returns & Refunds", href: "/seller/returns" },
    ],
  },
  {
    title: "Inventory",
    icon: "📊",
    links: [
      { name: "Stock Management", href: "/seller/inventory" },
      { name: "Low Stock Alert", href: "/seller/products?stock=low" },
      { name: "Inventory History", href: "/seller/inventory/history" },
    ],
  },
  {
    title: "Earnings",
    icon: "💰",
    links: [
      { name: "Total Sales", href: "/seller/earnings" },
      { name: "Settlement History", href: "/seller/earnings/settlements" },
      { name: "Withdraw Request", href: "/seller/earnings/withdraw" },
      { name: "Transaction History", href: "/seller/earnings/transactions" },
    ],
  },
  {
    title: "Analytics",
    icon: "📈",
    links: [
      { name: "Sales Reports", href: "/seller/analytics/sales" },
      { name: "Product Performance", href: "/seller/analytics/products" },
      { name: "Visitor Analytics", href: "/seller/analytics/visitors" },
      { name: "Revenue Reports", href: "/seller/analytics/revenue" },
    ],
  },
  {
    title: "Store Management",
    icon: "🏪",
    links: [
      { name: "Store Profile", href: "/seller/store/profile" },
      { name: "Store Banner", href: "/seller/store/banner" },
      { name: "Store Logo", href: "/seller/store/logo" },
      { name: "Store Settings", href: "/seller/store/settings" },
    ],
  },
];

export default async function SellerDashboardPage() {
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
          <div className="flex justify-center gap-4">
  <Link
    href="/seller/login"
    className="bg-black text-white px-8 py-4 rounded-2xl font-extrabold shadow-lg hover:scale-105 transition"
  >
    Login to Seller Hub
  </Link>

  <Link
    href="/become-seller"
    className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-extrabold shadow-lg hover:scale-105 transition"
  >
    Register as Seller
  </Link>
</div>
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
    .select("name email status store_name")
    .lean();

  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="flex justify-center gap-4 mt-5">
  <Link
    href="/seller/login"
    className="bg-black text-white px-8 py-4 rounded-2xl font-extrabold"
  >
    Login to Seller Hub
  </Link>

  <Link
    href="/become-seller"
    className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-extrabold"
  >
    Register as Seller
  </Link>
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
    Product.countDocuments({
      seller_id: sellerId,
      stock: { $gt: 0, $lte: 5 },
    }),
    Product.countDocuments({
      seller_id: sellerId,
      status: "Pending Approval",
    }),
    Product.countDocuments({
      seller_id: sellerId,
      status: "Approved",
    }),
    Product.countDocuments({
      seller_id: sellerId,
      status: "Rejected",
    }),
    Product.countDocuments({
      seller_id: sellerId,
      status: "Draft",
    }),
    Order.find({
      "items.seller_id": sellerId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const sellerOrderItems = sellerOrdersRaw.flatMap((order: any) =>
    (order.items || [])
      .filter((item: any) => String(item.seller_id || "") === sellerId)
      .map((item: any, index: number) => ({
        order_id: String(order._id),
        item_index: index,
        customer_name: order.customer_name,
        payment_method: order.payment_method,
        createdAt: order.createdAt,
        product_name: item.product_name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        status: item.item_status || "Pending",
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

  const aiTools = [
    ["AI Product Description", "Generate clean marketplace product descriptions.", "AI"],
    ["AI SEO Generator", "Create SEO title, keywords and search tags.", "SEO"],
    ["AI Product Title Generator", "Make high-converting product titles.", "TITLE"],
    ["AI Sales Prediction", "Estimate sales chance from product data.", "BETA"],
    ["AI Trending Products", "Find trending categories and product ideas.", "TREND"],
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        <div className="grid grid-cols-1 gap-6">
        

          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-black via-gray-900 to-blue-900 text-white p-6 md:p-8 shadow">
              <p className="text-sm text-blue-200 font-semibold">
                Klassic Seller Hub
              </p>

              <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
                Welcome, {seller.name}
              </h1>

              <p className="text-gray-300 mt-2">
                Store: {seller.store_name || "Klassic Seller Store"}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-green-500/20 text-green-200 px-4 py-2 rounded-full font-bold">
                  ✅ {seller.status}
                </span>
                <span className="bg-yellow-500/20 text-yellow-200 px-4 py-2 rounded-full font-bold">
                  🏆 {sellerLevel}
                </span>
                <span className="bg-purple-500/20 text-purple-200 px-4 py-2 rounded-full font-bold">
                  🎁 Lucky Reward Box Active
                </span>
                <span className="bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full font-bold">
                  ⭐ Trust Score {trustScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <Stat title="My Products" value={productsTotal} color="text-gray-900" />
              <Stat title="Approved" value={approvedTotal} color="text-green-600" />
              <Stat title="Pending" value={pendingTotal} color="text-yellow-600" />
              <Stat title="Rejected" value={rejectedTotal} color="text-red-600" />
              <Stat title="Draft" value={draftTotal} color="text-gray-600" />
              <Stat title="Low Stock" value={lowStockTotal} color="text-orange-600" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat title="Total Orders" value={totalOrders} color="text-purple-600" />
              <Stat title="Pending Orders" value={pendingOrders} color="text-yellow-600" />
              <Stat title="Delivered" value={deliveredOrders} color="text-green-600" />
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Seller Revenue</p>
                <h2 className="text-3xl font-bold text-green-700">
                  ₹{sellerRevenue.toFixed(0)}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Link
                href="/seller/products"
                className="bg-blue-600 text-white p-5 rounded-2xl text-center font-bold shadow"
              >
                📦 My Products
              </Link>
              <Link
                href="/seller/products/add"
                className="bg-green-600 text-white p-5 rounded-2xl text-center font-bold shadow"
              >
                ➕ Add Product
              </Link>
              <Link
                href="/seller/orders"
                className="bg-purple-600 text-white p-5 rounded-2xl text-center font-bold shadow"
              >
                🚚 My Orders
              </Link>
              <Link
                href="/seller/products?status=Pending Approval"
                className="bg-yellow-500 text-black p-5 rounded-2xl text-center font-bold shadow"
              >
                ⏳ Pending Approval
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 bg-white rounded-3xl shadow p-6">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold">
                      AI Seller Growth Tools
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Product listing और sales growth के लिए smart tools.
                    </p>
                  </div>

                  <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                    AI Hub
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-5">
                  {aiTools.map(([title, text, badge]) => (
                    <div
                      key={title}
                      className="border rounded-2xl p-4 hover:shadow transition"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <h3 className="font-extrabold">{title}</h3>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                          {badge}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">{text}</p>

                      <button className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
                        Coming Soon
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow p-6">
                <h2 className="text-2xl font-extrabold">Seller Badges</h2>

                <div className="space-y-3 mt-5">
                  <Badge
                    title={`🏆 ${sellerLevel}`}
                    text="Based on approved products."
                  />
                  <Badge
                    title="✅ Verified Seller"
                    text="Seller account approved by Klassic."
                  />
                  <Badge
                    title="🎁 Lucky Reward Box"
                    text="Unlock seller rewards after approvals."
                  />
                  <Badge
                    title={`⭐ Trust Score ${trustScore}%`}
                    text="Improve with stock, orders and reviews."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-extrabold">Recent Orders</h2>
                  <p className="text-sm text-gray-500">
                    Latest items ordered from your store.
                  </p>
                </div>

                <Link
                  href="/seller/orders"
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  View All
                </Link>
              </div>

              {sellerOrderItems.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                  No orders yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-sm">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="p-3 text-left">Order</th>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sellerOrderItems.slice(0, 5).map((item: any) => (
                        <tr
                          key={`${item.order_id}-${item.item_index}`}
                          className="border-b"
                        >
                          <td className="p-3 font-bold">
                            #{item.order_id.slice(-6)}
                          </td>
                          <td className="p-3">{item.product_name}</td>
                          <td className="p-3">{item.customer_name || "-"}</td>
                          <td className="p-3 font-bold text-green-600">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-3">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

function Badge({ title, text }: { title: string; text: string }) {
  return (
    <div className="border rounded-2xl p-4 bg-gray-50">
      <p className="font-bold">{title}</p>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}