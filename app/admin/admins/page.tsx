import Link from "next/link";
import connectDB from "@/lib/mongodb";
import AdminStaff from "@/models/AdminStaff";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  await connectDB();

  const staff = await AdminStaff.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Staff & RBAC
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Admin Management
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Manage staff accounts, roles, permissions and access control.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Total Staff" value={staff.length} />
          <Stat
            title="Active"
            value={staff.filter((s: any) => s.status === "Active").length}
          />
          <Stat
            title="Suspended"
            value={staff.filter((s: any) => s.status === "Suspended").length}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/admin/settings/roles"
          className="rounded-full bg-black px-5 py-3 text-sm font-black text-white"
        >
          Roles & Permissions
        </Link>

        <Link
          href="/admin/settings/security"
          className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-black"
        >
          Security Logs
        </Link>

        <Link
          href="/admin/settings"
          className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-black"
        >
          Website Settings
        </Link>
      </div>

      {staff.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🔐</div>
          <h2 className="mt-4 text-2xl font-black">No admin staff yet</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Staff records will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {staff.map((admin: any) => (
            <article
              key={String(admin._id)}
              className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    {admin.role}
                  </p>
                  <h2 className="mt-2 text-xl font-black">{admin.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {admin.email}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {admin.phone || "No phone"}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1.5 text-xs font-black ${
                    admin.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : admin.status === "Suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {admin.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {Object.entries(admin.permissions || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className={`rounded-2xl p-3 text-center text-xs font-black capitalize ${
                      value
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/45">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}