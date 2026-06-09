import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const [users]: any = await db.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetLink = `${siteUrl}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Klassic Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Klassic Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password.</p>
        <a href="${resetLink}" style="background:#000;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Email sending failed" },
      { status: 500 }
    );
  }
}