import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      product_id,
      status,
      reject_reason,
    } = await req.json();

    if (
      !product_id ||
      !mongoose.Types.ObjectId.isValid(product_id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product id",
        },
        { status: 400 }
      );
    }

    if (
      status !== "Approved" &&
      status !== "Rejected"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 }
      );
    }

    const product: any = await Product.findById(product_id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    product.status = status;

    if (status === "Rejected") {
      product.reject_reason =
        reject_reason || "Rejected by admin";
    } else {
      product.reject_reason = "";
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message:
        status === "Approved"
          ? "Product approved successfully"
          : "Product rejected successfully",
    });
  } catch (error: any) {
    console.error(
      "Admin product status update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}