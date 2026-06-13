import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { seller_id, currentPassword, newPassword } = await req.json();

    if (!seller_id || !mongoose.Types.ObjectId.isValid(seller_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Password fields required" },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const seller = await Seller.findById(seller_id);

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, seller.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is wrong" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    seller.password = hashedPassword;
    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Seller change password error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}