import connectDB from "@/lib/mongodb";
import WithdrawRequest from "@/models/WithdrawRequest";
import AdminWithdrawRequestsClient from "@/components/admin/AdminWithdrawRequestsClient";

export const dynamic = "force-dynamic";

export default async function AdminWithdrawRequestsPage() {
  await connectDB();

  const requests = await WithdrawRequest.find({})
    .sort({ createdAt: -1 })
    .lean();

  const cleanRequests = requests.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    seller_id: item.seller_id?.toString?.() || item.seller_id,
    createdAt: item.createdAt?.toISOString?.() || "",
    updatedAt: item.updatedAt?.toISOString?.() || "",
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <AdminWithdrawRequestsClient requests={cleanRequests} />
    </main>
  );
}