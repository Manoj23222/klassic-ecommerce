export const dynamic = "force-dynamic";

export default function ShippingSettingsPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Admin Settings
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Shipping Settings
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Manage delivery charges, free shipping rules, COD and return delivery policy.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingCard
          title="Free Shipping Rule"
          desc="Enable free shipping above selected cart amount."
          value="₹5000"
        />

        <SettingCard
          title="Default Shipping Charge"
          desc="Basic shipping charge for normal orders."
          value="₹49"
        />

        <SettingCard
          title="COD Availability"
          desc="Allow cash on delivery for eligible products."
          value="Enabled"
        />

        <SettingCard
          title="Return Pickup"
          desc="Customer return pickup after admin approval."
          value="Enabled"
        />
      </div>
    </main>
  );
}

function SettingCard({
  title,
  desc,
  value,
}: {
  title: string;
  desc: string;
  value: string;
}) {
  return (
    <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-black">{value}</h2>

      <p className="mt-2 text-sm font-semibold text-gray-500">
        {desc}
      </p>

      <button className="mt-5 rounded-full border border-gray-300 px-5 py-3 text-sm font-black hover:border-black">
        Configure
      </button>
    </section>
  );
}