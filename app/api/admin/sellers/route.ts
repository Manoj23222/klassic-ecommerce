import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function GET() {
  try {
    await connectDB();

    const sellers = await Seller.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error("Admin Sellers Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}