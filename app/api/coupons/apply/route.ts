import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    const [rows]: any = await db.query(
      "SELECT * FROM coupons WHERE code = ? AND status = 1 LIMIT 1",
      [code.toUpperCase()]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon",
      });
    }

    const coupon = rows[0];

    let discount = 0;

    if (coupon.type === "fixed") {
      discount = Number(coupon.value);
    }

    if (coupon.type === "percent") {
      discount = Math.round((Number(subtotal) * Number(coupon.value)) / 100);
    }

    if (discount > subtotal) {
      discount = subtotal;
    }

    return NextResponse.json({
      success: true,
      discount,
      coupon,
    });
  } catch (error) {
    console.error("Coupon Error:", error);

    return NextResponse.json(
      { success: false, message: "Coupon failed" },
      { status: 500 }
    );
  }
}