import CartItems from "@/components/CartItems";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-8">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 sm:text-xs">
            Checkout
          </p>

          <h1 className="mt-1 text-2xl font-black sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Review your products before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-6">
        <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-6 md:grid-cols-4">
          <MiniTrust title="Secure" text="🔒 Safe Pay" />
          <MiniTrust title="Delivery" text="🚚 Fast" />
          <MiniTrust title="Returns" text="↩ Easy" />
          <MiniTrust title="Support" text="💬 24×7" />
        </div>

        <div className="rounded-2xl bg-white p-2 shadow-sm sm:rounded-[2rem] sm:p-6">
          <CartItems />
        </div>
      </section>
    </main>
  );
}

function MiniTrust({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-5">
      <p className="text-[9px] font-black uppercase text-gray-400 sm:text-xs">
        {title}
      </p>
      <p className="mt-1 text-xs font-black sm:text-lg">{text}</p>
    </div>
  );
}