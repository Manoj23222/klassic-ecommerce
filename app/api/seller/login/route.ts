import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password required",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT *
      FROM seller_requests
      WHERE email = ?
      LIMIT 1
      `,
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller not found",
        },
        { status: 404 }
      );
    }

    const seller = rows[0];

    if (seller.status !== "Approved") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your seller account is not approved yet",
        },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      seller.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        store_name: seller.store_name,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}