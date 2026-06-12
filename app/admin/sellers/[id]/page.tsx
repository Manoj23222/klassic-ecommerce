import SellerStatusButtons from "@/components/admin/SellerStatusButtons";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

export default async function SellerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1 className="text-2xl font-bold">Invalid seller ID</h1>;
  }

  await connectDB();

  const seller: any = await Seller.findById(id).lean();

  if (!seller) {
    return <h1 className="text-2xl font-bold">Seller request not found</h1>;
  }

  const sellerId = String(seller._id);

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
              Seller Request #{sellerId.slice(-6)}
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
          <InfoCard label="Owner Name" value={seller.name} />
          <InfoCard label="Email" value={seller.email} />
          <InfoCard label="Phone" value={seller.phone || "N/A"} />
          <InfoCard label="Business Type" value={seller.business_type || "N/A"} />
          <InfoCard label="Category" value={seller.category || "N/A"} />
          <InfoCard label="PAN" value={seller.pan || "N/A"} />
          <InfoCard label="GST" value={seller.gst || "N/A"} />

          <div className="border rounded-xl p-4 md:col-span-2">
            <p className="text-gray-500">Address</p>
            <b>{seller.address || "N/A"}</b>
          </div>
        </div>

        <div className="mt-6">
          <SellerStatusButtons id={sellerId} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-gray-500">{label}</p>
      <b>{value}</b>
    </div>
  );
}