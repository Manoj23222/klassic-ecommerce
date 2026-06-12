import UpdateStockButton from "@/components/UpdateStockButton";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  await connectDB();

  const products = await Product.find({})
    .sort({ stock: 1 })
    .select("name stock price")
    .lean();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">
        Inventory Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[700px] border">
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product: any) => {
                const productId = String(product._id);

                return (
                  <tr key={productId}>
                    <td className="p-3 border">
                      {productId.slice(-6)}
                    </td>

                    <td className="p-3 border">
                      {product.name}
                    </td>

                    <td className="p-3 border">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </td>

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
                        id={productId}
                        currentStock={product.stock}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}