import db from "@/lib/db";

export async function GET() {
  const [customers]: any = await db.query(`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY id DESC
  `);

  const csv = [
    ["ID", "Name", "Email", "Role", "Date"],
    ...customers.map((c: any) => [
      c.id,
      c.name || "",
      c.email || "",
      c.role || "",
      c.created_at || "",
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=customers.csv",
    },
  });
}