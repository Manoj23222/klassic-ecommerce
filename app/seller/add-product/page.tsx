import Header from "@/components/Header";
import SellerProductForm from "@/components/seller/SellerProductForm";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

export default async function SellerAddProductPage() {
  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value ||
    "";

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link
            href="/seller/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Seller Login
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

  const seller: any = await Seller.findById(sellerId)
    .select("_id status")
    .lean();

  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Seller access required</h1>
          <Link
            href="/become-seller"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Become a Seller
          </Link>
        </div>
      </main>
    );
  }

  const finalSellerId = String(seller._id);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white p-5 md:p-8 rounded-2xl shadow mt-4">
          <h1 className="text-2xl md:text-3xl font-bold">Add Product</h1>
          <p className="text-gray-500 text-sm mt-1">
            Add genuine product details for Klassic customers.
          </p>

          <SellerProductForm sellerId={finalSellerId as any} />
        </div>
      </section>
    </main>
  );
}