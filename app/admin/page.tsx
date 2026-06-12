import OrdersTrendChart from "@/components/admin/OrdersTrendChart";
import OrderStatusChart from "@/components/admin/OrderStatusChart";
import RevenueChart from "@/components/admin/RevenueChart";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Review from "@/models/Review";

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
  last7Days.setHours(0, 0, 0, 0);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);
  last30Days.setHours(0, 0, 0, 0);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    productsTotal,
    ordersTotal,
    customersTotal,
    reviewsTotal,
    pendingOrdersTotal,
    revenueAgg,
    todayOrdersTotal,
    todayRevenueAgg,
    latestOrders,
    lowStockProducts,
    recentCustomers,
    topProducts,
    topCustomers,
    last7DaysRevenue,
    thisMonthRevenueAgg,
    lastMonthRevenueAgg,
    ordersTrend,
    statusStats,
  ] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ role: "customer" }),
    Review.countDocuments({}),
    Order.countDocuments({ status: "Pending" }),

    Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),

    Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    }),

    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),

    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customer_name phone total_amount status createdAt")
      .lean(),

    Product.find({ stock: { $lte: 5 } })
      .sort({ stock: 1 })
      .limit(5)
      .select("name stock")
      .lean(),

    User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt")
      .lean(),

    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_name",
          total_sold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { total_sold: -1 } },
      { $limit: 5 },
    ]),

    Order.aggregate([
      {
        $group: {
          _id: {
            customer_name: "$customer_name",
            phone: "$phone",
          },
          total_orders: { $sum: 1 },
          total_spent: { $sum: "$total_amount" },
        },
      },
      { $sort: { total_spent: -1 } },
      { $limit: 5 },
    ]),

    Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]),

    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonthStart, $lt: nextMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),

    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),

    Order.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]),

    Order.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]),
  ]);

  const revenueTotal = Number(revenueAgg[0]?.total || 0);
  const todayRevenueTotal = Number(todayRevenueAgg[0]?.total || 0);

  const currentMonth = Number(thisMonthRevenueAgg[0]?.total || 0);
  const previousMonth = Number(lastMonthRevenueAgg[0]?.total || 0);

  const growth =
    previousMonth > 0
      ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(2)
      : "0";

  const chartData = last7DaysRevenue.map((item: any) => ({
    day: formatDay(new Date(item._id.y, item._id.m - 1, item._id.d)),
    revenue: Number(item.revenue || 0),
  }));

  const ordersTrendData = ordersTrend.map((item: any) => ({
    day: formatDay(new Date(item._id.y, item._id.m - 1, item._id.d)),
    orders: Number(item.orders || 0),
  }));

  const statusMap = new Map(
    statusStats.map((item: any) => [item._id || "Pending", item.value])
  );

  const orderStatusData = [
    { name: "Pending", value: Number(statusMap.get("Pending") || 0) },
    { name: "Processing", value: Number(statusMap.get("Processing") || 0) },
    { name: "Shipped", value: Number(statusMap.get("Shipped") || 0) },
    { name: "Delivered", value: Number(statusMap.get("Delivered") || 0) },
    { name: "Cancelled", value: Number(statusMap.get("Cancelled") || 0) },
  ];

  const bestProduct = topProducts[0];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage products, orders, customers, reviews and store analytics.
          </p>
        </div>

        <Link
          href="/admin/product"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-center"
        >
          ➕ Add New Product
        </Link>
      </div>

      {productsTotal === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-5 rounded-xl mb-6 font-bold">
          ⚠️ No Products Available. Add products before going live.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <DashboardCard title="Store Status" value="Live" color="text-green-600" />
        <DashboardCard title="Total Revenue" value={`₹${revenueTotal}`} />
        <DashboardCard title="Reviews" value={reviewsTotal} color="text-blue-600" />
        <DashboardCard title="Pending Orders" value={pendingOrdersTotal} color="text-orange-600" />
        <DashboardCard title="Products" value={productsTotal} />
        <DashboardCard title="Orders" value={ordersTotal} />
        <DashboardCard title="Customers" value={customersTotal} />
        <DashboardCard title="Today Revenue" value={`₹${todayRevenueTotal}`} color="text-green-600" />
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-7 gap-4 mt-8">
        <AdminLink href="/admin/product" label="➕ Add Product" className="bg-green-600" />
        <AdminLink href="/admin/orders" label="📦 Manage Orders" className="bg-blue-600" />
        <AdminLink href="/admin/customers" label="👥 Customers" className="bg-purple-600" />
        <AdminLink href="/admin/reviews" label="⭐ Reviews" className="bg-red-600" />
        <AdminLink href="/admin/inventory" label="📊 Inventory" className="bg-cyan-600" />
        <AdminLink href="/admin/reports" label="📈 Reports" className="bg-orange-600" />
        <AdminLink href="/admin/sellers" label="🏪 Seller Requests" className="bg-yellow-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Seller Setup Checklist</h3>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className={productsTotal > 0 ? "bg-green-100 p-4 rounded" : "bg-red-100 p-4 rounded"}>
            {productsTotal > 0 ? "✅ Products Added" : "❌ Add Products"}
          </div>
          <div className="bg-green-100 p-4 rounded">✅ Store Live</div>
          <div className="bg-green-100 p-4 rounded">✅ Orders System Ready</div>
          <div className="bg-green-100 p-4 rounded">✅ Reviews Ready</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Monthly Revenue Analytics</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <SmallStat title="This Month" value={`₹${currentMonth}`} className="bg-green-100" />
          <SmallStat title="Last Month" value={`₹${previousMonth}`} className="bg-blue-100" />
          <SmallStat title="Growth %" value={`${growth}%`} className="bg-purple-100" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Order Status Statistics</h3>

        <div className="grid md:grid-cols-5 gap-4">
          {orderStatusData.map((item) => (
            <div key={item.name} className="bg-gray-100 p-4 rounded">
              {item.name}: {item.value}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Best Selling Product</h3>

        <div className="bg-green-100 p-6 rounded-lg">
          <p className="text-lg font-semibold">
            {bestProduct?._id || "No Sales Yet"}
          </p>

          <p className="text-3xl font-bold text-green-700 mt-2">
            {bestProduct?.total_sold || 0} Sold
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <TableCard title="Latest Orders">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.length === 0 ? (
                <EmptyRow colSpan={6} text="No orders yet" />
              ) : (
                latestOrders.map((order: any) => (
                  <tr key={String(order._id)}>
                    <td className="border p-2">{String(order._id).slice(-6)}</td>
                    <td className="border p-2">{order.customer_name || "Guest"}</td>
                    <td className="border p-2">{order.phone || "-"}</td>
                    <td className="border p-2">₹{order.total_amount || 0}</td>
                    <td className="border p-2">{order.status || "Pending"}</td>
                    <td className="border p-2">
                      <Link
                        href={`/admin/orders/${String(order._id)}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Low Stock Products">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <EmptyRow colSpan={3} text="No low stock products" />
              ) : (
                lowStockProducts.map((product: any) => (
                  <tr key={String(product._id)}>
                    <td className="border p-2">{String(product._id).slice(-6)}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2 text-red-600 font-bold">{product.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <TableCard title="Top Customers">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Customer</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Orders</th>
                <th className="border p-2">Spent</th>
              </tr>
            </thead>

            <tbody>
              {topCustomers.length === 0 ? (
                <EmptyRow colSpan={4} text="No customers yet" />
              ) : (
                topCustomers.map((customer: any) => (
                  <tr key={`${customer._id.customer_name}-${customer._id.phone}`}>
                    <td className="border p-2">{customer._id.customer_name || "Guest"}</td>
                    <td className="border p-2">{customer._id.phone || "-"}</td>
                    <td className="border p-2 font-bold">{customer.total_orders}</td>
                    <td className="border p-2 font-bold text-green-600">
                      ₹{customer.total_spent || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Top Selling Products">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product</th>
                <th className="border p-2">Sold Qty</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.length === 0 ? (
                <EmptyRow colSpan={2} text="No sales yet" />
              ) : (
                topProducts.map((product: any) => (
                  <tr key={product._id}>
                    <td className="border p-2">{product._id}</td>
                    <td className="border p-2 font-bold text-green-600">
                      {product.total_sold}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      </div>

      <TableCard title="Recent Customers" className="mt-8">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>

          <tbody>
            {recentCustomers.length === 0 ? (
              <EmptyRow colSpan={4} text="No customers found" />
            ) : (
              recentCustomers.map((user: any) => (
                <tr key={String(user._id)}>
                  <td className="border p-2">{String(user._id).slice(-6)}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      <TableCard title="Last 7 Days Revenue" className="mt-8">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {last7DaysRevenue.length === 0 ? (
              <EmptyRow colSpan={2} text="No revenue data" />
            ) : (
              last7DaysRevenue.map((item: any) => {
                const day = new Date(item._id.y, item._id.m - 1, item._id.d);
                return (
                  <tr key={`${item._id.y}-${item._id.m}-${item._id.d}`}>
                    <td className="border p-2">{day.toLocaleDateString("en-IN")}</td>
                    <td className="border p-2 font-bold text-green-600">
                      ₹{item.revenue || 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableCard>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Revenue Chart - Last 7 Days</h3>
        <RevenueChart data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Admin Notifications</h3>

        <div className="space-y-3">
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Low Stock Products: {lowStockProducts.length}
          </div>

          <div className="bg-orange-100 text-orange-700 p-4 rounded">
            Pending Orders: {pendingOrdersTotal}
          </div>

          <div className="bg-green-100 text-green-700 p-4 rounded">
            Today's Orders: {todayOrdersTotal}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Order Status Chart</h3>
        <OrderStatusChart data={orderStatusData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Orders Trend - Last 30 Days</h3>
        <OrdersTrendChart data={ordersTrendData} />
      </div>
    </>
  );
}

function DashboardCard({
  title,
  value,
  color = "",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
      className={`${className} text-white p-5 rounded-xl text-center font-bold`}
    >
      {label}
    </Link>
  );
}

function SmallStat({
  title,
  value,
  className,
}: {
  title: string;
  value: string | number;
  className: string;
}) {
  return (
    <div className={`${className} p-4 rounded`}>
      <h4>{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function TableCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow overflow-x-auto ${className}`}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="border p-4 text-center text-gray-500">
        {text}
      </td>
    </tr>
  );
}