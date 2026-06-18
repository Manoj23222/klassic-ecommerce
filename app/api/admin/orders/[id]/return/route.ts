import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

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

    const order: any = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.return_status !== "Requested") {
      return NextResponse.json(
        { success: false, message: "No active return request found" },
        { status: 400 }
      );
    }

    order.return_status = body.return_status;
    order.return_action_at = new Date();
    order.refund_note = body.refund_note || "";

    if (body.return_status === "Approved") {
      order.status = "Return Approved";
      order.refund_status = "Pending";
      order.refund_amount = Number(
        body.refund_amount || order.total_amount || 0
      );
    }

    if (body.return_status === "Rejected") {
      order.status = "Return Rejected";
      order.refund_status = "Rejected";
      order.refund_amount = 0;
      order.refund_note = body.refund_note || "Return rejected by admin";
    }

    await order.save();

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