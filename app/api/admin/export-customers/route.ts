import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const customers = await User.find({})
    .sort({ createdAt: -1 })
    .select("name email role createdAt")
    .lean();

  const csv = [
    ["ID", "Name", "Email", "Role", "Date"],

    ...customers.map((c: any) => [
      String(c._id),
      c.name || "",
      c.email || "",
      c.role || "",
      c.createdAt
        ? new Date(c.createdAt).toISOString()
        : "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        "attachment; filename=customers.csv",
    },
  });
}