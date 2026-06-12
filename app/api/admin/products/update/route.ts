import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      productId,
      status,
      rejection_reason,
    } = await req.json();

    if (!productId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID and status required",
        },
        { status: 400 }
      );
    }

    if (
      !["Approved", "Rejected", "Pending Approval"].includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        status,
        rejection_reason:
          status === "Rejected"
            ? rejection_reason || ""
            : "",
      },
      {
        new: true,
      }
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Product update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}