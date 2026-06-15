import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    const allowedStatus = [
      "Pending",
      "Approved",
      "Rejected",
      "Suspended",
    ];

    if (!allowedStatus.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const seller = await Seller.findByIdAndUpdate(
      id,
      {
        status: body.status,
        approved_at:
          body.status === "Approved"
            ? new Date()
            : undefined,
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      seller,
      message: `Seller ${body.status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}