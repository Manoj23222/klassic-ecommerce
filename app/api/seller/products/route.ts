import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      seller_id,
      seller_store_name,
      name,
      category,
      description,
      price,
      stock,
      image,
      gallery_images,
      colors,
      sizes,
      sku,
    } = body;

    if (!seller_id || !name || !price || !stock || !image || !sku) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO products 
      (seller_id, seller_store_name, name, category, description, price, stock, image, gallery_images, colors, sizes, sku, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        seller_id,
        seller_store_name,
        name,
        category,
        description,
        price,
        stock,
        image,
        JSON.stringify(gallery_images || []),
        colors || "",
        sizes || "",
        sku,
        "Pending Approval",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product submitted for approval",
    });
  } catch (error) {
    console.error("Seller product add error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    const [products] = await db.query(
      `SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC`,
      [sellerId]
    );

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Seller products fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}