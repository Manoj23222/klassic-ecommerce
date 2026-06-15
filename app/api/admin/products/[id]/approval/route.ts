import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    if (!["Approved", "Rejected"].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: body.status,
      approval_comment: body.approval_comment || "",
      admin_notes: body.admin_notes || "",
    };

    if (body.status === "Approved") {
      updateData.reject_reason = "";
      updateData.approved_by = "admin";
      updateData.approved_at = new Date();
      updateData.rejected_by = "";
      updateData.rejected_at = null;
    }

    if (body.status === "Rejected") {
      updateData.reject_reason = body.reject_reason || "Product rejected by admin";
      updateData.rejected_by = "admin";
      updateData.rejected_at = new Date();
      updateData.approved_by = "";
      updateData.approved_at = null;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        body.status === "Approved"
          ? "Product approved successfully"
          : "Product rejected successfully",
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}