import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SellerLevel from "@/models/SellerLevel";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sellerId = searchParams.get("seller_id");

    const level = await SellerLevel.findOne({
      seller_id: sellerId,
    }).lean();

    return NextResponse.json({
      success: true,
      level,
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