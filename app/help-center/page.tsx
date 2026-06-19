import Link from "next/link";
import KlassicAIButton from "@/components/KlassicAIButton";

export const dynamic = "force-dynamic";

const helpCards = [
  {
    title: "Track Order",
    desc: "Check live order status, shipment and delivery updates.",
    icon: "📦",
    href: "/account/orders",
  },
  {
    title: "Returns & Refunds",
    desc: "Request returns and check refund progress.",
    icon: "↩️",
    href: "/returns",
  },
  {
    title: "Payment Issues",
    desc: "Failed payment, refund not received or transaction help.",
    icon: "💳",
    href: "/payments",
  },
  {
    title: "Delivery Support",
    desc: "Delayed shipment or delivery related assistance.",
    icon: "🚚",
    href: "/shipping",
  },
  {
    title: "Seller Support",
    desc: "Help for sellers, payouts, products and orders.",
    icon: "🏪",
    href: "/seller/login",
  },
  {
    title: "FAQ",
    desc: "Frequently asked questions and quick answers.",
    icon: "❓",
    href: "/faq",
  },
];

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
            Klassic Support
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Help & Support Center
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Get instant support for orders, returns, refunds, delivery,
            payments, seller services and product assistance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/account/orders"
              className="rounded-full bg-white px-6 py-3 text-sm font-black text-black"
            >
              Track Order
            </Link>

            <Link
              href="/returns"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-black"
            >
              Returns Help
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {helpCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f7fb] text-3xl">
                {card.icon}
              </div>

              <h2 className="mt-5 text-xl font-black">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">
              Contact Support
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  Email Support
                </p>
                <p className="mt-2 font-bold">
                  support@klassic.com
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Response within 24 hours
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  Phone Support
                </p>
                <p className="mt-2 font-bold">
                  +91 00000 00000
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  9 AM - 8 PM
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  Live Chat
                </p>
                <p className="mt-2 font-bold">
                  Available
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Chat with Klassic Support Team
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  Resolution Rate
                </p>
                <p className="mt-2 font-bold">
                  98.6%
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Customer satisfaction score
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                AI Assistant
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Ask Klassic AI
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Get instant answers about orders, returns, refunds,
                delivery, seller services and products.
              </p>
            </div>

            <KlassicAIButton />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[2rem] bg-black p-8 text-white">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-3xl font-black">24/7</p>
              <p className="text-white/60">Support Access</p>
            </div>

            <div>
              <p className="text-3xl font-black">98%</p>
              <p className="text-white/60">Issue Resolution</p>
            </div>

            <div>
              <p className="text-3xl font-black">1M+</p>
              <p className="text-white/60">Orders Supported</p>
            </div>

            <div>
              <p className="text-3xl font-black">4.8★</p>
              <p className="text-white/60">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}