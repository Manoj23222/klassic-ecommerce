import db from "@/lib/db";

export default async function CustomersPage() {
  const [users]: any = await db.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      COUNT(o.id) AS totalOrders,
IFNULL(SUM(o.total_amount), 0) AS totalSpend
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email, u.role, u.created_at
    ORDER BY u.id DESC
  `);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-6">Customers</h1>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
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
            {users.map((user: any) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">#{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.totalOrders}</td>
                <td className="p-3">₹{user.totalSpend}</td>
                <td className="p-3">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}