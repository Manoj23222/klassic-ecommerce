import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  const csv = [
    ["ID", "Customer", "Phone", "Amount", "Status", "Date"],

    ...orders.map((o: any) => [
      String(o._id),
      o.customer_name || "",
      o.phone || "",
      o.total_amount || 0,
      o.status || "",
      o.createdAt
        ? new Date(o.createdAt).toISOString()
        : "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        "attachment; filename=orders.csv",
    },
  });
}