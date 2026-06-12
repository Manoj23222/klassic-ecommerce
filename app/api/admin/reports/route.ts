import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const [totalProducts, totalOrders, totalUsers, revenueAgg, recentOrdersRaw, topProductsRaw] =
      await Promise.all([
        Product.countDocuments({}),
        Order.countDocuments({}),
        User.countDocuments({ role: "customer" }),

        Order.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total_amount" },
            },
          },
        ]),

        Order.find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .select("customer_name phone total_amount status createdAt")
          .lean(),

        Order.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.product_name",
              soldQty: { $sum: "$items.quantity" },
              revenue: {
                $sum: {
                  $multiply: ["$items.quantity", "$items.price"],
                },
              },
            },
          },
          { $sort: { soldQty: -1 } },
          { $limit: 5 },
        ]),
      ]);

    const recentOrders = recentOrdersRaw.map((order: any) => ({
      id: String(order._id),
      customer_name: order.customer_name,
      phone: order.phone,
      total: order.total_amount,
      status: order.status,
      created_at: order.createdAt,
    }));

    const topProducts = topProductsRaw.map((product: any) => ({
      name: product._id || "Unknown Product",
      soldQty: product.soldQty || 0,
      revenue: product.revenue || 0,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Number(revenueAgg[0]?.totalRevenue || 0),
      },
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("ADMIN REPORTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Reports fetch failed" },
      { status: 500 }
    );
  }
}