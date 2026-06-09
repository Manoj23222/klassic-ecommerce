import db from "@/lib/db";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default async function AdminOrdersPage() {
  const [orders]: any = await db.query(
    "SELECT * FROM orders ORDER BY id DESC"
  );

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">
        Admin Orders
      </h1>

      <AdminOrdersTable orders={orders} />
    </>
  );
}