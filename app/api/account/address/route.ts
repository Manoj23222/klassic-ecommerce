import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId)
      .select("name email role phone address city pincode address_type")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      address: user,
    });
  } catch (error) {
    console.error("Get account address error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updateData: Record<string, string> = {};

    const allowedFields = [
      "name",
      "phone",
      "address",
      "city",
      "pincode",
      "address_type",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = String(body[field]).trim();
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No data to update" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    })
      .select("name email role phone address city pincode address_type")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      user,
      address: user,
    });
  } catch (error) {
    console.error("Update account address error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}