import db from "@/lib/db";

export async function GET() {
  const [orders]: any = await db.query(`
    SELECT id, customer_name, phone, total_amount, status, created_at
    FROM orders
    ORDER BY id DESC
  `);

  const csv = [
    ["ID", "Customer", "Phone", "Amount", "Status", "Date"],
    ...orders.map((o: any) => [
      o.id,
      o.customer_name || "",
      o.phone || "",
      o.total_amount || 0,
      o.status || "",
      o.created_at || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
}