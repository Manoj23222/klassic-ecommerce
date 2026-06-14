import OrdersTrendChart from "@/components/admin/OrdersTrendChart";
import OrderStatusChart from "@/components/admin/OrderStatusChart";
import RevenueChart from "@/components/admin/RevenueChart";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Review from "@/models/Review";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

function formatDay(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default async function AdminPage() {
  await connectDB();

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  const [
    productsTotal,
    ordersTotal,
    customersTotal,
    reviewsTotal,
    totalSellers,
    pendingSellers,
    approvedSellers,
    rejectedSellers,
    pendingProducts,
    revenueAgg,
    latestOrders,
    lowStockProducts,
  ] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ role: "customer" }),
    Review.countDocuments({}),

    Seller.countDocuments({}),
    Seller.countDocuments({ status: "Pending" }),
    Seller.countDocuments({ status: "Approved" }),
    Seller.countDocuments({ status: "Rejected" }),

    Product.countDocuments({
      status: "Pending Approval",
    }),

    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]),

    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Product.find({
      stock: { $lte: 5 },
    })
      .limit(5)
      .lean(),
  ]);

  const revenueTotal = Number(
    revenueAgg[0]?.total || 0
  );

  return (
    <>
      {/* HERO */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-8 shadow-xl mb-8">
        <p className="text-blue-300 font-bold">
          KLASSIC MARKETPLACE
        </p>

        <h1 className="text-4xl font-extrabold mt-2">
          Admin Control Center
        </h1>

        <p className="text-gray-300 mt-3">
          Complete marketplace control like
          Amazon & Flipkart.
        </p>
      </div>

      {/* TOP CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <DashboardCard
          title="Revenue"
          value={`₹${revenueTotal}`}
          color="text-green-600"
        />

        <DashboardCard
          title="Orders"
          value={ordersTotal}
        />

        <DashboardCard
          title="Customers"
          value={customersTotal}
        />

        <DashboardCard
          title="Products"
          value={productsTotal}
        />

        <DashboardCard
          title="Sellers"
          value={totalSellers}
          color="text-blue-600"
        />

        <DashboardCard
          title="Pending Sellers"
          value={pendingSellers}
          color="text-orange-600"
        />

        <DashboardCard
          title="Approved"
          value={approvedSellers}
          color="text-green-600"
        />

        <DashboardCard
          title="Rejected"
          value={rejectedSellers}
          color="text-red-600"
        />
      </div>

      {/* MARKETPLACE CONTROL */}

      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <AdminLink
          href="/admin/sellers"
          label="🏪 Seller Requests"
          className="bg-blue-600"
        />

        <AdminLink
          href="/admin/products/pending"
          label="📦 Product Approval"
          className="bg-green-600"
        />

        <AdminLink
          href="/admin/orders"
          label="🛒 Orders"
          className="bg-purple-600"
        />

        <AdminLink
          href="/admin/reports"
          label="📊 Reports"
          className="bg-orange-600"
        />
      </div>
            {/* SELLER + PRODUCT CONTROL */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <ControlCard
          title="Seller Management"
          text="Approve, reject, suspend and monitor sellers."
          items={[
            `Total Sellers: ${totalSellers}`,
            `Pending Requests: ${pendingSellers}`,
            `Approved Sellers: ${approvedSellers}`,
            `Rejected Sellers: ${rejectedSellers}`,
          ]}
          href="/admin/sellers"
          button="Open Seller Control"
        />

        <ControlCard
          title="Product Approval"
          text="Review marketplace products before going live."
          items={[
            `Total Products: ${productsTotal}`,
            `Pending Approval: ${pendingProducts}`,
            `Low Stock Products: ${lowStockProducts.length}`,
            `Reviews: ${reviewsTotal}`,
          ]}
          href="/admin/products/pending"
          button="Review Products"
        />
      </div>

      {/* AI CENTER */}

      <div className="bg-white rounded-3xl shadow border p-6 mt-8">
        <h2 className="text-2xl font-extrabold mb-2">
          AI Center
        </h2>

        <p className="text-gray-500 mb-5">
          Klassic unique AI tools for marketplace growth.
        </p>

        <div className="grid md:grid-cols-5 gap-4">
          {[
            "AI Product Description",
            "AI SEO Generator",
            "AI Product Title",
            "AI Sales Prediction",
            "AI Trending Products",
          ].map((item) => (
            <div
              key={item}
              className="border rounded-2xl p-4 bg-gray-50"
            >
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-extrabold text-sm">
                {item}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LATEST ORDERS + LOW STOCK */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <TableCard title="Latest Orders">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.length === 0 ? (
                <EmptyRow colSpan={4} text="No orders yet" />
              ) : (
                latestOrders.map((order: any) => (
                  <tr key={String(order._id)} className="border-b">
                    <td className="p-3 font-bold">
                      #{String(order._id).slice(-6)}
                    </td>
                    <td className="p-3">
                      {order.customer_name || "Guest"}
                    </td>
                    <td className="p-3 font-bold text-green-600">
                      ₹{order.total_amount || 0}
                    </td>
                    <td className="p-3">
                      {order.status || "Pending"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Low Stock Products">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <EmptyRow colSpan={2} text="No low stock products" />
              ) : (
                lowStockProducts.map((product: any) => (
                  <tr key={String(product._id)} className="border-b">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3 font-bold text-red-600">
                      {product.stock}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      </div>
    </>
  );
}

function DashboardCard({
  title,
  value,
  color = "text-gray-900",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-extrabold mt-1 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function AdminLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`${className} text-white p-5 rounded-2xl text-center font-extrabold shadow`}
    >
      {label}
    </Link>
  );
}

function ControlCard({
  title,
  text,
  items,
  href,
  button,
}: {
  title: string;
  text: string;
  items: string[];
  href: string;
  button: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow border p-6">
      <h2 className="text-2xl font-extrabold">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {text}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {items.map((item) => (
          <div
            key={item}
            className="bg-gray-50 border rounded-2xl p-4 text-sm font-bold"
          >
            {item}
          </div>
        ))}
      </div>

      <Link
        href={href}
        className="inline-block mt-6 bg-gray-950 text-white px-6 py-3 rounded-2xl font-extrabold"
      >
        {button}
      </Link>
    </div>
  );
}

function TableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow border overflow-x-auto">
      <div className="p-5 border-b">
        <h2 className="text-2xl font-extrabold">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function EmptyRow({
  colSpan,
  text,
}: {
  colSpan: number;
  text: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="p-6 text-center text-gray-500"
      >
        {text}
      </td>
    </tr>
  );
}