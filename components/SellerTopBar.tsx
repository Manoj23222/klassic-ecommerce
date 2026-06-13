import Link from "next/link";

export default function SellerTopBar() {
  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link href="/seller" className="text-2xl font-extrabold text-gray-900">
        Klassic Seller
      </Link>

      <div className="flex items-center gap-3 text-sm font-bold">
        <Link href="/" className="text-gray-600 hover:text-blue-600">
          View Store
        </Link>

        <Link
          href="/seller/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          + Add Product
        </Link>
      </div>
    </div>
  );
}