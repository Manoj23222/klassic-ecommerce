import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const [users]: any = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const cookieStore = await cookies();

    cookieStore.set("user_id", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
} 