import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    const seller = await Seller.findById(sellerId).select("-password").lean();

    return NextResponse.json({
      success: true,
      seller,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

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

    seller.store_name = body.store_name ?? seller.store_name;
    seller.store_description = body.store_description ?? seller.store_description;
    seller.support_email = body.support_email ?? seller.support_email;
    seller.support_phone = body.support_phone ?? seller.support_phone;
    seller.store_logo = body.store_logo ?? seller.store_logo;
    seller.store_banner = body.store_banner ?? seller.store_banner;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Store profile updated",
      seller,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { seller_id } = await req.json();

    await Seller.findByIdAndUpdate(seller_id, {
      store_name: "",
      store_description: "",
      support_email: "",
      support_phone: "",
      store_logo: "",
      store_banner: "",
      business_address: "",
      city: "",
      state: "",
      pincode: "",
      return_policy: "",
      shipping_policy: "",
      store_category: "",
      facebook: "",
      instagram: "",
      website: "",
    });

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json({
      success: false,
      message: "Delete failed",
    });
  }
}