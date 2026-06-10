import SellerStatusButtons from "@/components/admin/SellerStatusButtons";
import db from "@/lib/db";
import Link from "next/link";

export default async function SellerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows]: any = await db.query(
    "SELECT * FROM seller_requests WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return <h1 className="text-2xl font-bold">Seller request not found</h1>;
  }

  const seller = rows[0];

  return (
    <div>
      <Link
        href="/admin/sellers"
        className="inline-block mb-5 text-blue-600 font-bold"
      >
        ← Back to Seller Requests
      </Link>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {seller.store_name}
            </h1>
            <p className="text-gray-500 text-sm">
              Seller Request #{seller.id}
            </p>
          </div>

          <span
            className={`w-fit px-4 py-2 rounded-full font-bold text-sm ${
              seller.status === "Approved"
                ? "bg-green-100 text-green-700"
                : seller.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {seller.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Owner Name</p>
            <b>{seller.name}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Email</p>
            <b>{seller.email}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Phone</p>
            <b>{seller.phone}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Business Type</p>
            <b>{seller.business_type}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">Category</p>
            <b>{seller.category}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">PAN</p>
            <b>{seller.pan || "N/A"}</b>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-gray-500">GST</p>
            <b>{seller.gst || "N/A"}</b>
          </div>

          <div className="border rounded-xl p-4 md:col-span-2">
            <p className="text-gray-500">Address</p>
            <b>{seller.address}</b>
          </div>
        </div>

        <div className="mt-6">
          <SellerStatusButtons id={seller.id} />
        </div>
      </div>
    </div>
  );
}