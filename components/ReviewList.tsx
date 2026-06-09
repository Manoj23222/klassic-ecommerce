type Review = {
  id: number;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

async function getReviews(productId: number): Promise<Review[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/reviews?productId=${productId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function ReviewList({ productId }: { productId: number }) {
  const reviews = await getReviews(productId);

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{review.name}</h3>
                <span className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>

              <p className="text-gray-700 mt-2">{review.comment}</p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}