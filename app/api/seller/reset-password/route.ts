import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
    password
  );
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and password required",
        },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8+ chars with uppercase, lowercase, number and special character",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT id
      FROM seller_requests
      WHERE reset_token = ?
      AND reset_token_expiry > NOW()
      LIMIT 1
      `,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset link",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
      UPDATE seller_requests
      SET password = ?,
          reset_token = NULL,
          reset_token_expiry = NULL
      WHERE id = ?
      `,
      [hashedPassword, rows[0].id]
    );

    return NextResponse.json({
      success: true,
      message: "Seller password updated successfully",
    });
  } catch (error) {
    console.error("Seller reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Password reset failed",
      },
      { status: 500 }
    );
  }
}