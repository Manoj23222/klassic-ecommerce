import Header from "@/components/Header";
import SellerProductForm from "@/components/seller/SellerProductForm";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SellerAddProductPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Login
          </Link>
        </div>
      </main>
    );
  }

  const [users]: any = await db.query(
    "SELECT id, role FROM users WHERE id = ?",
    [userId]
  );

  if (!users[0] || users[0].role !== "seller") {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Seller access required</h1>
          <Link href="/become-seller" className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
            Become a Seller
          </Link>
        </div>
      </main>
    );
  }

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

          <SellerProductForm sellerId={Number(userId)} />
        </div>
      </section>
    </main>
  );
}