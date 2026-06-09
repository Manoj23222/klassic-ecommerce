import Header from "@/components/Header";
import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <div className="text-6xl mb-4">✅</div>

          <h1 className="text-4xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          <p className="mt-4 text-gray-600">
            Thank you for shopping with Klassic.
          </p>

          {orderId && (
            <p className="mt-4 text-xl font-bold">
              Order ID: #{orderId}
            </p>
          )}

          <div className="flex gap-4 mt-8 justify-center">
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              Continue Shopping
            </Link>

            <Link
              href="/my-orders"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}