import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

function isIndianMobile(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

function isPAN(pan: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

function isGST(gst: string) {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    gst
  );
}

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
    password
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "").trim();
    const store_name = String(body.store_name || "").trim();
    const business_type = String(body.business_type || "Individual").trim();
    const category = String(body.category || "").trim();
    const pan = String(body.pan || "").trim().toUpperCase();
    const gst = String(body.gst || "").trim().toUpperCase();
    const address = String(body.address || "").trim();

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !store_name ||
      !category ||
      !pan ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, Gmail, phone, password, store name, category, PAN and address are required",
        },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!isGmail(email)) {
      return NextResponse.json(
        { success: false, message: "Only valid Gmail address allowed" },
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
      [email, "seller-register"]
    );

    if (verifiedOtp.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please verify seller Gmail OTP first" },
        { status: 400 }
      );
    }

    if (!isIndianMobile(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter valid 10 digit Indian mobile number",
        },
        { status: 400 }
      );
    }

    if (store_name.length < 3) {
      return NextResponse.json(
        { success: false, message: "Store name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!isPAN(pan)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter valid PAN number. Example: ABCDE1234F",
        },
        { status: 400 }
      );
    }

    if (gst && !isGST(gst)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter valid GST number or leave it blank",
        },
        { status: 400 }
      );
    }

    if (address.length < 10) {
      return NextResponse.json(
        { success: false, message: "Enter full pickup/store address" },
        { status: 400 }
      );
    }

    const [existing]: any = await db.query(
      "SELECT id, status FROM seller_requests WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Seller request already submitted. Status: ${existing[0].status}`,
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO seller_requests 
      (name, email, phone, password, store_name, business_type, category, pan, gst, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        hashedPassword,
        store_name,
        business_type,
        category,
        pan,
        gst || "",
        address,
      ]
    );

    await db.query(
      `DELETE FROM otp_verifications
       WHERE identifier = ?
       AND purpose = ?`,
      [email, "seller-register"]
    );

    return NextResponse.json({
      success: true,
      message: "Seller request submitted successfully",
    });
  } catch (error) {
    console.error("Seller request error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}