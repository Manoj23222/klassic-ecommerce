import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import AdminCouponForm from "@/components/admin/AdminCouponForm";
import AdminCouponActions from "@/components/admin/AdminCouponActions";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await connectDB();

  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

  const total = coupons.length;
  const active = coupons.filter((c: any) => c.status).length;
  const inactive = total - active;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Coupon Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage offers, discounts and coupon codes.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card title="Total" value={total} />
        <Card title="Active" value={active} />
        <Card title="Inactive" value={inactive} />
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>
        <AdminCouponForm />
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">All Coupons</h2>

        {coupons.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No coupons found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {coupons.map((coupon: any) => (
              <div
                key={String(coupon._id)}
                className="border rounded-2xl p-4 bg-gray-50"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-xl">
                      {coupon.code}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {coupon.title || "No title"}
                    </p>
                  </div>

                  <span
                    className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                      coupon.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {coupon.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  {coupon.description || "No description"}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <MiniCard
                    title="Type"
                    value={coupon.type === "percent" ? "%" : "₹"}
                  />
                  <MiniCard
                    title="Value"
                    value={String(coupon.value)}
                  />
                  <MiniCard
                    title="Used"
                    value={`${coupon.used_count || 0}/${coupon.usage_limit || 0}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <MiniCard
                    title="Min Order"
                    value={`₹${Number(coupon.min_order_amount || 0).toLocaleString("en-IN")}`}
                  />
                  <MiniCard
                    title="Max Discount"
                    value={`₹${Number(coupon.max_discount || 0).toLocaleString("en-IN")}`}
                  />
                </div>

                <div className="mt-4">
                  <AdminCouponActions
                    couponId={String(coupon._id)}
                    status={Boolean(coupon.status)}
                  />
                </div>
              </div>
            ))}
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

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border rounded-xl p-2">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}