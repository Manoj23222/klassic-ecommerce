import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

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
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    if (!["Approved", "Rejected"].includes(body.return_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid return status" },
        { status: 400 }
      );
    }

    const updateData: any = {
      return_status: body.return_status,
      return_action_at: new Date(),
    };

    if (body.return_status === "Approved") {
      updateData.status = "Return Approved";
      updateData.refund_status = "Pending";
      updateData.refund_amount = Number(body.refund_amount || 0);
    }

    if (body.return_status === "Rejected") {
      updateData.status = "Return Rejected";
      updateData.refund_status = "Rejected";
      updateData.refund_note = body.refund_note || "Return rejected by admin";
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({
      success: true,
      message:
        body.return_status === "Approved"
          ? "Return approved successfully"
          : "Return rejected successfully",
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Return update failed" },
      { status: 500 }
    );
  }
}