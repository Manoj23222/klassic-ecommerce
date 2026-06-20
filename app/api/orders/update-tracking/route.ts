import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

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

    const courierName = clean(body.courier_name);
    const trackingNumber = clean(body.tracking_number);
    const deliveryEstimate = clean(body.delivery_estimate);

    if (!orderId || Number.isNaN(itemIndex)) {
      return NextResponse.json(
        { success: false, message: "order_id and item_index required" },
        { status: 400 }
      );
    }

    if (!courierName || !trackingNumber) {
      return NextResponse.json(
        { success: false, message: "Courier and tracking number required" },
        { status: 400 }
      );
    }

    const order: any = await Order.findById(orderId);

    if (!order || !order.items?.[itemIndex]) {
      return NextResponse.json(
        { success: false, message: "Order item not found" },
        { status: 404 }
      );
    }

    order.items[itemIndex].courier_name = courierName;
    order.items[itemIndex].tracking_number = trackingNumber;
    order.items[itemIndex].delivery_estimate = deliveryEstimate;
    order.items[itemIndex].item_status =
      order.items[itemIndex].item_status === "Pending"
        ? "Packed"
        : order.items[itemIndex].item_status;

    order.courier_name = courierName;
    order.tracking_number = trackingNumber;
    order.delivery_estimate = deliveryEstimate;

    const statuses = order.items.map((item: any) => item.item_status || "Pending");

    if (statuses.some((s: string) => s === "Shipped")) order.status = "Shipped";
    else if (statuses.some((s: string) => s === "Packed")) order.status = "Packed";
    else if (statuses.some((s: string) => s === "Processing")) order.status = "Processing";

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Tracking updated",
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Tracking update failed" },
      { status: 500 }
    );
  }
}