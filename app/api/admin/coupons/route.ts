import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const coupon = await Coupon.create({
      code: String(body.code).toUpperCase(),
      title: body.title,
      description: body.description,
      type: body.type,
      value: Number(body.value),
      min_order_amount: Number(body.min_order_amount || 0),
      max_discount: Number(body.max_discount || 0),
      usage_limit: Number(body.usage_limit || 100),
      start_date: body.start_date,
      expiry_date: body.expiry_date,
      status: true,
    });

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}