import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const [reviews] = await db.query(
    "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
    [productId]
  );

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value || null;

  const { productId, orderId, name, rating, comment } = await req.json();

  if (!productId || !name || !rating || !comment) {
    return NextResponse.json(
      { error: "All fields required" },
      { status: 400 }
    );
  }

  if (orderId && userId) {
    const [old]: any = await db.query(
      "SELECT id FROM reviews WHERE product_id = ? AND order_id = ? AND user_id = ?",
      [productId, orderId, userId]
    );

    if (old.length > 0) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 400 }
      );
    }
  }

  await db.query(
    `INSERT INTO reviews 
    (product_id, user_id, order_id, customer_name, rating, comment) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [productId, userId, orderId || null, name, rating, comment]
  );

  return NextResponse.json({ success: true });
}