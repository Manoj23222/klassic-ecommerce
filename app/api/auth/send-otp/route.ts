import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, purpose } = await req.json();

    if (!email || !purpose) {
      return NextResponse.json(
        { success: false, message: "Email and purpose required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!isGmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Only valid Gmail address allowed" },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({
      identifier: cleanEmail,
      purpose,
      verified: false,
    });

    await Otp.create({
      identifier: cleanEmail,
      otp,
      purpose,
      expires_at: expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL || process.env.EMAIL_USER,
        pass: process.env.SMTP_APP_PASSWORD || process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Klassic" <${process.env.SMTP_EMAIL || process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your Klassic OTP Code",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Klassic Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return NextResponse.json(
      { success: false, message: "OTP send failed" },
      { status: 500 }
    );
  }
}