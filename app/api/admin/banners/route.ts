import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Banner fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.image) {
      return NextResponse.json(
        { success: false, message: "Banner image is required" },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      title: body.title || "",
      subtitle: body.subtitle || "",
      image: body.image,
      button_text: body.button_text || "",
      button_link: body.button_link || "",
      position: body.position || "Home Top",
      active: Boolean(body.active ?? true),
    });

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Banner create failed" },
      { status: 500 }
    );
  }
}