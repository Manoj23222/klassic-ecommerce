import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const productIds = body.product_ids || body.productIds || [];

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product IDs required" },
        { status: 400 }
      );
    }

    const result = await Product.deleteMany({
      _id: { $in: productIds },
    });

    return NextResponse.json({
      success: true,
      message: "Products deleted successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (error: any) {
    console.error("Bulk delete error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Bulk delete failed" },
      { status: 500 }
    );
  }
}