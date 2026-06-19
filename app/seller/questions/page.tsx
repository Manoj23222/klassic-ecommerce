import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Question from "@/models/Question";
import SellerQuestionAnswer from "@/components/seller/SellerQuestionAnswer";

export const dynamic = "force-dynamic";

export default async function SellerQuestionsPage() {
  await connectDB();

  const cookieStore = await cookies();
  const sellerId = cookieStore.get("seller_id")?.value || "";

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-black">Seller login required</h1>
          <Link
            href="/seller/login"
            className="mt-4 inline-block rounded-full bg-black px-6 py-3 text-sm font-black text-white"
          >
            Login Now
          </Link>
        </div>
      </main>
    );
  }

  const products = await Product.find({ seller_id: sellerId })
    .select("_id name image")
    .lean();

  const productIds = products.map((p: any) => String(p._id));

  const questions = await Question.find({
    product_id: { $in: productIds },
  })
    .sort({ createdAt: -1 })
    .lean();

  const productMap = new Map(
    products.map((p: any) => [
      String(p._id),
      {
        name: p.name,
        image: p.image,
      },
    ])
  );

  const safeQuestions = questions.map((q: any) => ({
    _id: String(q._id),
    product_id: q.product_id,
    customer_name: q.customer_name,
    question: q.question,
    answer: q.answer || "",
    status: q.status,
    createdAt: q.createdAt ? q.createdAt.toISOString() : "",
    product: productMap.get(String(q.product_id)) || {
      name: "Product",
      image: "/placeholder.png",
    },
  }));

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            Seller Support
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Product Questions
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Answer customer questions and improve buyer trust.
          </p>
        </div>

        <div className="space-y-4">
          {safeQuestions.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-black">No questions yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Customer questions will appear here.
              </p>
            </div>
          ) : (
            safeQuestions.map((q: any) => (
              <SellerQuestionAnswer key={q._id} question={q} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}