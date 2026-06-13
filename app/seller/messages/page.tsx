import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerMessagesPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-gray-500 mb-6">
            Customer inquiries and support tickets.
          </p>

          <div className="grid md:grid-cols-[320px_1fr] gap-6">
            <div className="border rounded-2xl p-4">
              <h2 className="font-bold mb-4">Customer Inquiries</h2>
              <div className="p-6 text-center text-gray-500">
                No messages yet
              </div>
            </div>

            <div className="border rounded-2xl p-4 min-h-[400px]">
              <h2 className="font-bold mb-4">Conversation</h2>
              <div className="h-[280px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
                Select a message
              </div>

              <div className="flex gap-3 mt-4">
                <input
                  placeholder="Type reply..."
                  className="flex-1 border p-3 rounded-xl"
                />
                <button className="bg-black text-white px-5 py-3 rounded-xl font-bold">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}