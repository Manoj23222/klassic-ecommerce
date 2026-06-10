import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      seller_id,
      name,
      description,
      price,
      stock,
      image,
      category,
      colors,
      sizes,
    } = body;

    if (!seller_id || !name || !description || !price || !stock || !image) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO products
      (seller_id, name, description, price, stock, image, category, colors, sizes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        seller_id,
        name,
        description,
        Number(price),
        Number(stock),
        image,
        category || "General",
        colors || "",
        sizes || "",
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seller product add error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}