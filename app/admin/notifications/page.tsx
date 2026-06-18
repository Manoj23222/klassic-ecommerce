import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Seller from "@/models/Seller";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  await connectDB();

  const [customers, sellers, pendingOrders] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    Seller.countDocuments({ status: "Approved" }),
    Order.countDocuments({ status: "Pending" }),
  ]);

  const notifications = [
    {
      title: "Order Update Campaign",
      audience: "Customers",
      count: customers,
      status: "Ready",
      desc: "Send updates about order tracking, delivery and returns.",
      icon: "📦",
    },
    {
      title: "Seller Announcement",
      audience: "Approved Sellers",
      count: sellers,
      status: "Ready",
      desc: "Notify sellers about payouts, policies and marketplace updates.",
      icon: "🏪",
    },
    {
      title: "Pending Order Reminder",
      audience: "Operations",
      count: pendingOrders,
      status: "Action Needed",
      desc: "Internal reminder for pending order processing.",
      icon: "⏰",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Marketing Control
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Notifications Center
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Manage customer, seller and internal marketplace notifications.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Customers" value={customers} />
          <Stat title="Approved Sellers" value={sellers} />
          <Stat title="Pending Orders" value={pendingOrders} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {notifications.map((item) => (
          <section
            key={item.title}
            className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{item.icon}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  item.status === "Action Needed"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h2 className="mt-5 text-xl font-black">{item.title}</h2>

            <p className="mt-2 text-sm font-semibold text-gray-500">
              {item.desc}
            </p>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                Audience
              </p>
              <p className="mt-1 text-lg font-black">{item.audience}</p>
              <p className="mt-1 text-sm font-semibold text-gray-500">
                {item.count} recipients
              </p>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-full bg-black px-5 py-3 text-sm font-black text-white"
            >
              Create Notification
            </button>
          </section>
        ))}
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