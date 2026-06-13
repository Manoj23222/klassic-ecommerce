import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { seller_id } = body;

    if (!seller_id || !mongoose.Types.ObjectId.isValid(seller_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(seller_id);

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    seller.gst_number = body.gst_number ?? seller.gst_number;
    seller.pan_number = body.pan_number ?? seller.pan_number;
    seller.business_name = body.business_name ?? seller.business_name;
    seller.business_address =
      body.business_address ?? seller.business_address;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "GST details updated",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}