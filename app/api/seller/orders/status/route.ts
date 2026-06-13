import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const allowedStatus = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function POST(req: Request) {
  try {
    await connectDB();

    const { order_id, item_index, status } = await req.json();

    if (!order_id || !mongoose.Types.ObjectId.isValid(order_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    if (item_index === undefined || item_index === null) {
      return NextResponse.json(
        { success: false, message: "Item index required" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const order: any = await Order.findById(order_id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (!order.items[item_index]) {
      return NextResponse.json(
        { success: false, message: "Order item not found" },
        { status: 404 }
      );
    }

    order.items[item_index].item_status = status;

    const allStatuses = order.items.map((item: any) => item.item_status);

    if (allStatuses.every((s: string) => s === "Delivered")) {
      order.status = "Delivered";
    } else if (allStatuses.every((s: string) => s === "Cancelled")) {
      order.status = "Cancelled";
    } else if (allStatuses.some((s: string) => s === "Shipped")) {
      order.status = "Shipped";
    } else if (allStatuses.some((s: string) => s === "Processing")) {
      order.status = "Processing";
    } else {
      order.status = "Pending";
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order item status updated",
      order_status: order.status,
    });
  } catch (error: any) {
    console.error("Seller order status update error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}