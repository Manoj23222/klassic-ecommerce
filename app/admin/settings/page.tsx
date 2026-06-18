export const dynamic = "force-dynamic";

const settings = [
  {
    title: "Marketplace Settings",
    desc: "Control marketplace name, support email, delivery rules and store status.",
    icon: "🏬",
  },
  {
    title: "Payment Settings",
    desc: "Manage COD, online payment status, refund rules and payout settings.",
    icon: "💳",
  },
  {
    title: "Security Settings",
    desc: "Configure admin access, login security and system protection.",
    icon: "🛡️",
  },
  {
    title: "Seller Settings",
    desc: "Control seller approval, commission, verification and product publishing.",
    icon: "🧾",
  },
  {
    title: "Customer Settings",
    desc: "Manage customer registration, order limits and support policies.",
    icon: "👥",
  },
  {
    title: "SEO & Branding",
    desc: "Manage website title, meta description, logo, banner and brand colors.",
    icon: "✨",
  },
];

export default function WebsiteSettingsPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Admin Settings
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Website Settings
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Manage platform configuration, marketplace rules and security options.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((setting) => (
          <section
            key={setting.title}
            className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="text-4xl">{setting.icon}</div>

            <h2 className="mt-4 text-xl font-black">{setting.title}</h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
              {setting.desc}
            </p>

            <button
              type="button"
              className="mt-5 rounded-full border border-gray-300 px-5 py-3 text-sm font-black hover:border-black"
            >
              Configure
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}