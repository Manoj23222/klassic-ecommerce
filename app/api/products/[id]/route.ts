import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [rows]: any = await db.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}