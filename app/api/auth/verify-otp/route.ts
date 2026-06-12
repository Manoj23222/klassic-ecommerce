import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

export async function POST(req: Request) {
  try {
    await connectDB();

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

    const otpRecord: any = await Otp.findOne({
      identifier: cleanEmail,
      purpose: cleanPurpose,
      verified: false,
      expires_at: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP expired. Please resend OTP." },
        { status: 400 }
      );
    }

    if (String(otpRecord.otp) !== cleanOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    otpRecord.verified = true;
    await otpRecord.save();

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