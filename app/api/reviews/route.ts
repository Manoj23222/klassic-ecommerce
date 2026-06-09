import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID required" },
      { status: 400 }
    );
  }

  const [reviews] = await db.query(
    "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
    [productId]
  );

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const { productId, name, rating, comment } = await req.json();

  if (!productId || !name || !rating || !comment) {
    return NextResponse.json(
      { error: "All fields required" },
      { status: 400 }
    );
  }

  await db.query(
    `INSERT INTO reviews 
    (product_id, customer_name, rating, comment) 
    VALUES (?, ?, ?, ?)`,
    [productId, name, rating, comment]
  );

  return NextResponse.json({ success: true });
}