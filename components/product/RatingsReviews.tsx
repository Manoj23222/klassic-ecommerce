"use client";

import RatingPopover from "@/components/product/RatingPopover";

export default function RatingsReviews({
  product,
}: {
  product: any;
}) {
  const rating = Number(product?.rating || 4.3);
  const totalRatings = product?.reviewsCount || 188566;

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Ratings & Reviews</h2>
        <button className="rounded-xl border px-4 py-2 text-sm font-black text-blue-600">
          Rate Product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-4xl font-black text-green-700">
            {rating.toFixed(1)} ★
          </p>
          <p className="mt-1 text-xs font-semibold text-gray-600">
            {Number(totalRatings).toLocaleString()} ratings
          </p>
          <div className="mt-3">
            <RatingPopover
              rating={rating}
              totalRatings={Number(totalRatings).toLocaleString()}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Review
            name="Verified Buyer"
            rating="5"
            text="Product quality is good and delivery was fast."
          />
          <Review
            name="Klassic Customer"
            rating="4"
            text="Nice product at this price range."
          />
        </div>
      </div>
    </section>
  );
}

function Review({
  name,
  rating,
  text,
}: {
  name: string;
  rating: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center gap-2">
        <span className="rounded bg-green-600 px-2 py-1 text-xs font-black text-white">
          {rating} ★
        </span>
        <p className="text-sm font-black">{name}</p>
      </div>
      <p className="mt-2 text-sm text-gray-700">{text}</p>
    </div>
  );
}