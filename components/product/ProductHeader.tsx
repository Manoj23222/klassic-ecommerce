"use client";

import Link from "next/link";
import RatingPopover from "@/components/product/RatingPopover";

export default function ProductHeader({
  product,
}: {
  product: any;
}) {
  const rating = Number(product?.rating || 4.3);

  const reviewCount =
    product?.reviewsCount ||
    product?.reviewCount ||
    product?.reviews?.length ||
    188566;

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      {product?.brand && (
        <Link
          href={`/brand/${encodeURIComponent(product.brand)}`}
          className="mb-2 inline-block text-sm font-bold text-blue-600 hover:underline"
        >
          Visit the {product.brand} Store
        </Link>
      )}

      <h1 className="text-xl font-black leading-tight text-gray-900 md:text-3xl">
        {product?.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <RatingPopover
          rating={rating}
          totalRatings={Number(reviewCount).toLocaleString()}
        />

        <span className="text-sm text-gray-400">|</span>

        <button className="text-sm font-semibold text-blue-600 hover:underline">
          Answered Questions
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {product?.featured && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
            Bestseller
          </span>
        )}

        {product?.flashSale && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
            Flash Sale
          </span>
        )}

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
          Assured Quality
        </span>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
          Secure Payment
        </span>
      </div>

      {product?.short_description && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="text-sm leading-6 text-gray-700">
            {product.short_description}
          </p>
        </div>
      )}
    </section>
  );
}