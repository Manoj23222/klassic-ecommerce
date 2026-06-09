import UpdateStockButton from "@/components/UpdateStockButton";
import db from "@/lib/db";

export default async function InventoryPage() {
  const [products]: any = await db.query(
    "SELECT id, name, stock, price FROM products ORDER BY stock ASC"
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Inventory Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Action</th>
              
            </tr>
          </thead>

          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="p-3 border">{product.id}</td>
                <td className="p-3 border">{product.name}</td>
                <td className="p-3 border">₹{product.price}</td>

                <td
                  className={`p-3 border font-bold ${
                    product.stock <= 5
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {product.stock}
                </td>
                <td className="p-3 border">
  <UpdateStockButton
    id={product.id}
    currentStock={product.stock}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}