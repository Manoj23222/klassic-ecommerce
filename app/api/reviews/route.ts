import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { product_id, customer_name, rating, comment } =
      await request.json();

    await db.query(
      `INSERT INTO reviews 
      (product_id, customer_name, rating, comment)
      VALUES (?, ?, ?, ?)`,
      [product_id, customer_name, rating, comment]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}