import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  if (status === "Approved") {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (status === "Suspended") {
    return "bg-gray-200 text-gray-700 border-gray-300";
  }

  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export default async function AdminSellersPage() {
  await connectDB();

  const sellersRaw = await Seller.find({}).sort({ createdAt: -1 }).lean();

  const sellers = JSON.parse(JSON.stringify(sellersRaw));

  const total = sellers.length;
  const pending = sellers.filter((s: any) => s.status === "Pending").length;
  const approved = sellers.filter((s: any) => s.status === "Approved").length;
  const rejected = sellers.filter((s: any) => s.status === "Rejected").length;
  const suspended = sellers.filter((s: any) => s.status === "Suspended").length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-gray-950 via-blue-950 to-gray-900 text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-blue-200 font-bold text-sm">
              KLASSIC ADMIN CONTROL
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
              Seller Control Center
            </h1>

            <p className="text-gray-300 mt-2">
              Approve, reject, suspend and manage marketplace sellers.
            </p>
          </div>

          <Link
            href="/become-seller"
            className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-extrabold text-center"
          >
            View Seller Landing
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat title="Total Sellers" value={total} color="text-gray-900" />
        <Stat title="Pending" value={pending} color="text-yellow-600" />
        <Stat title="Approved" value={approved} color="text-green-600" />
        <Stat title="Rejected" value={rejected} color="text-red-600" />
        <Stat title="Suspended" value={suspended} color="text-gray-600" />
      </div>

      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="p-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Seller Requests
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Seller account approval and marketplace control.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-3 py-2 rounded-full bg-yellow-50 text-yellow-700 border">
              Pending Review
            </span>
            <span className="px-3 py-2 rounded-full bg-green-50 text-green-700 border">
              Active Sellers
            </span>
            <span className="px-3 py-2 rounded-full bg-red-50 text-red-700 border">
              Rejected / Suspended
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="p-4 text-left">Seller ID</th>
                <th className="p-4 text-left">Store</th>
                <th className="p-4 text-left">Owner</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Business</th>
                <th className="p-4 text-left">PAN / GST</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Control</th>
              </tr>
            </thead>

            <tbody>
              {sellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-gray-500"
                  >
                    No seller requests yet
                  </td>
                </tr>
              ) : (
                sellers.map((seller: any) => (
                  <tr
                    key={String(seller._id)}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-bold text-gray-700">
                      #{String(seller._id).slice(-6)}
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-gray-900">
                        {seller.store_name || "Unnamed Store"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {seller.category || "No Category"}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold">{seller.name || "-"}</p>
                      <p className="text-xs text-gray-500">
                        {seller.email || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <p>{seller.phone || "-"}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {seller.address || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold">
                        {seller.business_type || "Individual"}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold">
                        PAN: {seller.pan || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        GST: {seller.gst || "Optional"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full border font-extrabold text-xs ${statusBadge(
                          seller.status
                        )}`}
                      >
                        {seller.status || "Pending"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {seller.createdAt
                        ? new Date(seller.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/admin/sellers/${seller._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold inline-block"
                      >
                        View Control
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow border p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-extrabold mt-1 ${color}`}>
        {value}
      </h2>
    </div>
  );
}