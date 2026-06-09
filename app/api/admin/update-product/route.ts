import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
  id,
  name,
  description,
  price,
  stock,
  image,
  category,
  featured,
  gallery_images,
  colors,
  sizes,
} = await request.json();

    await db.query(
      `UPDATE products 
       SET name = ?, 
           description = ?, 
           price = ?, 
           stock = ?, 
           image = ?, 
           category = ?,
           featured = ?,
gallery_images = ?,
colors = ?,
sizes = ?
       WHERE id = ?`,
      [
        name,
        description,
        price,
        stock,
        image,
        category,
        featured ? 1 : 0,
gallery_images,
colors,
sizes,
id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}