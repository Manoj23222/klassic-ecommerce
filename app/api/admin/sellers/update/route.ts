import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT email FROM seller_requests WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Seller request not found" },
        { status: 404 }
      );
    }

    const sellerEmail = rows[0].email;

    await db.query(
      "UPDATE seller_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    if (status === "Approved") {
      await db.query(
        "UPDATE users SET role = 'seller' WHERE email = ?",
        [sellerEmail]
      );
    }

    if (status === "Rejected") {
      await db.query(
        "UPDATE users SET role = 'customer' WHERE email = ? AND role = 'seller'",
        [sellerEmail]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seller status update error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}