import SellerStatusButtons from "@/components/admin/SellerStatusButtons";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

function statusClass(status: string) {
  if (status === "Approved") return "bg-green-100 text-green-700 border-green-200";
  if (status === "Rejected") return "bg-red-100 text-red-700 border-red-200";
  if (status === "Suspended") return "bg-gray-200 text-gray-700 border-gray-300";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

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

  const sellerRaw: any = await Seller.findById(id).lean();

  if (!sellerRaw) {
    return <h1 className="text-2xl font-bold">Seller request not found</h1>;
  }

  const seller = JSON.parse(JSON.stringify(sellerRaw));
  const sellerId = String(seller._id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/sellers"
        className="inline-block text-blue-600 font-bold"
      >
        ← Back to Seller Control Center
      </Link>

      <div className="rounded-3xl bg-gradient-to-r from-gray-950 via-blue-950 to-gray-900 text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-blue-200 font-bold text-sm">
              SELLER PROFILE CONTROL
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
              {seller.store_name || "Unnamed Store"}
            </h1>

            <p className="text-gray-300 mt-2">
              Seller Request #{sellerId.slice(-6)}
            </p>
          </div>

          <span
            className={`w-fit px-5 py-2 rounded-full border font-extrabold text-sm ${statusClass(
              seller.status
            )}`}
          >
            {seller.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-extrabold mb-5">
              Seller Identity
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Info label="Owner Name" value={seller.name || "N/A"} />
              <Info label="Email" value={seller.email || "N/A"} />
              <Info label="Phone" value={seller.phone || "N/A"} />
              <Info label="Business Type" value={seller.business_type || "Individual"} />
              <Info label="Product Category" value={seller.category || "N/A"} />
              <Info label="Store Name" value={seller.store_name || "N/A"} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-extrabold mb-5">
              KYC / Business Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Info label="PAN Number" value={seller.pan || "N/A"} />
              <Info label="GST Number" value={seller.gst || "Optional / Not Added"} />
              <Info label="Seller Status" value={seller.status || "Pending"} />
              <Info
                label="Joined Date"
                value={
                  seller.createdAt
                    ? new Date(seller.createdAt).toLocaleDateString("en-IN")
                    : "N/A"
                }
              />

              <div className="border rounded-2xl p-4 md:col-span-2 bg-gray-50">
                <p className="text-gray-500 text-sm">Pickup / Store Address</p>
                <p className="font-bold mt-1">
                  {seller.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-extrabold mb-5">
              Admin Notes
            </h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-gray-700">
              Check seller PAN, store name, category, phone and pickup address
              before approval. Suspended sellers should not access Seller Hub.
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-3xl shadow border p-6 h-fit lg:sticky lg:top-6">
          <h2 className="text-2xl font-extrabold mb-2">
            Seller Control
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            Approve, reject or suspend this seller account.
          </p>

          <SellerStatusButtons id={sellerId} />

          <div className="mt-6 border-t pt-5 space-y-3 text-sm">
            <ControlInfo title="Approved" text="Seller can login and sell products." />
            <ControlInfo title="Rejected" text="Seller request will be declined." />
            <ControlInfo title="Suspended" text="Seller access will be blocked." />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-2xl p-4 bg-gray-50">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-extrabold mt-1 break-words">{value}</p>
    </div>
  );
}

function ControlInfo({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border">
      <p className="font-extrabold">{title}</p>
      <p className="text-gray-600 mt-1">{text}</p>
    </div>
  );
}