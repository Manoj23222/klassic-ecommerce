import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function SalesPredictionPage() {
  await connectDB();

  const products = await Product.find().sort({ createdAt: -1 }).limit(20).lean();
  const orders = await Order.find().lean().catch(() => []);

  const totalOrders = orders.length;

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black">AI Sales Prediction Dashboard</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-black">{totalOrders}</h2>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Products Checked</p>
            <h2 className="text-3xl font-black">{products.length}</h2>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">AI Status</p>
            <h2 className="text-3xl font-black text-green-600">Active</h2>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Prediction</th>
                <th className="p-4">AI Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => {
                const stock = Number(p.stock || 0);
                const prediction =
                  stock <= 5 ? "High Demand Risk" : stock <= 20 ? "Medium Demand" : "Stable";
                const suggestion =
                  stock <= 5 ? "Restock fast" : stock <= 20 ? "Run small discount" : "Keep normal price";

                return (
                  <tr key={String(p._id)} className="border-b">
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4">{stock}</td>
                    <td className="p-4 font-bold text-orange-600">{prediction}</td>
                    <td className="p-4">{suggestion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}