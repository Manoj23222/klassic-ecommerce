import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { orderId } = await request.json();

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: "Pending",
      },
      {
        status: "Cancelled",
      },
      {
        new: true,
      }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending orders can be cancelled",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error: any) {
    console.error("Cancel Order Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Cancel failed" },
      { status: 500 }
    );
  }
}