import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { stock } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const stockValue = Number(stock);

    if (isNaN(stockValue) || stockValue < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid stock value",
        },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stock: stockValue },
      { new: true }
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
      message: "Stock updated successfully",
      stock: product.stock,
    });
  } catch (error) {
    console.error("Inventory update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}