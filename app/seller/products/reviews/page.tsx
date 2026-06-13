import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerProductReviewsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/seller"
          className="text-blue-600 font-semibold"
        >
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Product Reviews
              </h1>

              <p className="text-gray-500">
                Customer ratings and reviews.
              </p>
            </div>

            <button className="bg-black text-white px-5 py-3 rounded-xl font-bold">
              AI Review Summary
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Average Rating</p>
              <h2 className="text-3xl font-bold text-green-700">
                0.0
              </h2>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h2 className="text-3xl font-bold text-blue-700">
                0
              </h2>
            </div>

            <div className="bg-yellow-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">5 Star Reviews</p>
              <h2 className="text-3xl font-bold text-yellow-700">
                0
              </h2>
            </div>

            <div className="bg-purple-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Seller Replies</p>
              <h2 className="text-3xl font-bold text-purple-700">
                0
              </h2>
            </div>
          </div>

          <div className="border rounded-2xl p-10 text-center text-gray-500">
            No reviews found
          </div>
        </div>
      </section>
    </main>
  );
}