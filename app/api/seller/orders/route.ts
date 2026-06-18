import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "seller_id required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({
      "items.seller_id": sellerId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = orders.map((order: any) => {
      const sellerItems = (order.items || []).filter(
        (item: any) => String(item.seller_id) === String(sellerId)
      );

      const amount = sellerItems.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );

      return {
        _id: String(order._id),
        customer_name: order.customer_name,
        phone: order.phone,
        address: order.address,
        status: order.status,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        amount,
        items: sellerItems,
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error: any) {
    console.error("Seller orders fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}