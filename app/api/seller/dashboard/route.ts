import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const products = await Product.find({ seller_id: sellerId }).lean();

    const lowStockProducts = products.filter(
      (p: any) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5
    );

    const pendingProducts = products.filter(
      (p: any) => p.status === "Pending Approval"
    );

    const orders = await Order.find({
      "items.seller_id": sellerId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const sellerOrders = orders.map((order: any) => {
      const sellerItems = (order.items || []).filter(
        (item: any) => String(item.seller_id) === String(sellerId)
      );

      const sellerAmount = sellerItems.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );

      return {
        _id: String(order._id),
        customer_name: order.customer_name,
        status: order.status,
        payment_status: order.payment_status,
        amount: sellerAmount,
        items: sellerItems,
        createdAt: order.createdAt,
      };
    });

    const pendingOrders = sellerOrders.filter(
      (order: any) => order.status === "Pending" || order.status === "Processing"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = sellerOrders
      .filter((order: any) => new Date(order.createdAt) >= today)
      .reduce((sum: number, order: any) => sum + Number(order.amount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        todaySales,
        pendingOrders: pendingOrders.length,
        lowStock: lowStockProducts.length,
        pendingProducts: pendingProducts.length,
        totalProducts: products.length,
        totalOrders: sellerOrders.length,
      },
      recentOrders: sellerOrders.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 5),
    });
  } catch (error: any) {
    console.error("Seller dashboard error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}