import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully",
    });
  } catch (error: any) {
    console.error("MongoDB test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB Connection Failed",
        error: error.message,
        name: error.name,
      },
      { status: 500 }
    );
  }
}