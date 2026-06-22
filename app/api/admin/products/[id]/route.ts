import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function arr(value: any) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
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

    const updateData: any = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      sale_price:
        body.sale_price !== undefined ? Number(body.sale_price) : undefined,
      salePrice:
        body.salePrice !== undefined ? Number(body.salePrice) : undefined,
      stock: Number(body.stock),
      image: body.image,
      category: body.category,
      sku: body.sku,
      status: body.status,
      featured: body.featured,
      gallery_images: arr(body.gallery_images),
      images: arr(body.images),
      colors: arr(body.colors),
      sizes: arr(body.sizes),
      quantityOptions: arr(body.quantityOptions),
      quantities: arr(body.quantities),
      weightOptions: arr(body.weightOptions),
      quantityPrices: Array.isArray(body.quantityPrices)
  ? body.quantityPrices
  
  : [],
  showQuantityPricing:
  body.showQuantityPricing !== undefined
    ? Boolean(body.showQuantityPricing)
    : undefined,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

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
      message: "Product updated successfully",
      product,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Update failed" },
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}