import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password required" },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findOne({
      reset_token: token,
      reset_token_expiry: { $gt: new Date() },
    });

    if (!seller) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 400 }
      );
    }

    seller.password = await bcrypt.hash(password, 10);
    seller.reset_token = "";
    seller.reset_token_expiry = undefined;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Seller password updated successfully",
    });
  } catch (error) {
    console.error("SELLER RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}