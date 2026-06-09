import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login first</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto p-10">
        <div className="bg-white p-8 rounded-2xl shadow">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>

          <Link
            href="/my-orders"
            className="inline-block mt-6 bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}