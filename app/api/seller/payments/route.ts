import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Category from "@/models/Category";

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
      status: { $in: ["Delivered", "Shipped", "Processing", "Pending"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    const categories = await Category.find({}).lean();

    const commissionMap = new Map(
      categories.map((cat: any) => [
        cat.name,
        Number(cat.commissionRate || 0),
      ])
    );

    const settlements = orders.map((order: any) => {
      const sellerItems = (order.items || []).filter(
        (item: any) => String(item.seller_id) === String(sellerId)
      );

      const saleAmount = sellerItems.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );

      const firstItem = sellerItems[0] || {};
      const category = firstItem.category || firstItem.product_category || "";

      const commissionRate = commissionMap.get(category) || 5;
      const commission = Math.round((saleAmount * commissionRate) / 100);
      const payout = Math.max(saleAmount - commission, 0);

      const status =
        order.status === "Delivered"
          ? "Ready For Payout"
          : "Pending Settlement";

      return {
        orderId: String(order._id),
        saleAmount,
        commissionRate,
        commission,
        payout,
        status,
        createdAt: order.createdAt,
      };
    });

    const availablePayout = settlements
      .filter((x) => x.status === "Ready For Payout")
      .reduce((sum, x) => sum + x.payout, 0);

    const pendingSettlement = settlements
      .filter((x) => x.status === "Pending Settlement")
      .reduce((sum, x) => sum + x.payout, 0);

    const totalCommission = settlements.reduce(
      (sum, x) => sum + x.commission,
      0
    );

    return NextResponse.json({
      success: true,
      availablePayout,
      pendingSettlement,
      totalCommission,
      settlements,
    });
  } catch (error: any) {
    console.error("Seller payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}