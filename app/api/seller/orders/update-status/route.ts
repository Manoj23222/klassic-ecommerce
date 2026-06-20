import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const allowedStatus = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

function clean(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const orderId = clean(body.order_id);
    const itemIndex = Number(body.item_index);
    const status = clean(body.status);

    const courierName = clean(body.courier_name);
    const trackingNumber = clean(body.tracking_number);
    const deliveryEstimate = clean(body.delivery_estimate);

    if (!orderId || Number.isNaN(itemIndex) || !status) {
      return NextResponse.json(
        { success: false, message: "order_id, item_index and status required" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const order: any = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (!order.items || !order.items[itemIndex]) {
      return NextResponse.json(
        { success: false, message: "Order item not found" },
        { status: 404 }
      );
    }

    order.items[itemIndex].item_status = status;
    order.items[itemIndex].courier_name = courierName;
    order.items[itemIndex].tracking_number = trackingNumber;
    order.items[itemIndex].delivery_estimate = deliveryEstimate;

    const itemStatuses = order.items.map((item: any) => item.item_status || "Pending");

    if (itemStatuses.every((s: string) => s === "Delivered")) {
      order.status = "Delivered";
    } else if (itemStatuses.every((s: string) => s === "Cancelled")) {
      order.status = "Cancelled";
    } else if (itemStatuses.some((s: string) => s === "Out For Delivery")) {
      order.status = "Out For Delivery";
    } else if (itemStatuses.some((s: string) => s === "Shipped")) {
      order.status = "Shipped";
    } else if (itemStatuses.some((s: string) => s === "Packed")) {
      order.status = "Packed";
    } else if (itemStatuses.some((s: string) => s === "Processing")) {
      order.status = "Processing";
    } else {
      order.status = status;
    }

    order.courier_name = courierName || order.courier_name || "";
    order.tracking_number = trackingNumber || order.tracking_number || "";
    order.delivery_estimate = deliveryEstimate || order.delivery_estimate || "";

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Shipment updated",
      order,
    });
  } catch (error: any) {
    console.error("Seller order status update error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}