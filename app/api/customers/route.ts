import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const users = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .select("name email createdAt")
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
        totalOrders: 0,
        totalSpend: 0,
      };

      return {
        id: userId,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        totalOrders: stats.totalOrders,
        totalSpend: stats.totalSpend,
      };
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("CUSTOMERS API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Customers fetch failed" },
      { status: 500 }
    );
  }
}