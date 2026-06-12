import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .select("name price stock")
    .lean();

  const csv = [
    ["ID", "Name", "Price", "Stock"],

    ...products.map((p: any) => [
      String(p._id),
      p.name || "",
      p.price || 0,
      p.stock || 0,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=products.csv",
    },
  });
}