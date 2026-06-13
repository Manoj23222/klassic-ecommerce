import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sellerId = searchParams.get("seller_id");
    const status = searchParams.get("status");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    const query: any = {
      "items.seller_id": sellerId,
    };

    if (status) {
      query["items.item_status"] = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    const sellerOrders = orders.map((order: any) => {
      const items = order.items.filter(
        (item: any) =>
          item.seller_id === sellerId &&
          (!status || item.item_status === status)
      );

      const seller_total = items.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price) * Number(item.quantity),
        0
      );

      return {
        ...order,
        items,
        seller_total,
      };
    });

    return NextResponse.json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error: any) {
    console.error("Seller orders fetch error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}