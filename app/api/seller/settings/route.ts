import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

function text(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "seller_id required" },
        { status: 400 }
      );
    }

    const seller = await Seller.findById(sellerId).select("-password").lean();

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      seller,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const sellerId = text(body.seller_id);

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "seller_id required" },
        { status: 400 }
      );
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      {
        store_name: text(body.store_name),
        store_description: text(body.store_description),
        store_logo: text(body.store_logo),
        store_banner: text(body.store_banner),

        gst_number: text(body.gst_number),
        pan_number: text(body.pan_number),
        business_name: text(body.business_name),
        business_address: text(body.business_address),

        account_holder: text(body.account_holder),
        bank_name: text(body.bank_name),
        account_number: text(body.account_number),
        ifsc: text(body.ifsc),
        upi_id: text(body.upi_id),

        return_policy: text(body.return_policy),
        shipping_policy: text(body.shipping_policy),
        store_visibility: body.store_visibility === "Private" ? "Private" : "Public",

        support_email: text(body.support_email),
        support_phone: text(body.support_phone),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Settings updated",
      seller,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}