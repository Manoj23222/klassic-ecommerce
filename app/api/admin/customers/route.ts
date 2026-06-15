import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const users = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .select(
        "name email phone city address pincode status total_orders total_spent wishlist_count createdAt"
      )
      .lean();

    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$user_id",
          totalOrders: { $sum: 1 },
          totalSpend: { $sum: "$total_amount" },
        },
      },
    ]);

    const statsMap = new Map(
      orderStats.map((item: any) => [
        String(item._id || ""),
        {
          totalOrders: Number(item.totalOrders || 0),
          totalSpend: Number(item.totalSpend || 0),
        },
      ])
    );

    const customers = users.map((user: any) => {
      const userId = String(user._id);
      const stats = statsMap.get(userId) || {
        totalOrders: Number(user.total_orders || 0),
        totalSpend: Number(user.total_spent || 0),
      };

      return {
        id: userId,
        name: user.name || "Customer",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        pincode: user.pincode || "",
        status: user.status || "Active",
        wishlist_count: Number(user.wishlist_count || 0),
        created_at: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : "",
        totalOrders: stats.totalOrders,
        totalSpend: stats.totalSpend,
      };
    });

    return NextResponse.json({
      success: true,
      customers,
      stats: {
        totalCustomers: customers.length,
        activeCustomers: customers.filter((c) => c.status === "Active").length,
        blockedCustomers: customers.filter((c) => c.status === "Blocked").length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpend, 0),
      },
    });
  } catch (error: any) {
    console.error("CUSTOMERS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Customers fetch failed",
      },
      { status: 500 }
    );
  }
}