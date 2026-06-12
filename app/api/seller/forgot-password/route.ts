import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!isGmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Enter valid seller Gmail" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findOne({ email: cleanEmail });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller account not found" },
        { status: 404 }
      );
    }

    if (seller.status !== "Approved") {
      return NextResponse.json(
        { success: false, message: "Seller account is not approved yet" },
        { status: 403 }
      );
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
        user: process.env.SMTP_EMAIL || process.env.EMAIL_USER,
        pass: process.env.SMTP_APP_PASSWORD || process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Klassic Seller Hub" <${
        process.env.SMTP_EMAIL || process.env.EMAIL_USER
      }>`,
      to: cleanEmail,
      subject: "Reset your Klassic Seller password",
      html: `
        <div style="font-family:Arial;background:#f5f7fb;padding:20px">
          <div style="max-width:600px;margin:auto;background:white;border-radius:16px;padding:24px">
            <h2>Reset your Seller Hub password</h2>
            <p>Hello ${seller.name || "Seller"},</p>
            <p>Click the button below to create a new password.</p>
            <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">
              Reset Password
            </a>
            <p style="font-size:12px;color:#64748b;margin-top:18px">
              This link is valid for 15 minutes.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to seller Gmail",
    });
  } catch (error) {
    console.error("Seller forgot password error:", error);

    return NextResponse.json(
      { success: false, message: "Reset request failed" },
      { status: 500 }
    );
  }
}