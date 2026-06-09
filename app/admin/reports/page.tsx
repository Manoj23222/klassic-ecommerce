import db from "@/lib/db";
import Link from "next/link";

export default async function ReportsPage() {
  const [orders]: any = await db.query("SELECT COUNT(*) as total FROM orders");
  const [products]: any = await db.query("SELECT COUNT(*) as total FROM products");
  const [customers]: any = await db.query("SELECT COUNT(*) as total FROM users");
  const [revenue]: any = await db.query("SELECT SUM(total_amount) as total FROM orders");
  const [last7DaysRevenue]: any = await db.query(`
  SELECT
    DATE(created_at) as day,
    SUM(total_amount) as revenue
  FROM orders
  WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  GROUP BY DATE(created_at)
  ORDER BY day ASC
`); 

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <Link href="/admin" className="text-blue-600">
        ← Back to Admin
      </Link>

      <h1 className="text-4xl font-bold my-6">Reports</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Revenue</h3>
          <p className="text-3xl font-bold">₹{revenue[0].total || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold">{orders[0].total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Products</h3>
          <p className="text-3xl font-bold">{products[0].total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Customers</h3>
          <p className="text-3xl font-bold">{customers[0].total}</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
  <h3 className="text-xl font-bold mb-4">
    Export Reports
  </h3>

  <a
    href="/api/admin/export-orders"
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Export Orders CSV
  </a>

<a
  href="/api/admin/export-customers"
  className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-3"
>
  Export Customers CSV
</a>
<a
  href="/api/admin/export-products"
  className="bg-purple-600 text-white px-4 py-2 rounded-lg ml-3"
>
  Export Products CSV
</a>
</div>
<div className="bg-white p-6 rounded-xl shadow mt-8">
  <h3 className="text-xl font-bold mb-4">
    Last 7 Days Revenue
  </h3>

  <table className="w-full border">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-2">Date</th>
        <th className="border p-2">Revenue</th>
      </tr>
    </thead>

    <tbody>
      {last7DaysRevenue.map((item: any) => (
        <tr key={item.day}>
          <td className="border p-2">
            {String(item.day).split("T")[0]}
          </td>
          <td className="border p-2 font-bold text-green-600">
            ₹{item.revenue}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </main>
  );
}