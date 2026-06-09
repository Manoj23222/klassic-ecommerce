import AdminProductsTable from "@/components/admin/AdminProductsTable";
import DeleteProductButton from "@/components/DeleteProductButton";
import AdminProductForm from "@/components/AdminProductForm";
import db from "@/lib/db";

export default async function ProductsPage() {
  const [products]: any = await db.query(
    "SELECT * FROM products ORDER BY id DESC"
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <AdminProductForm />
      </div>

<div className="mt-8 bg-white rounded-xl shadow p-6">
  <AdminProductsTable products={products} />
</div>
    </div>
  );
}