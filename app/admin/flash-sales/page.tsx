import connectDB from "@/lib/mongodb";
import FlashSale from "@/models/FlashSale";
import Product from "@/models/Product";
import AdminFlashSaleForm from "@/components/admin/AdminFlashSaleForm";
import AdminFlashSaleActions from "@/components/admin/AdminFlashSaleActions";

export const dynamic = "force-dynamic";

export default async function AdminFlashSalesPage() {
  await connectDB();

  const sales = await FlashSale.find().sort({ createdAt: -1 }).lean();

  const productsRaw = await Product.find({ status: "Approved" })
    .select("name price image")
    .sort({ createdAt: -1 })
    .lean();

  const products = productsRaw.map((p: any) => ({
    id: String(p._id),
    name: p.name,
    price: Number(p.price || 0),
    image: p.image || "",
  }));

  const now = new Date();

  const activeSales = sales.filter(
    (s: any) =>
      s.active &&
      new Date(s.start_date) <= now &&
      new Date(s.end_date) >= now
  ).length;

  const upcomingSales = sales.filter(
    (s: any) => new Date(s.start_date) > now
  ).length;

  const expiredSales = sales.filter(
    (s: any) => new Date(s.end_date) < now
  ).length;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Flash Sales
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create limited-time deals with countdown offers.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card title="Total Sales" value={sales.length} />
        <Card title="Active Now" value={activeSales} />
        <Card title="Upcoming" value={upcomingSales} />
        <Card title="Expired" value={expiredSales} />
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Create Flash Sale</h2>
        <AdminFlashSaleForm products={products} />
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">All Flash Sales</h2>

        {sales.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No flash sales found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sales.map((sale: any) => {
              const start = new Date(sale.start_date);
              const end = new Date(sale.end_date);

              const saleStatus =
                sale.active && start <= now && end >= now
                  ? "Live"
                  : start > now
                  ? "Upcoming"
                  : "Expired";

              return (
                <div
                  key={String(sale._id)}
                  className="border rounded-2xl p-4 bg-gray-50"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-xl">
                        {sale.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Products: {(sale.product_ids || []).length}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                        saleStatus === "Live"
                          ? "bg-green-100 text-green-700"
                          : saleStatus === "Upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {saleStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <MiniCard
                      title="Discount"
                      value={`${sale.discount_percent || 0}%`}
                    />
                    <MiniCard
                      title="Active"
                      value={sale.active ? "Yes" : "No"}
                    />
                    <MiniCard
                      title="Items"
                      value={(sale.product_ids || []).length}
                    />
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      Start: {start.toLocaleString("en-IN")}
                    </p>
                    <p>
                      End: {end.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="mt-4">
                    <AdminFlashSaleActions
                      saleId={String(sale._id)}
                      active={Boolean(sale.active)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white border rounded-xl p-2">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}