import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { query } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Query required",
        },
        { status: 400 }
      );
    }

    const search = query.trim();

    const products = await Product.find({
      status: "Approved",
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $elemMatch: {
              $regex: search,
              $options: "i",
            },
          },
        },
      ],
    })
      .limit(12)
      .lean();

    const safeProducts = products.map((product: any) => ({
      _id: String(product._id),
      name: product.name,
      image: product.image || "/placeholder.png",
      category: product.category,
      brand: product.brand,
      price:
        product.sale_price ||
        product.salePrice ||
        product.price ||
        0,
      stock: product.stock || 0,
    }));

    return NextResponse.json({
      success: true,
      count: safeProducts.length,
      products: safeProducts,
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get recommendations",
      },
      { status: 500 }
    );
  }
}