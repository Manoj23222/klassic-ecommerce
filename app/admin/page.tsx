import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Review from "@/models/Review";
import Seller from "@/models/Seller";
import Payout from "@/models/Payout";
import WithdrawRequest from "@/models/WithdrawRequest";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await connectDB();

  const [
    productsTotal,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    ordersTotal,
    deliveredOrders,
    customersTotal,
    reviewsTotal,
    totalSellers,
    pendingSellers,
    approvedSellers,
    rejectedSellers,
    revenueAgg,
    pendingPayouts,
    withdrawRequests,
    latestOrders,
    lowStockProducts,
    returnRequests,
  ] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ status: "Pending Approval" }),
    Product.countDocuments({ status: "Approved" }),
    Product.countDocuments({ status: "Rejected" }),

    Order.countDocuments({}),
    Order.countDocuments({ status: "Delivered" }),

    User.countDocuments({ role: "customer" }),
    Review.countDocuments({}),

    Seller.countDocuments({}),
    Seller.countDocuments({ status: "Pending" }),
    Seller.countDocuments({ status: "Approved" }),
    Seller.countDocuments({ status: "Rejected" }),

    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]),

    Payout.countDocuments({ status: "Pending" }),
    WithdrawRequest.countDocuments({ status: "Pending" }),

    Order.find({}).sort({ createdAt: -1 }).limit(6).lean(),
    Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(6).lean(),
    Order.countDocuments({ return_status: "Requested" }),
  ]);

  const gmv = Number(revenueAgg[0]?.total || 0);
  const platformRevenue = Math.round(gmv * 0.12);
  const actionQueue =
    pendingProducts + pendingSellers + pendingPayouts + withdrawRequests + returnRequests;

  const productApprovalRate =
    productsTotal > 0 ? Math.round((approvedProducts / productsTotal) * 100) : 0;

  const sellerApprovalRate =
    totalSellers > 0 ? Math.round((approvedSellers / totalSellers) * 100) : 0;

  const deliveryRate =
    ordersTotal > 0 ? Math.round((deliveredOrders / ordersTotal) * 100) : 0;

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#050816] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-10">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
            Klassic Marketplace OS
          </p>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Super Admin Command Center
              </h1>

              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/65 md:text-base">
                Live marketplace control for sellers, catalog, orders, payouts,
                returns, marketing, reports and security.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-widest text-white/45">
                Action Queue
              </p>
              <p className="mt-2 text-4xl font-black">{actionQueue}</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">
                System online
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            <HeroMiniCard title="Pending Products" value={pendingProducts} />
            <HeroMiniCard title="Pending Sellers" value={pendingSellers} />
            <HeroMiniCard title="Payouts" value={pendingPayouts} />
            <HeroMiniCard title="Withdraws" value={withdrawRequests} />
            <HeroMiniCard title="Returns" value={returnRequests} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard icon="📈" title="GMV" value={`₹${gmv.toLocaleString("en-IN")}`} tone="green" />
        <KpiCard icon="💰" title="Revenue" value={`₹${platformRevenue.toLocaleString("en-IN")}`} tone="blue" />
        <KpiCard icon="📦" title="Orders" value={ordersTotal} />
        <KpiCard icon="👥" title="Customers" value={customersTotal} />
        <KpiCard icon="🏪" title="Sellers" value={totalSellers} />
        <KpiCard icon="🛍️" title="Products" value={productsTotal} />
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        <ActionCard
          icon="🏪"
          title="Seller Approvals"
          count={pendingSellers}
          text="Sellers waiting for verification."
          href="/admin/sellers"
          button="Review Sellers"
        />

        <ActionCard
          icon="📦"
          title="Product Moderation"
          count={pendingProducts}
          text="Products waiting for approval."
          href="/admin/products/pending"
          button="Approve Products"
        />

        <ActionCard
          icon="💰"
          title="Finance Queue"
          count={pendingPayouts + withdrawRequests}
          text="Payouts and withdraw requests."
          href="/admin/withdraw-requests"
          button="Open Finance"
        />

        <ActionCard
          icon="↩️"
          title="Return Requests"
          count={returnRequests}
          text="Customer returns pending review."
          href="/admin/orders/returns"
          button="Review Returns"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="grid gap-5 md:grid-cols-2">
          <ModuleCard
            title="Seller Management"
            icon="🏪"
            items={[
              `Total Sellers: ${totalSellers}`,
              `Pending KYC: ${pendingSellers}`,
              `Approved: ${approvedSellers}`,
              `Rejected: ${rejectedSellers}`,
            ]}
            href="/admin/sellers"
          />

          <ModuleCard
            title="Catalog Engine"
            icon="🧠"
            items={[
              "Category Tree Builder",
              "Dynamic Attribute Rules",
              "Brand Master",
              "Inventory Control",
            ]}
            href="/admin/categories"
          />

          <ModuleCard
            title="Product Moderation"
            icon="📦"
            items={[
              `All Products: ${productsTotal}`,
              `Pending: ${pendingProducts}`,
              `Approved: ${approvedProducts}`,
              `Rejected: ${rejectedProducts}`,
            ]}
            href="/admin/products"
          />

          <ModuleCard
            title="Financials & Payouts"
            icon="💰"
            items={[
              `GMV: ₹${gmv.toLocaleString("en-IN")}`,
              `Revenue: ₹${platformRevenue.toLocaleString("en-IN")}`,
              `Pending Payouts: ${pendingPayouts}`,
              `Withdraw Requests: ${withdrawRequests}`,
            ]}
            href="/admin/seller-payouts"
          />

          <ModuleCard
            title="Orders & Shipping"
            icon="🚚"
            items={[
              `Total Orders: ${ordersTotal}`,
              `Delivered: ${deliveredOrders}`,
              `Returns: ${returnRequests}`,
              "Shipping Config",
            ]}
            href="/admin/orders"
          />

          <ModuleCard
            title="AI Center"
            icon="🤖"
            items={[
              "AI Description",
              "AI SEO",
              "AI Product Title",
              "AI Sales Prediction",
            ]}
            href="/admin/ai-center"
          />
        </section>

        <aside className="space-y-5">
          <HealthCard
            title="Product Approval"
            value={productApprovalRate}
            text={`${approvedProducts}/${productsTotal} approved`}
          />

          <HealthCard
            title="Seller Verification"
            value={sellerApprovalRate}
            text={`${approvedSellers}/${totalSellers} approved`}
          />

          <HealthCard
            title="Order Delivery"
            value={deliveryRate}
            text={`${deliveredOrders}/${ordersTotal} delivered`}
          />

          <div className="rounded-[2rem] bg-black p-6 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              AI Marketplace Insights
            </p>
            <h2 className="mt-3 text-2xl font-black">Smart Overview</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-white/70">
              <p>🔥 Trending: Electronics</p>
              <p>📈 Predicted Revenue: ₹{(platformRevenue * 3).toLocaleString("en-IN")}</p>
              <p>⚠️ Low Stock Items: {lowStockProducts.length}</p>
              <p>↩️ Returns Pending: {returnRequests}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TableCard title="Latest Orders">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.length === 0 ? (
                <EmptyRow colSpan={4} text="No orders yet" />
              ) : (
                latestOrders.map((order: any) => (
                  <tr key={String(order._id)} className="border-b">
                    <td className="p-3 font-black">
                      #{String(order._id).slice(-6).toUpperCase()}
                    </td>
                    <td className="p-3">{order.customer_name || "Guest"}</td>
                    <td className="p-3 font-black text-green-700">
                      ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      <Badge text={order.status || "Pending"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Critical Inventory">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <EmptyRow colSpan={3} text="No low stock products" />
              ) : (
                lowStockProducts.map((product: any) => (
                  <tr key={String(product._id)} className="border-b">
                    <td className="p-3 font-bold">{product.name}</td>
                    <td className="p-3 text-gray-500">{product.sku || "-"}</td>
                    <td className="p-3 font-black text-red-600">
                      {product.stock || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      </section>
    </main>
  );
}

function HeroMiniCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-bold text-white/55">{title}</p>
      <h3 className="mt-1 text-2xl font-black text-white">{value}</h3>
    </div>
  );
}

function KpiCard({
  icon,
  title,
  value,
  tone = "dark",
}: {
  icon: string;
  title: string;
  value: string | number;
  tone?: "green" | "blue" | "dark";
}) {
  const color =
    tone === "green"
      ? "text-green-700"
      : tone === "blue"
      ? "text-blue-700"
      : "text-slate-950";

  return (
    <div className="group rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-gray-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <h2 className={`mt-3 text-2xl font-black ${color}`}>{value}</h2>
      <p className="mt-2 text-xs font-bold text-gray-400">Live marketplace</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  count,
  text,
  href,
  button,
}: {
  icon: string;
  title: string;
  count: number;
  text: string;
  href: string;
  button: string;
}) {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <span className="text-4xl">{icon}</span>
        <span className="rounded-full bg-black px-3 py-1 text-xs font-black text-white">
          {count}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-gray-500">{text}</p>

      <Link
        href={href}
        className="mt-5 inline-block rounded-full bg-black px-5 py-3 text-sm font-black text-white"
      >
        {button}
      </Link>
    </div>
  );
}

function ModuleCard({
  title,
  icon,
  items,
  href,
}: {
  title: string;
  icon: string;
  items: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-gray-50 p-3 text-xs font-bold text-gray-700"
          >
            {item}
          </div>
        ))}
      </div>
    </Link>
  );
}

function HealthCard({
  title,
  value,
  text,
}: {
  title: string;
  value: number;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <h2 className="font-black">{title}</h2>
        <span className="font-black">{value}%</span>
      </div>

      <div className="mt-4 h-3 rounded-full bg-gray-100">
        <div
          className="h-3 rounded-full bg-black"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-gray-500">{text}</p>
    </div>
  );
}

function TableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      <div className="overflow-x-auto p-5">{children}</div>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center text-gray-500">
        {text}
      </td>
    </tr>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
      {text}
    </span>
  );
}