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

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: "Refunded",
        payment_status: "Refunded",
        refund_status: "Completed",
        refund_amount: Number(body.refund_amount || 0),
        refund_note: body.refund_note || "Refund completed by admin",
        refunded_at: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Refund marked completed",
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Refund update failed" },
      { status: 500 }
    );
  }
}