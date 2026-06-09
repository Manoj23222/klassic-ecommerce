import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    await db.query(
      "UPDATE orders SET status = 'Cancelled' WHERE id = ? AND status = 'Pending'",
      [orderId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}