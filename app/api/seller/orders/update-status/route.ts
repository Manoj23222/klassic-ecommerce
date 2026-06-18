import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

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

    const body = await req.json();

    const orderId = body.order_id;
    const sellerId = body.seller_id;
    const status = body.status;

    if (!orderId || !sellerId || !status) {
      return NextResponse.json(
        { success: false, message: "order_id, seller_id and status required" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const order: any = await Order.findOne({
      _id: orderId,
      "items.seller_id": sellerId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found or access denied" },
        { status: 404 }
      );
    }

    order.items = (order.items || []).map((item: any) => {
      if (String(item.seller_id) === String(sellerId)) {
        return {
          ...item.toObject?.() ?? item,
          item_status: status,
        };
      }

      return item;
    });

    const sellerItems = order.items.filter(
      (item: any) => String(item.seller_id) === String(sellerId)
    );

    const allSellerItemsSameStatus = sellerItems.every(
      (item: any) => item.item_status === status
    );

    if (allSellerItemsSameStatus) {
      order.status = status;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated",
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