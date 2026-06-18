import connectDB from "@/lib/mongodb";
import AdminStaff from "@/models/AdminStaff";

export const dynamic = "force-dynamic";

const modules = [
  "dashboard",
  "products",
  "orders",
  "sellers",
  "customers",
  "finance",
  "marketing",
  "settings",
  "staff",
];

const roles = [
  {
    name: "Super Admin",
    access: "Full Access",
    desc: "Complete control over all modules and settings.",
  },
  {
    name: "Admin",
    access: "High Access",
    desc: "Can manage core marketplace operations.",
  },
  {
    name: "Manager",
    access: "Medium Access",
    desc: "Can manage orders, products and seller operations.",
  },
  {
    name: "Support",
    access: "Support Access",
    desc: "Can manage customers, tickets and order support.",
  },
  {
    name: "Finance",
    access: "Finance Access",
    desc: "Can manage payouts, refunds and settlements.",
  },
  {
    name: "Inventory",
    access: "Inventory Access",
    desc: "Can manage stock, low stock alerts and products.",
  },
];

export default async function RolesPage() {
  await connectDB();

  const staff = await AdminStaff.find().lean();

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Staff & RBAC
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Roles & Permissions
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          View admin roles, access levels and marketplace module permissions.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {roles.map((role) => {
          const count = staff.filter((s: any) => s.role === role.name).length;

          return (
            <article
              key={role.name}
              className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    {role.access}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">{role.name}</h2>

                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    {role.desc}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-black px-3 py-1.5 text-xs font-black text-white">
                  {count} Staff
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {modules.map((module) => (
                  <div
                    key={module}
                    className="rounded-2xl bg-gray-100 p-3 text-center text-xs font-black capitalize text-gray-700"
                  >
                    {module}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}