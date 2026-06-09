import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const [products]: any = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json({ success: false });
    }

    const p = products[0];

    await db.query(
      `INSERT INTO products 
      (name, description, price, stock, image, category)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `${p.name} Copy`,
        p.description,
        p.price,
        p.stock,
        p.image,
        p.category,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}