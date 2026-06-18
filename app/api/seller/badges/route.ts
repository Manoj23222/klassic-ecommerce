import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SellerBadge from "@/models/SellerBadge";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sellerId = searchParams.get("seller_id");

    const badges = await SellerBadge.find({
      seller_id: sellerId,
    })
      .sort({ earned_at: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      badges,
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