import CartItems from "@/components/CartItems";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your products before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-gray-400">
              Secure Payment
            </p>
            <p className="mt-2 text-lg font-black">🔒 100% Safe</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-gray-400">
              Delivery
            </p>
            <p className="mt-2 text-lg font-black">🚚 Fast Shipping</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-gray-400">
              Returns
            </p>
            <p className="mt-2 text-lg font-black">↩ Easy Returns</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-gray-400">
              Support
            </p>
            <p className="mt-2 text-lg font-black">💬 24×7 Help</p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-4 shadow-lg sm:p-6">
          <CartItems />
        </div>
      </section>
    </main>
  );
}