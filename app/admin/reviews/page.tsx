import DeleteReviewButton from "@/components/DeleteReviewButton";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await connectDB();

  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .lean();

  const productIds = reviews.map((review: any) => review.product_id);

  const products = await Product.find({
    _id: { $in: productIds },
  })
    .select("name")
    .lean();

  const productMap = new Map(
    products.map((product: any) => [
      String(product._id),
      product.name,
    ])
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">
        Reviews Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[900px] border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Comment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-gray-500"
                >
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review: any) => (
                <tr key={String(review._id)}>
                  <td className="p-3 border">
                    {String(review._id).slice(-6)}
                  </td>

                  <td className="p-3 border">
                    {productMap.get(review.product_id) ||
                      "Product Deleted"}
                  </td>

                  <td className="p-3 border">
                    {review.customer_name}
                  </td>

                  <td className="p-3 border">
                    {"⭐".repeat(review.rating || 0)}
                  </td>

                  <td className="p-3 border">
                    {review.comment}
                  </td>

                  <td className="p-3 border">
                    {review.status || "Approved"}
                  </td>

                  <td className="p-3 border">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3 border">
                    <DeleteReviewButton
                      id={String(review._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}