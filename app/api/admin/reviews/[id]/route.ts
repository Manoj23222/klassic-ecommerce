import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.query("DELETE FROM reviews WHERE id = ?", [id]);

  return NextResponse.json({ success: true });
}