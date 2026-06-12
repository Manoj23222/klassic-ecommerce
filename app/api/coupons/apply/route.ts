import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { code, subtotal } = await request.json();

    if (!code || !subtotal) {
      return NextResponse.json({
        success: false,
        message: "Coupon code and subtotal required",
      });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const cleanSubtotal = Number(subtotal);

    const coupon = await Coupon.findOne({
      code: cleanCode,
      status: true,
    }).lean();

    if (!coupon) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon",
      });
    }

    let discount = 0;

    if (coupon.type === "fixed") {
      discount = Number(coupon.value || 0);
    }

    if (coupon.type === "percent") {
      discount = Math.round((cleanSubtotal * Number(coupon.value || 0)) / 100);
    }

    if (discount > cleanSubtotal) {
      discount = cleanSubtotal;
    }

    return NextResponse.json({
      success: true,
      discount,
      coupon,
    });
  } catch (error) {
    console.error("Coupon error:", error);

    return NextResponse.json(
      { success: false, message: "Coupon failed" },
      { status: 500 }
    );
  }
}