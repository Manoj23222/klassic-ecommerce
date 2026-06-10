import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE seller_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seller status update error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}