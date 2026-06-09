import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { stock } = await request.json();

  await db.query("UPDATE products SET stock = ? WHERE id = ?", [
    stock,
    id,
  ]);

  return NextResponse.json({ success: true });
}