import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BecomeSellerPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-yellow-300 font-bold mb-3">
              Klassic Partner Studio
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Start Selling with Klassic
            </h1>

            <p className="mt-4 text-sm md:text-lg text-gray-200">
              Grow your local business online with a simple seller application,
              fast review, and smart product tools.
            </p>

            <Link
              href="/seller/register"
              className="inline-block mt-6 bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300"
            >
              Start Seller Application
            </Link>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-4">Why Sell on Klassic?</h2>

            <div className="grid gap-3 text-sm">
              <div className="bg-white/10 p-4 rounded-xl">✅ Local seller friendly platform</div>
              <div className="bg-white/10 p-4 rounded-xl">✅ Easy product listing</div>
              <div className="bg-white/10 p-4 rounded-xl">✅ Order & inventory dashboard</div>
              <div className="bg-white/10 p-4 rounded-xl">✅ AI shopping assistant support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          3-Step Seller Launch
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold">1. Apply</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Fill seller details, store name, category and business information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold">2. Admin Review</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Klassic team checks product category, store information and trust score.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold">3. Start Listing</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Approved sellers can add products and manage orders from admin panel.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-5">Seller Conditions</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p>📌 Genuine products only</p>
            <p>📌 Clear product images required</p>
            <p>📌 No illegal or restricted items</p>
            <p>📌 Correct price and stock required</p>
            <p>📌 Seller must follow return policy</p>
            <p>📌 Fake products may suspend seller account</p>
          </div>

          <Link
            href="/seller/register"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Apply Now
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}