import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (seller.status !== "Approved") {
      return NextResponse.json(
        {
          success: false,
          message: "Your seller account is pending admin approval",
        },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("sellerId", seller._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: "Seller login successful",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Seller Login Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}