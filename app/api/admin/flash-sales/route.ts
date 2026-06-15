import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FlashSale from "@/models/FlashSale";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const sales = await FlashSale.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      sales,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Flash sale fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.title || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { success: false, message: "Title, start date and end date required" },
        { status: 400 }
      );
    }

    const sale = await FlashSale.create({
      title: body.title,
      product_ids: Array.isArray(body.product_ids) ? body.product_ids : [],
      discount_percent: Number(body.discount_percent || 0),
      start_date: body.start_date,
      end_date: body.end_date,
      active: Boolean(body.active ?? true),
    });

    return NextResponse.json({
      success: true,
      message: "Flash sale created",
      sale,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Flash sale create failed" },
      { status: 500 }
    );
  }
}