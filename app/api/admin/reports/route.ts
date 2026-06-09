import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const [[products]]: any = await db.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );

    const [[orders]]: any = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    const [[users]]: any = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[revenue]]: any = await db.query(
      "SELECT IFNULL(SUM(total), 0) AS totalRevenue FROM orders"
    );

    const [recentOrders]: any = await db.query(`
      SELECT id, customer_name, phone, total, status, created_at
      FROM orders
      ORDER BY id DESC
      LIMIT 10
    `);

    const [topProducts]: any = await db.query(`
      SELECT 
        p.name,
        SUM(oi.quantity) AS soldQty,
        SUM(oi.quantity * oi.price) AS revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY soldQty DESC
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: products.totalProducts,
        totalOrders: orders.totalOrders,
        totalUsers: users.totalUsers,
        totalRevenue: revenue.totalRevenue,
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