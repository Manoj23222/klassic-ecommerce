"use client";

export default function PeaceOfMind() {
  const items = [
    {
      title: "Genuine Product",
      text: "Quality checked by Klassic",
      icon: "✅",
    },
    {
      title: "Secure Payment",
      text: "Safe and protected checkout",
      icon: "🔒",
    },
    {
      title: "Easy Returns",
      text: "Return policy available",
      icon: "↩️",
    },
    {
      title: "Warranty Support",
      text: "Seller warranty details",
      icon: "🛡️",
    },
  ];

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-black">Shop With Peace Of Mind</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-gray-50 p-3 text-center"
          >
            <div className="text-2xl">{item.icon}</div>
            <p className="mt-2 text-xs font-black">{item.title}</p>
            <p className="mt-1 text-[11px] font-semibold text-gray-500">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}