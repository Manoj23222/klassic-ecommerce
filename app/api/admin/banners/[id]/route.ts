import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid banner ID" },
        { status: 400 }
      );
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        button_text: body.button_text,
        button_link: body.button_link,
        position: body.position,
        active: body.active,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Banner update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid banner ID" },
        { status: 400 }
      );
    }

    await Banner.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Banner delete failed" },
      { status: 500 }
    );
  }
}