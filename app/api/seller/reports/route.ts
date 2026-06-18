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
    }).lean();

    let totalSales = 0;
    let productsSold = 0;
    const productMap: Record<string, any> = {};

    orders.forEach((order: any) => {
      const sellerItems = (order.items || []).filter(
        (item: any) => String(item.seller_id) === String(sellerId)
      );

      sellerItems.forEach((item: any) => {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const sales = qty * price;

        totalSales += sales;
        productsSold += qty;

        const name = item.product_name || "Product";

        if (!productMap[name]) {
          productMap[name] = {
            name,
            quantity: 0,
            sales: 0,
          };
        }

        productMap[name].quantity += qty;
        productMap[name].sales += sales;
      });
    });

    const totalOrders = orders.length;

    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    const topProducts = Object.values(productMap)
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      totalSales,
      totalOrders,
      productsSold,
      avgOrderValue,
      topProducts,
    });
  } catch (error: any) {
    console.error("Seller reports error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}