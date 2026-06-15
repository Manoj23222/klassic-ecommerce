import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import AdminBannerForm from "@/components/admin/AdminBannerForm";
import AdminBannerActions from "@/components/admin/AdminBannerActions";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  await connectDB();

  const banners = await Banner.find().sort({ createdAt: -1 }).lean();

  const total = banners.length;
  const active = banners.filter((b: any) => b.active).length;
  const inactive = total - active;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Banner Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage homepage and marketing banners.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card title="Total" value={total} />
        <Card title="Active" value={active} />
        <Card title="Inactive" value={inactive} />
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
        <AdminBannerForm />
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">All Banners</h2>

        {banners.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No banners found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {banners.map((banner: any) => (
              <div
                key={String(banner._id)}
                className="border rounded-2xl overflow-hidden bg-gray-50"
              >
                <img
                  src={banner.image}
                  alt={banner.title || "Banner"}
                  className="w-full h-48 object-cover bg-gray-200"
                />

                <div className="p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">
                        {banner.title || "Untitled Banner"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {banner.subtitle || "No subtitle"}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                        banner.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {banner.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                      {banner.position}
                    </span>

                    {banner.button_text && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">
                        {banner.button_text}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <AdminBannerActions
                      bannerId={String(banner._id)}
                      active={Boolean(banner.active)}
                    />
                  </div>
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