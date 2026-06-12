import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
    password
  );
}

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

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8+ chars with uppercase, lowercase, number and special character",
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
        { success: false, message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    seller.password = await bcrypt.hash(password, 10);
    seller.reset_token = undefined;
    seller.reset_token_expiry = undefined;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Seller password updated successfully",
    });
  } catch (error) {
    console.error("Seller reset password error:", error);

    return NextResponse.json(
      { success: false, message: "Password reset failed" },
      { status: 500 }
    );
  }
}