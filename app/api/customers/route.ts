import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const [customers]: any = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        COUNT(o.id) AS totalOrders,
        IFNULL(SUM(o.total), 0) AS totalSpend
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY u.id DESC
    `);

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