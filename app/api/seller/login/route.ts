import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const identifier = String(body.email || body.phone || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/mobile and password required" },
        { status: 400 }
      );
    }

    const seller = await Seller.findOne({
      $or: [
        { email: identifier },
        { email: { $regex: `^${identifier}$`, $options: "i" } },
        { phone: identifier },
      ],
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found. Check email/mobile." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, seller.password || "");

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
          message: `Your seller account is ${seller.status}. Admin approval required.`,
        },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("seller_id", seller._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("sellerId", seller._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.delete("user_id");

    return NextResponse.json({
      success: true,
      message: "Seller login successful",
      seller: {
        _id: seller._id.toString(),
        id: seller._id.toString(),
        name: seller.name,
        email: seller.email,
        phone: seller.phone || "",
        status: seller.status,
        store_name: seller.store_name || "",
        storeName: seller.store_name || "",
      },
    });
  } catch (error: any) {
    console.error("Seller Login Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}