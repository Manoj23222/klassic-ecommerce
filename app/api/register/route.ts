import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/db";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

function isIndianMobile(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
    password
  );
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (cleanName.length < 3) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!isGmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Only valid Gmail address allowed" },
        { status: 400 }
      );
    }

    if (!isIndianMobile(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Enter valid 10 digit Indian mobile number" },
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

   const [verifiedOtp]: any = await db.query(
  `SELECT id FROM otp_verifications
   WHERE identifier = ?
   AND purpose = ?
   AND verified = 1
   ORDER BY id DESC
   LIMIT 1`,
  [cleanEmail, "register"]
);

    if (verifiedOtp.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please verify Gmail OTP first" },
        { status: 400 }
      );
    }

    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [cleanEmail, cleanPhone]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email or mobile number already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
  "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
  [cleanName, cleanEmail, cleanPhone, hashedPassword, "customer"]
);

await db.query(
  `DELETE FROM otp_verifications
   WHERE identifier = ?
   AND purpose = ?`,
  [cleanEmail, "register"]
);
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Klassic Ecommerce" <${process.env.SMTP_EMAIL}>`,
        to: cleanEmail,
        subject: "Welcome to Klassic Ecommerce 🎉",
        html: `
          <div style="font-family:Arial;background:#f5f7fb;padding:20px">
            <div style="max-width:600px;margin:auto;background:white;border-radius:14px;padding:24px">
              <h1 style="color:#0f172a">Welcome to Klassic, ${cleanName}! 🎉</h1>

              <p>Your Klassic account has been created successfully.</p>

              <div style="background:#eff6ff;padding:16px;border-radius:12px;margin:18px 0">
                <h3>Your Account Details</h3>
                <p><b>Name:</b> ${cleanName}</p>
                <p><b>Email:</b> ${cleanEmail}</p>
                <p><b>Mobile:</b> ${cleanPhone}</p>
              </div>

              <h3>What you can do now?</h3>
              <ul>
                <li>Shop products easily</li>
                <li>Save delivery address</li>
                <li>Track your orders</li>
                <li>Add products to wishlist</li>
                <li>Apply coupons and offers</li>
                <li>Become a seller on Klassic</li>
              </ul>

              <p style="margin-top:20px">
                Thank you for joining Klassic Ecommerce.
              </p>

              <p style="font-size:12px;color:#64748b">
                If this account was not created by you, please contact Klassic support.
              </p>
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Welcome Email Error:", mailError);
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Register Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 }
    );
  }
}