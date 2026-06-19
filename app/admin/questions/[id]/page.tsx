import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Product from "@/models/Product";
import AdminQuestionActions from "@/components/admin/AdminQuestionActions";

export const dynamic = "force-dynamic";

export default async function AdminQuestionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();

  const { id } = await params;

  const question: any = await Question.findById(id).lean();

  if (!question) {
    notFound();
  }

  const product: any = await Product.findById(question.product_id)
    .select("_id name image seller_store_name")
    .lean();

  const safeQuestion = {
    _id: String(question._id),
    product_id: question.product_id,
    customer_name: question.customer_name,
    question: question.question,
    answer: question.answer || "",
    status: question.status,
    createdAt: question.createdAt ? question.createdAt.toISOString() : "",
    product: product
      ? {
          _id: String(product._id),
          name: product.name,
          image: product.image,
          seller_store_name: product.seller_store_name,
        }
      : {
          _id: question.product_id,
          name: "Product",
          image: "/placeholder.png",
          seller_store_name: "Seller",
        },
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/admin/questions"
          className="mb-4 inline-block rounded-full border bg-white px-5 py-2 text-sm font-black"
        >
          ← Back
        </Link>

        <div className="rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            Question Management
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Manage Product Question
          </h1>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex gap-4">
            <img
              src={safeQuestion.product.image}
              alt={safeQuestion.product.name}
              className="h-24 w-24 rounded-2xl border object-contain"
            />

            <div>
              <h2 className="text-xl font-black">
                {safeQuestion.product.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Seller: {safeQuestion.product.seller_store_name}
              </p>

              <Link
                href={`/product/${safeQuestion.product_id}`}
                className="mt-3 inline-block rounded-full bg-black px-4 py-2 text-xs font-black text-white"
              >
                View Product
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-black uppercase text-gray-400">
              Customer
            </p>
            <p className="mt-1 font-bold">{safeQuestion.customer_name}</p>

            <p className="mt-4 text-xs font-black uppercase text-gray-400">
              Question
            </p>
            <p className="mt-1 text-sm leading-6">{safeQuestion.question}</p>
          </div>

          <AdminQuestionActions question={safeQuestion} />
        </div>
      </section>
    </main>
  );
}