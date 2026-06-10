import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      store_name,
      business_type,
      category,
      pan,
      gst,
      address,
    } = body;

    if (!name || !email || !phone || !store_name || !category || !address) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO seller_requests 
      (name, email, phone, store_name, business_type, category, pan, gst, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        store_name,
        business_type || "",
        category,
        pan || "",
        gst || "",
        address,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Seller request submitted successfully",
    });
  } catch (error) {
    console.error("Seller request error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}