import { NextResponse } from "next/server";
import db from "@/lib/db";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, otp, purpose } = await req.json();

    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanOtp = String(otp || "").trim();
    const cleanPurpose = String(purpose || "").trim();

    if (!cleanEmail || !cleanOtp || !cleanPurpose) {
      return NextResponse.json(
        { success: false, message: "Email, OTP and purpose required" },
        { status: 400 }
      );
    }

    if (!isGmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid Gmail address" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `SELECT id, otp FROM otp_verifications
       WHERE identifier = ?
       AND purpose = ?
       AND verified = 0
       AND expires_at > NOW()
       ORDER BY id DESC
       LIMIT 1`,
      [cleanEmail, cleanPurpose]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "OTP expired. Please resend OTP." },
        { status: 400 }
      );
    }

    if (String(rows[0].otp) !== cleanOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    await db.query("UPDATE otp_verifications SET verified = 1 WHERE id = ?", [
      rows[0].id,
    ]);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return NextResponse.json(
      { success: false, message: "OTP verification failed" },
      { status: 500 }
    );
  }
}