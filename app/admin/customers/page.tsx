import AdminCustomersTable from "@/components/admin/AdminCustomersTable";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

async function getCustomers() {
  await connectDB();

  const customers = await User.find({ role: "customer" })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  const customersWithStats = await Promise.all(
    customers.map(async (customer: any) => {
      const orders = await Order.find({
        user_id: String(customer._id),
      }).lean();

      const totalSpend = orders.reduce(
        (sum: number, order: any) => sum + Number(order.total_amount || 0),
        0
      );

      return {
        ...customer,
        _id: String(customer._id),
        totalOrders: orders.length,
        totalSpend,
        status: customer.status || "Active",
        createdAt: customer.createdAt?.toISOString?.() || "",
      };
    })
  );

  const stats = {
    totalCustomers: customersWithStats.length,
    activeCustomers: customersWithStats.filter(
      (c: any) => c.status !== "Blocked"
    ).length,
    blockedCustomers: customersWithStats.filter(
      (c: any) => c.status === "Blocked"
    ).length,
    totalRevenue: customersWithStats.reduce(
      (sum: number, c: any) => sum + Number(c.totalSpend || 0),
      0
    ),
  };

  return {
    customers: customersWithStats,
    stats,
  };
}

export default async function AdminCustomersPage() {
  const data = await getCustomers();

  const stats = data.stats;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Customer Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer accounts, orders and activity.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="text-2xl font-bold">{stats.totalCustomers}</h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.activeCustomers}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Blocked</p>
          <h2 className="text-2xl font-bold text-red-600">
            {stats.blockedCustomers}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹{Number(stats.totalRevenue || 0).toFixed(0)}
          </h2>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border p-4">
        <AdminCustomersTable customers={data.customers || []} />
      </section>
    </main>
  );
}