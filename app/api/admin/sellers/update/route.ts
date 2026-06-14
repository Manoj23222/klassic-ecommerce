import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

const allowedStatus = [
  "Pending",
  "Approved",
  "Rejected",
  "Suspended",
];

async function updateSellerStatus(req: Request) {
  try {
    await connectDB();

    const { id, sellerId, status } = await req.json();
    const finalSellerId = sellerId || id;

    if (!finalSellerId || !mongoose.Types.ObjectId.isValid(finalSellerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const seller = await Seller.findByIdAndUpdate(
      finalSellerId,
      { status },
      { new: true }
    ).select("-password");

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seller status updated",
      seller,
    });
  } catch (error) {
    console.error("Seller update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update seller" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return updateSellerStatus(req);
}

export async function PATCH(req: Request) {
  return updateSellerStatus(req);
}