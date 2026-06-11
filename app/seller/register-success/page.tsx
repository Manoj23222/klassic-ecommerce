import Link from "next/link";
import Header from "@/components/Header";

export default function SellerRegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Seller Request Submitted
          </h1>

          <p className="text-gray-600 mt-3">
            Your seller application has been sent to Klassic Admin for approval.
          </p>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-left">
            <h2 className="font-bold mb-2">Next Steps</h2>
            <p>1. Admin will review your seller details.</p>
            <p>2. After approval, you can login to Seller Hub.</p>
            <p>3. Then you can add your products.</p>
          </div>

          <Link
            href="/"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}