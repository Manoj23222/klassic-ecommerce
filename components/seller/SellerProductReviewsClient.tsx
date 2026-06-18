"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerProductReviewsClient() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/reviews?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []));
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Product Reviews</h1>
        <p className="text-gray-500">Customer feedback on your products.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-black">{review.product_name}</h3>
                <p className="text-sm text-gray-500">{review.customer_name}</p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                {review.rating} ★
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-700">
              {review.comment || "No comment"}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm">
            No product reviews found
          </div>
        )}
      </div>
    </SellerCentralLayout>
  );
}