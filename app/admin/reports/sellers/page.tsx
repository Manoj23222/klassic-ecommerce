import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function SellerReportsPage() {
  await connectDB();

  const [sellers, products, orders] = await Promise.all([
    Seller.find().sort({ createdAt: -1 }).lean(),
    Product.find().lean(),
    Order.find().lean(),
  ]);

  const totalSellers = sellers.length;
  const approved = sellers.filter((s: any) => s.status === "Approved").length;
  const pending = sellers.filter((s: any) => s.status === "Pending").length;
  const rejected = sellers.filter((s: any) => s.status === "Rejected").length;

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Admin Reports
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Seller Performance Report
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Track seller onboarding, approvals, products, orders and revenue.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Stat title="Total Sellers" value={totalSellers} />
          <Stat title="Approved" value={approved} />
          <Stat title="Pending" value={pending} />
          <Stat title="Rejected" value={rejected} />
        </div>
      </div>

      <div className="grid gap-5">
        {sellers.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black">No sellers found</h2>
          </div>
        ) : (
          sellers.map((seller: any) => {
            const sellerId = String(seller._id);

            const sellerProducts = products.filter(
              (p: any) => String(p.seller_id || "") === sellerId
            );

            const sellerOrders = orders.filter((order: any) =>
              (order.items || []).some(
                (item: any) => String(item.seller_id || "") === sellerId
              )
            );

            const revenue = sellerOrders.reduce((sum: number, order: any) => {
              const sellerAmount = (order.items || [])
                .filter((item: any) => String(item.seller_id || "") === sellerId)
                .reduce(
                  (s: number, item: any) =>
                    s +
                    Number(item.price || 0) *
                      Number(item.quantity || 1),
                  0
                );

              return sum + sellerAmount;
            }, 0);

            return (
              <article
                key={sellerId}
                className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      {seller.store_name || "Klassic Seller"}
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {seller.name || "Seller"}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-gray-500">
                      {seller.email}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1.5 text-xs font-black ${
                      seller.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : seller.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {seller.status || "Pending"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <Info title="Products" value={sellerProducts.length} />
                  <Info title="Orders" value={sellerOrders.length} />
                  <Info
                    title="Revenue"
                    value={`₹${revenue.toLocaleString("en-IN")}`}
                  />
                  <Info title="Trust Score" value={seller.trust_score || 60} />
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/45">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}