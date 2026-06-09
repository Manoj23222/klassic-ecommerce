import db from "@/lib/db";

export async function GET() {
  const [products]: any = await db.query(`
    SELECT id, name, price, stock
    FROM products
    ORDER BY id DESC
  `);

  const csv = [
    ["ID", "Name", "Price", "Stock"],
    ...products.map((p: any) => [
      p.id,
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
      "Content-Disposition":
        "attachment; filename=products.csv",
    },
  });
}