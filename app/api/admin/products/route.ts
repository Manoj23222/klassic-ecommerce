import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      price,
      stock,
      image,
      category,
      gallery_images,
      colors,
      sizes,
    } = await request.json();

    await db.query(
      `INSERT INTO products
      (
        name,
        description,
        price,
        stock,
        image,
        category,
        gallery_images,
        colors,
        sizes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        stock,
        image,
        category,
        gallery_images,
        colors,
        sizes,
      ]
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}