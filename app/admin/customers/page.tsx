import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  await connectDB();

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select("name email role createdAt")
    .lean();

  const customerStats = await Order.aggregate([
    {
      $group: {
        _id: "$user_id",
        totalOrders: { $sum: 1 },
        totalSpend: { $sum: "$total_amount" },
      },
    },
  ]);

  const statsMap = new Map(
    customerStats.map((item: any) => [
      String(item._id || ""),
      {
        totalOrders: Number(item.totalOrders || 0),
        totalSpend: Number(item.totalSpend || 0),
      },
    ])
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Customers</h1>

      <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Orders</th>
              <th className="text-left p-3">Total Spend</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              users.map((user: any) => {
                const userId = String(user._id);
                const stats = statsMap.get(userId) || {
                  totalOrders: 0,
                  totalSpend: 0,
                };

                return (
                  <tr key={userId} className="border-t">
                    <td className="p-3">#{userId.slice(-6)}</td>
                    <td className="p-3">{user.name || "Unknown"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{stats.totalOrders}</td>
                    <td className="p-3">₹{stats.totalSpend}</td>
                    <td className="p-3">
                      {new Date(user.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}