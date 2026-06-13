import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const seller: any = await Seller.findOne({
      email: cleanEmail,
    });

    if (!seller) {
      return NextResponse.json({
        success: true,
        message: "If seller email exists, reset link sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    seller.reset_token = token;
    seller.reset_token_expiry = expiry;
    await seller.save();

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const resetLink = `${siteUrl}/seller/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
        pass: process.env.EMAIL_PASS || process.env.SMTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Klassic Seller Hub" <${
        process.env.EMAIL_USER || process.env.SMTP_EMAIL
      }>`,
      to: cleanEmail,
      subject: "Reset Your Klassic Seller Password",
      html: `
        <div style="font-family:Arial;background:#f5f7fb;padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:18px;">
            <h2 style="color:#111;">Klassic Seller Password Reset</h2>
            <p>Hello ${seller.name || "Seller"},</p>
            <p>Click the button below to reset your seller account password.</p>

            <a href="${resetLink}" style="display:inline-block;background:#000;color:#fff;padding:14px 22px;text-decoration:none;border-radius:10px;font-weight:bold;">
              Reset Seller Password
            </a>

            <p style="margin-top:20px;color:#555;">
              This link will expire in 15 minutes.
            </p>

            <p style="font-size:12px;color:#777;">
              If you did not request this, you can ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Seller reset link sent to email",
    });
  } catch (error) {
    console.error("SELLER FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Email sending failed" },
      { status: 500 }
    );
  }
}