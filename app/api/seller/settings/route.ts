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

    seller.store_visibility =
      body.store_visibility ?? seller.store_visibility;

    seller.return_policy =
      body.return_policy ?? seller.return_policy;

    seller.shipping_policy =
      body.shipping_policy ?? seller.shipping_policy;

    seller.auto_approve_orders =
      body.auto_approve_orders ?? seller.auto_approve_orders;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Store settings updated",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}