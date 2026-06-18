import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      status: "Pending Approval",
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    const formattedProducts = products.map(
      (product: any) => ({
        ...product,
        _id: String(product._id),
      })
    );

    return NextResponse.json({
      success: true,
      total: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error: any) {
    console.error(
      "Pending products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to fetch pending products",
      },
      {
        status: 500,
      }
    );
  }
}