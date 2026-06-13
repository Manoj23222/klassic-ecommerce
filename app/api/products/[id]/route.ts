import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const seller_id = searchParams.get("seller_id");

    if (!seller_id) {
      return NextResponse.json(
        { success: false, message: "Seller ID missing" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: id,
      seller_id,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Product load failed", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const { seller_id } = body;

    if (!seller_id) {
      return NextResponse.json(
        { success: false, message: "Seller ID missing" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: id,
      seller_id,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    product.name = body.name;
    product.description = body.description;
    product.short_description = body.short_description;
    product.price = Number(body.price);
    product.sale_price = Number(body.sale_price || 0);
    product.stock = Number(body.stock || 0);
    product.image = body.image;
    product.gallery_images = body.gallery_images || [];
    product.category = body.category;
    product.sub_category = body.sub_category;
    product.sku = body.sku;
    product.brand = body.brand;
    product.tags = body.tags;
    product.colors = body.colors;
    product.sizes = body.sizes;

    product.status = "Pending Approval";
    product.reject_reason = "";

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated and sent for approval",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Product update failed", error },
      { status: 500 }
    );
  }
}