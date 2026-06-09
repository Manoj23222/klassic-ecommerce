import DeleteReviewButton from "@/components/DeleteReviewButton";
import db from "@/lib/db";

export default async function AdminReviewsPage() {
  const [reviews]: any = await db.query(`
    SELECT reviews.*, products.name AS product_name
    FROM reviews
    LEFT JOIN products ON reviews.product_id = products.id
    ORDER BY reviews.id DESC
  `);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reviews Management</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Comment</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review: any) => (
              <tr key={review.id}>
                <td className="p-3 border">{review.id}</td>
                <td className="p-3 border">{review.product_name}</td>
                <td className="p-3 border">{review.customer_name}</td>
                <td className="p-3 border">{"⭐".repeat(review.rating)}</td>
                <td className="p-3 border">{review.comment}</td>
                <td className="p-3 border">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 border">
  <DeleteReviewButton id={review.id} />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}