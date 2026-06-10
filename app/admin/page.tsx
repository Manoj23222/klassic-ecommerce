import OrdersTrendChart from "@/components/admin/OrdersTrendChart";
import OrderStatusChart from "@/components/admin/OrderStatusChart";
import RevenueChart from "@/components/admin/RevenueChart";
import Link from "next/link";
import db from "@/lib/db";

export default async function AdminPage() {
  const [products]: any = await db.query("SELECT COUNT(*) as total FROM products");
  const [orders]: any = await db.query("SELECT COUNT(*) as total FROM orders");
  const [customers]: any = await db.query("SELECT COUNT(*) as total FROM users");
  const [reviews]: any = await db.query("SELECT COUNT(*) as total FROM reviews");
  const [revenue]: any = await db.query("SELECT SUM(total_amount) as total FROM orders");
  const [pendingOrders]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Pending'");
  const [latestOrders]: any = await db.query(
    "SELECT id, customer_name, phone, total_amount, status FROM orders ORDER BY id DESC LIMIT 5"
  );

  const [todayOrders]: any = await db.query(`
    SELECT COUNT(*) as total FROM orders WHERE DATE(created_at) = CURDATE()
  `);

  const [todayRevenue]: any = await db.query(`
    SELECT SUM(total_amount) as total FROM orders WHERE DATE(created_at) = CURDATE()
  `);

  const [lowStockProducts]: any = await db.query(
    "SELECT id, name, stock FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 5"
  );

  const [topProducts]: any = await db.query(`
    SELECT product_name, SUM(quantity) as total_sold
    FROM order_items
    GROUP BY product_name
    ORDER BY total_sold DESC
    LIMIT 5
  `);

  const [recentCustomers]: any = await db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC LIMIT 5"
  );

  const [last7DaysRevenue]: any = await db.query(`
    SELECT DATE(created_at) as day, SUM(total_amount) as revenue
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `);

  const chartData = last7DaysRevenue.map((item: any) => ({
    day: new Date(item.day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    revenue: Number(item.revenue || 0),
  }));

  const [pendingCount]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Pending'");
  const [processingCount]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Processing'");
  const [shippedCount]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Shipped'");
  const [deliveredCount]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Delivered'");
  const [cancelledCount]: any = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'Cancelled'");

  const [topCustomers]: any = await db.query(`
    SELECT customer_name, phone, COUNT(*) as total_orders, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY customer_name, phone
    ORDER BY total_spent DESC
    LIMIT 5
  `);

  const [thisMonthRevenue]: any = await db.query(`
    SELECT SUM(total_amount) as total
    FROM orders
    WHERE MONTH(created_at) = MONTH(CURDATE())
    AND YEAR(created_at) = YEAR(CURDATE())
  `);

  const [lastMonthRevenue]: any = await db.query(`
    SELECT SUM(total_amount) as total
    FROM orders
    WHERE MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
    AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH)
  `);

  const [bestProduct]: any = await db.query(`
    SELECT product_name, SUM(quantity) as total_sold
    FROM order_items
    GROUP BY product_name
    ORDER BY total_sold DESC
    LIMIT 1
  `);

  const [ordersTrend]: any = await db.query(`
    SELECT DATE(created_at) as day, COUNT(*) as orders
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `);

  const ordersTrendData = ordersTrend.map((item: any) => ({
    day: new Date(item.day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    orders: Number(item.orders || 0),
  }));

  const orderStatusData = [
    { name: "Pending", value: pendingCount[0].total },
    { name: "Processing", value: processingCount[0].total },
    { name: "Shipped", value: shippedCount[0].total },
    { name: "Delivered", value: deliveredCount[0].total },
    { name: "Cancelled", value: cancelledCount[0].total },
  ];

  const currentMonth = Number(thisMonthRevenue[0].total || 0);
  const previousMonth = Number(lastMonthRevenue[0].total || 0);

  const growth =
    previousMonth > 0
      ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(2)
      : "0";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h2>
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

      {products[0].total === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-5 rounded-xl mb-6 font-bold">
          ⚠️ No Products Available. Add products before going live.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Store Status</h3>
          <p className="text-2xl font-bold text-green-600">Live</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{revenue[0].total || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Reviews</h3>
          <p className="text-3xl font-bold text-blue-600">{reviews[0].total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-600">
            {pendingOrders[0].total}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Products</h3>
          <p className="text-3xl font-bold">{products[0].total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <p className="text-3xl font-bold">{orders[0].total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Customers</h3>
          <p className="text-3xl font-bold">{customers[0].total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Today Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{todayRevenue[0].total || 0}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
        <Link href="/admin/product" className="bg-green-600 text-white p-5 rounded-xl text-center font-bold">
          ➕ Add Product
        </Link>

        <Link href="/admin/orders" className="bg-blue-600 text-white p-5 rounded-xl text-center font-bold">
          📦 Manage Orders
        </Link>

        <Link href="/admin/customers" className="bg-purple-600 text-white p-5 rounded-xl text-center font-bold">
          👥 Customers
        </Link>

        <Link href="/admin/reviews" className="bg-red-600 text-white p-5 rounded-xl text-center font-bold">
          ⭐ Reviews
        </Link>

        <Link href="/admin/inventory" className="bg-cyan-600 text-white p-5 rounded-xl text-center font-bold">
          📊 Inventory
        </Link>

        <Link href="/admin/reports" className="bg-orange-600 text-white p-5 rounded-xl text-center font-bold">
          📈 Reports
        </Link>
        <Link
  href="/admin/sellers"
  className="bg-yellow-600 text-white p-5 rounded-xl text-center font-bold"
>
  🏪 Seller Requests
</Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Seller Setup Checklist</h3>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className={products[0].total > 0 ? "bg-green-100 p-4 rounded" : "bg-red-100 p-4 rounded"}>
            {products[0].total > 0 ? "✅ Products Added" : "❌ Add Products"}
          </div>

          <div className="bg-green-100 p-4 rounded">✅ Store Live</div>

          <div className="bg-green-100 p-4 rounded">✅ Orders System Ready</div>

          <div className="bg-green-100 p-4 rounded">✅ Reviews Ready</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Monthly Revenue Analytics</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-4 rounded">
            <h4>This Month</h4>
            <p className="text-2xl font-bold">₹{currentMonth}</p>
          </div>

          <div className="bg-blue-100 p-4 rounded">
            <h4>Last Month</h4>
            <p className="text-2xl font-bold">₹{previousMonth}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded">
            <h4>Growth %</h4>
            <p className="text-2xl font-bold">{growth}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Order Status Statistics</h3>

        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-yellow-100 p-4 rounded">Pending: {pendingCount[0].total}</div>
          <div className="bg-blue-100 p-4 rounded">Processing: {processingCount[0].total}</div>
          <div className="bg-purple-100 p-4 rounded">Shipped: {shippedCount[0].total}</div>
          <div className="bg-green-100 p-4 rounded">Delivered: {deliveredCount[0].total}</div>
          <div className="bg-red-100 p-4 rounded">Cancelled: {cancelledCount[0].total}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h3 className="text-xl font-bold mb-4">Best Selling Product</h3>

        <div className="bg-green-100 p-6 rounded-lg">
          <p className="text-lg font-semibold">
            {bestProduct[0]?.product_name || "No Sales Yet"}
          </p>

          <p className="text-3xl font-bold text-green-700 mt-2">
            {bestProduct[0]?.total_sold || 0} Sold
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Latest Orders</h3>

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
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                latestOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.customer_name || "Guest"}</td>
                    <td className="border p-2">{order.phone || "-"}</td>
                    <td className="border p-2">₹{order.total_amount || 0}</td>
                    <td className="border p-2">{order.status || "Pending"}</td>
                    <td className="border p-2">
                      <Link href={`/admin/orders/${order.id}`} className="bg-blue-600 text-white px-3 py-1 rounded">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Low Stock Products</h3>

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
                <tr>
                  <td colSpan={3} className="border p-4 text-center text-gray-500">
                    No low stock products
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((product: any) => (
                  <tr key={product.id}>
                    <td className="border p-2">{product.id}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2 text-red-600 font-bold">{product.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Top Customers</h3>

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
                <tr>
                  <td colSpan={4} className="border p-4 text-center text-gray-500">
                    No customers yet
                  </td>
                </tr>
              ) : (
                topCustomers.map((customer: any) => (
                  <tr key={`${customer.customer_name}-${customer.phone}`}>
                    <td className="border p-2">{customer.customer_name || "Guest"}</td>
                    <td className="border p-2">{customer.phone || "-"}</td>
                    <td className="border p-2 font-bold">{customer.total_orders}</td>
                    <td className="border p-2 font-bold text-green-600">
                      ₹{customer.total_spent || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>

          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product</th>
                <th className="border p-2">Sold Qty</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="border p-4 text-center text-gray-500">
                    No sales yet
                  </td>
                </tr>
              ) : (
                topProducts.map((product: any) => (
                  <tr key={product.product_name}>
                    <td className="border p-2">{product.product_name}</td>
                    <td className="border p-2 font-bold text-green-600">
                      {product.total_sold}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8 overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Recent Customers</h3>

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
              <tr>
                <td colSpan={4} className="border p-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              recentCustomers.map((user: any) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8 overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Last 7 Days Revenue</h3>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {last7DaysRevenue.length === 0 ? (
              <tr>
                <td colSpan={2} className="border p-4 text-center text-gray-500">
                  No revenue data
                </td>
              </tr>
            ) : (
              last7DaysRevenue.map((item: any) => (
                <tr key={item.day}>
                  <td className="border p-2">{String(item.day).split("T")[0]}</td>
                  <td className="border p-2 font-bold text-green-600">
                    ₹{item.revenue || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            Pending Orders: {pendingOrders[0].total}
          </div>

          <div className="bg-green-100 text-green-700 p-4 rounded">
            Today's Orders: {todayOrders[0].total}
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