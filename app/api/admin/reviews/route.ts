import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const [reviews]: any = await db.query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS user_name,
        u.email AS user_email,
        p.name AS product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.id DESC
    `);

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("ADMIN REVIEWS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Reviews fetch failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Review id required" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM reviews WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Review delete failed" },
      { status: 500 }
    );
  }
}