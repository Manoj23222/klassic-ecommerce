import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || 1;

    const {
      total,
      cart,
      customer_name,
      phone,
      address,
      payment_method,
      coupon_code,
      discount,
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `INSERT INTO orders
      (
        user_id,
        total_amount,
        status,
        payment_method,
        customer_name,
        phone,
        address,
        coupon_code,
        discount
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        total,
        "Pending",
        payment_method || "COD",
        customer_name,
        phone,
        address,
        coupon_code || "",
        discount || 0,
      ]
    );

    const orderId = result.insertId;

    for (const item of cart) {
      await db.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, price, quantity, color, size)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity || 1,
          item.color || "",
          item.size || "",
        ]
      );

      await db.query(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [item.quantity || 1, item.id, item.quantity || 1]
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Order failed" },
      { status: 500 }
    );
  }
}