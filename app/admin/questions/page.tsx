import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  await connectDB();

  const params = await searchParams;
  const status = params?.status || "All";
  const q = params?.q || "";

  const filter: any = {};

  if (status !== "All") {
    filter.status = status;
  }

  const questions = await Question.find(filter).sort({ createdAt: -1 }).lean();

  const productIds = questions.map((item: any) => item.product_id);

  const products = await Product.find({
    _id: { $in: productIds },
  })
    .select("_id name image seller_store_name")
    .lean();

  const productMap = new Map(
    products.map((p: any) => [
      String(p._id),
      {
        name: p.name,
        image: p.image,
        seller_store_name: p.seller_store_name,
      },
    ])
  );

  let safeQuestions = questions.map((item: any) => ({
    _id: String(item._id),
    product_id: item.product_id,
    customer_name: item.customer_name,
    question: item.question,
    answer: item.answer || "",
    status: item.status,
    createdAt: item.createdAt ? item.createdAt.toISOString() : "",
    product: productMap.get(String(item.product_id)) || {
      name: "Product",
      image: "/placeholder.png",
      seller_store_name: "Seller",
    },
  }));

  if (q.trim()) {
    const search = q.toLowerCase();

    safeQuestions = safeQuestions.filter(
      (item: any) =>
        item.customer_name?.toLowerCase().includes(search) ||
        item.question?.toLowerCase().includes(search) ||
        item.answer?.toLowerCase().includes(search) ||
        item.product?.name?.toLowerCase().includes(search)
    );
  }

  const total = safeQuestions.length;
  const pending = safeQuestions.filter((x: any) => x.status === "Pending").length;
  const answered = safeQuestions.filter((x: any) => x.status === "Answered").length;

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            Admin Moderation
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Product Questions Center
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Monitor customer questions, seller answers, and product support.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <StatCard title="Total Questions" value={total} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Answered" value={answered} />
        </div>

        <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm">
          <form className="grid gap-3 sm:grid-cols-[1fr_180px_120px]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search question, product, customer..."
              className="rounded-2xl border p-3 text-sm outline-none focus:border-black"
            />

            <select
              name="status"
              defaultValue={status}
              className="rounded-2xl border p-3 text-sm outline-none focus:border-black"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Answered">Answered</option>
            </select>

            <button className="rounded-2xl bg-black px-5 py-3 text-sm font-black text-white">
              Filter
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {safeQuestions.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-black">No questions found</h2>
              <p className="mt-2 text-sm text-gray-500">
                Product questions will appear here.
              </p>
            </div>
          ) : (
            safeQuestions.map((item: any) => (
              <div
                key={item._id}
                className="rounded-3xl bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    className="h-20 w-20 rounded-2xl border object-contain"
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-black">
                          {item.product?.name || "Product"}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                          Seller: {item.product?.seller_store_name || "Seller"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Asked by {item.customer_name}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.status === "Answered"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <p className="text-sm font-black">Question</p>
                      <p className="mt-2 text-sm text-gray-700">
                        {item.question}
                      </p>
                    </div>

                    <div className="mt-3 rounded-2xl border p-4">
                      <p className="text-sm font-black">Seller Answer</p>

                      {item.answer ? (
                        <p className="mt-2 text-sm text-gray-700">
                          {item.answer}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm font-bold text-orange-600">
                          Awaiting seller answer
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/product/${item.product_id}`}
                        className="rounded-full border px-4 py-2 text-xs font-black"
                      >
                        View Product
                      </Link>

                      <Link
                        href={`/admin/questions/${item._id}`}
                        className="rounded-full bg-black px-4 py-2 text-xs font-black text-white"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}