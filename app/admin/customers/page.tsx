import AdminCustomersTable from "@/components/admin/AdminCustomersTable";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCustomers() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/customers`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    return {
      customers: [],
      stats: {
        totalCustomers: 0,
        activeCustomers: 0,
        blockedCustomers: 0,
        totalRevenue: 0,
      },
    };
  }

  return res.json();
}

export default async function AdminCustomersPage() {
  const data = await getCustomers();

  const stats = data.stats || {
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
    totalRevenue: 0,
  };

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