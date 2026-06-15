import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerAISalesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-3 md:p-6">
      <div className="rounded-3xl bg-white p-6 shadow">
        <p className="text-sm font-black text-orange-600">KLASSIC AI</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          AI Sales Prediction
        </h1>
        <p className="mt-2 text-slate-500">
          Seller sales prediction dashboard coming soon.
        </p>

        <Link
          href="/seller"
          className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-black text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}