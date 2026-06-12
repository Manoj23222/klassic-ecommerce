import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await connectDB();

  const [orders, products, customers, revenueAgg] = await Promise.all([
    Order.countDocuments({}),
    Product.countDocuments({}),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]),
  ]);

  const revenue = Number(revenueAgg[0]?.total || 0);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">
      <Link href="/admin" className="text-blue-600">
        ← Back to Admin
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold my-6">
        Reports
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        <ReportCard title="Total Revenue" value={`₹${revenue}`} />
        <ReportCard title="Total Orders" value={orders} />
        <ReportCard title="Total Products" value={products} />
        <ReportCard title="Total Customers" value={customers} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">
          Export Reports
        </h3>

        <div className="flex flex-wrap gap-3">
          <a
            href="/api/admin/export-orders"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Export Orders CSV
          </a>

          <a
            href="/api/admin/export-customers"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Export Customers CSV
          </a>

          <a
            href="/api/admin/export-products"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Export Products CSV
          </a>
        </div>
      </div>
    </main>
  );
}

function ReportCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3>{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}