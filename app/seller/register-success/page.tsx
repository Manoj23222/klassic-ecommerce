import Link from "next/link";

export default function SellerRegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-[2rem] shadow-2xl border p-10 text-center">
          <div className="text-7xl mb-5">🎉</div>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Seller Request Submitted Successfully
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Thank you for joining Klassic Seller Hub.
            Your seller application has been received and is under review.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-extrabold">Review</h3>
              <p className="text-sm text-gray-600 mt-2">
                Admin will review your submitted details.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-extrabold">Approval</h3>
              <p className="text-sm text-gray-600 mt-2">
                Once approved, seller access will be activated.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-extrabold">Start Selling</h3>
              <p className="text-sm text-gray-600 mt-2">
                Add products, manage orders and grow your business.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-gray-50 border rounded-2xl p-6 text-left">
            <h2 className="font-extrabold text-xl mb-4">
              What Happens Next?
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>1️⃣ Admin verifies your seller details.</p>
              <p>2️⃣ Seller account gets approved.</p>
              <p>3️⃣ Login to Seller Hub.</p>
              <p>4️⃣ Complete Store Profile.</p>
              <p>5️⃣ Add Products and Start Selling.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              href="/"
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-extrabold"
            >
              Back to Home
            </Link>

            <Link
              href="/seller/login"
              className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-extrabold"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}