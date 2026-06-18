import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function text(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function arr(value: any) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const sellerId = searchParams.get("seller_id");
    const category = searchParams.get("category");

    const query: any = {};

    if (status) query.status = status;
    if (sellerId) query.seller_id = sellerId;
    if (category) query.category = category;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Products fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const name = text(body.name);
    const price = Number(body.price || body.regularPrice || 0);
    const image = text(body.image);

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, message: "Name, price and image required" },
        { status: 400 }
      );
    }

    const sku = text(body.sku || `KL-${Date.now()}`).toUpperCase();

    const oldSku = await Product.findOne({
      $or: [{ sku }, { "variants.sku": sku }, { "color_variants.sku": sku }],
    });

    if (oldSku) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      seller_id: text(body.seller_id),
      seller_store_name: text(body.seller_store_name),

      name,
      brand: text(body.brand),
      brandVerified: Boolean(body.brandVerified),

      sku,

      short_description: text(body.short_description || body.shortDescription),
      shortDescription: text(body.shortDescription || body.short_description),
      description: text(body.description),

      category: text(body.category) || "General",
      sub_category: text(body.sub_category || body.subcategory),
      subcategory: text(body.subcategory || body.sub_category),

      category_id: text(body.category_id),
      category_slug: text(body.category_slug),
      category_path: arr(body.category_path),
      leaf_category: text(body.leaf_category),

      attributes: body.attributes || {},
      attributeMeta: Array.isArray(body.attributeMeta) ? body.attributeMeta : [],

      price,
      regularPrice: Number(body.regularPrice || price),
      salePrice: Number(body.salePrice || body.sale_price || price),
      sale_price: Number(body.sale_price || body.salePrice || price),
      costPrice: Number(body.costPrice || 0),

      stock: Number(body.stock || 0),
      lowStock: Number(body.lowStock || 0),

      image,
      images: arr(body.images),
      gallery_images: arr(body.gallery_images),
      videoUrl: text(body.videoUrl),

      colors: arr(body.colors),
      sizes: arr(body.sizes),

      variants: Array.isArray(body.variants) ? body.variants : [],
      color_variants: Array.isArray(body.color_variants)
        ? body.color_variants
        : Array.isArray(body.variants)
        ? body.variants
        : [],

      hsnCode: text(body.hsnCode),
      gst: Number(body.gst || 0),
      countryOfOrigin: text(body.countryOfOrigin) || "India",

      shipping: body.shipping || {},
      returnPolicy: body.returnPolicy || {},

      status: body.status || "Approved",

      featured: Boolean(body.featured),
      flashSale: Boolean(body.flashSale),
      discount: Number(body.discount || 0),

      seo: body.seo || {},
      features: arr(body.features),
      specifications: Array.isArray(body.specifications)
        ? body.specifications
        : [],
    });

    return NextResponse.json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Product create failed" },
      { status: 500 }
    );
  }
}