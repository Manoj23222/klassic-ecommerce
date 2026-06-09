import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Admin only" },
      { status: 403 }
    );
  }

  const { orderId, status } = await req.json();

  await db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId]
  );

  return NextResponse.json({ success: true });
}