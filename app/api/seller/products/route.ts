import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function toArray(value: any) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function cleanText(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null) return "";
  return String(value);
}

function cleanSku(value: any) {
  return String(value || `KL-${Date.now()}`).trim().toUpperCase();
}

function cleanVariants(body: any) {
  const rawVariants = Array.isArray(body.variants)
    ? body.variants
    : Array.isArray(body.color_variants)
    ? body.color_variants
    : [];

  return rawVariants.map((v: any, index: number) => {
    const sku = cleanSku(v.sku || `${body.sku || "KL"}-V${index + 1}`);

    const images = Array.isArray(v.images)
      ? v.images.filter(Boolean)
      : v.image
      ? [v.image]
      : [];

    return {
      colorName: v.colorName || v.color || "",
      colorCode: v.colorCode || "#000000",
      color: v.color || v.colorName || "",
      size: v.size || "",
      material: v.material || "",

      sku,

      price: Number(v.price || body.price || body.regularPrice || 0),
      sale_price: Number(
        v.sale_price || v.salePrice || body.sale_price || body.salePrice || 0
      ),
      salePrice: Number(
        v.salePrice || v.sale_price || body.salePrice || body.sale_price || 0
      ),
      regularPrice: Number(v.regularPrice || body.regularPrice || body.price || 0),

      stock: Number(v.stock || 0),
      lowStock: Number(v.lowStock || 0),

      image: v.image || images[0] || "",
      images,

      isDefault: index === 0 ? true : Boolean(v.isDefault),
      status: v.status || "Active",
    };
  });
}

async function checkDuplicateSku({
  sku,
  productId,
}: {
  sku: string;
  productId?: string;
}) {
  const query: any = {
    $or: [{ sku }, { "variants.sku": sku }, { "color_variants.sku": sku }],
  };

  if (productId) {
    query._id = { $ne: productId };
  }

  return await Product.findOne(query).lean();
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const name = cleanText(body.name).trim();
    const sku = cleanSku(body.sku);
    const price = Number(body.price || body.regularPrice || body.salePrice || 0);
    const image = cleanText(body.image);
    const stock = Number(body.stock || 0);

    if (!name || !price || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, price and image required",
        },
        { status: 400 }
      );
    }

    const duplicateSku = await checkDuplicateSku({ sku });

    if (duplicateSku) {
      return NextResponse.json(
        {
          success: false,
          message: "SKU already exists",
        },
        { status: 400 }
      );
    }

    const variants = cleanVariants({ ...body, sku });

    for (const variant of variants) {
      const duplicateVariantSku = await checkDuplicateSku({
        sku: variant.sku,
      });

      if (duplicateVariantSku) {
        return NextResponse.json(
          {
            success: false,
            message: `Variant SKU already exists: ${variant.sku}`,
          },
          { status: 400 }
        );
      }
    }

    const product = await Product.create({
      seller_id: cleanText(body.seller_id),
      seller_store_name: cleanText(body.seller_store_name) || "Klassic Seller",

      name,
      short_description:
        cleanText(body.short_description) || cleanText(body.shortDescription),
      shortDescription:
        cleanText(body.shortDescription) || cleanText(body.short_description),
      description:
        cleanText(body.description) ||
        cleanText(body.shortDescription) ||
        cleanText(body.short_description),

      brand: cleanText(body.brand),
      brandVerified: Boolean(body.brandVerified),

      tags: toArray(body.tags),

      sku,

      category: cleanText(body.category) || "General",
      sub_category: cleanText(body.sub_category) || cleanText(body.subcategory),
      subcategory: cleanText(body.subcategory) || cleanText(body.sub_category),

      category_id: cleanText(body.category_id),
      category_slug: cleanText(body.category_slug),
      category_path: toArray(body.category_path),
      leaf_category: cleanText(body.leaf_category),

      attributes: body.attributes || {},

attributeMeta: Array.isArray(body.attributeMeta)
  ? body.attributeMeta
  : [],

      price,
      regularPrice: Number(body.regularPrice || body.price || price),
      salePrice: Number(body.salePrice || body.sale_price || price),
      sale_price: Number(body.sale_price || body.salePrice || price),
      costPrice: Number(body.costPrice || 0),

      stock,
      lowStock: Number(body.lowStock || 0),
      stockStatus: stock > 0 ? "In Stock" : "Out of Stock",

      hsnCode: cleanText(body.hsnCode),
      gst: Number(body.gst || 0),
      countryOfOrigin: cleanText(body.countryOfOrigin) || "India",

      image,
      images: toArray(body.images),
      gallery_images: toArray(body.gallery_images),
      videoUrl: cleanText(body.videoUrl),

      colors: toArray(body.colors),
sizes: toArray(body.sizes),

quantityOptions: toArray(body.quantityOptions),

quantityPrices: Array.isArray(body.quantityPrices)
  ? body.quantityPrices
  : [],

material: cleanText(body.material),

      variants,
      color_variants: variants,

      specifications: Array.isArray(body.specifications)
        ? body.specifications
        : [],

      shipping: body.shipping || {},

      returnPolicy: body.returnPolicy || {},

      status: body.status || "Pending Approval",

      featured: Boolean(body.featured),
      flashSale: Boolean(body.flashSale),
      discount: Number(body.discount || 0),

      seo: body.seo || {},
      features: toArray(body.features),

      reject_reason: "",
      approval_comment: "",
      admin_notes: "",
    });

    return NextResponse.json({
      success: true,
      message: "Product submitted for approval",
      product,
    });
  } catch (error: any) {
    console.error("Seller product add error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sellerId = searchParams.get("seller_id");
    const status = searchParams.get("status");
    const stock = searchParams.get("stock");

    const query: any = {};

    if (sellerId) query.seller_id = sellerId;
    if (status) query.status = status;

    if (stock === "out") query.stock = { $lte: 0 };
    if (stock === "low") query.stock = { $gt: 0, $lte: 5 };

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("Seller products fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const productId = cleanText(body.product_id);
    const sellerId = cleanText(body.seller_id);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const query: any = { _id: productId };
    if (sellerId) query.seller_id = sellerId;

    const product: any = await Product.findOne(query);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found or access denied",
        },
        { status: 404 }
      );
    }

    if (body.sku) {
      const sku = cleanSku(body.sku);

      const duplicateSku = await checkDuplicateSku({
        sku,
        productId,
      });

      if (duplicateSku) {
        return NextResponse.json(
          {
            success: false,
            message: "SKU already exists",
          },
          { status: 400 }
        );
      }

      product.sku = sku;
    }

    const variants =
      Array.isArray(body.variants) || Array.isArray(body.color_variants)
        ? cleanVariants({ ...body, sku: product.sku })
        : null;

    if (variants) {
      for (const variant of variants) {
        const duplicateVariantSku = await checkDuplicateSku({
          sku: variant.sku,
          productId,
        });

        if (duplicateVariantSku) {
          return NextResponse.json(
            {
              success: false,
              message: `Variant SKU already exists: ${variant.sku}`,
            },
            { status: 400 }
          );
        }
      }

      product.variants = variants;
      product.color_variants = variants;
    }

    product.name = body.name !== undefined ? cleanText(body.name) : product.name;
    product.category =
      body.category !== undefined ? cleanText(body.category) : product.category;

    product.sub_category =
      body.sub_category !== undefined || body.subcategory !== undefined
        ? cleanText(body.sub_category) || cleanText(body.subcategory)
        : product.sub_category;

    product.subcategory =
      body.subcategory !== undefined || body.sub_category !== undefined
        ? cleanText(body.subcategory) || cleanText(body.sub_category)
        : product.subcategory;

    product.category_id =
      body.category_id !== undefined
        ? cleanText(body.category_id)
        : product.category_id;

    product.category_slug =
      body.category_slug !== undefined
        ? cleanText(body.category_slug)
        : product.category_slug;

    product.category_path =
      body.category_path !== undefined
        ? toArray(body.category_path)
        : product.category_path;

    product.leaf_category =
      body.leaf_category !== undefined
        ? cleanText(body.leaf_category)
        : product.leaf_category;

    product.attributes =
  body.attributes !== undefined
    ? body.attributes
    : product.attributes;

product.attributeMeta =
  body.attributeMeta !== undefined
    ? body.attributeMeta
    : product.attributeMeta;

    product.short_description =
      body.short_description !== undefined || body.shortDescription !== undefined
        ? cleanText(body.short_description) || cleanText(body.shortDescription)
        : product.short_description;

    product.shortDescription =
      body.shortDescription !== undefined || body.short_description !== undefined
        ? cleanText(body.shortDescription) || cleanText(body.short_description)
        : product.shortDescription;

    product.description =
      body.description !== undefined
        ? cleanText(body.description)
        : product.description;

    product.brand =
      body.brand !== undefined ? cleanText(body.brand) : product.brand;

    product.brandVerified =
      body.brandVerified !== undefined
        ? Boolean(body.brandVerified)
        : product.brandVerified;

    product.tags = body.tags !== undefined ? toArray(body.tags) : product.tags;

    product.price =
      body.price !== undefined
        ? Number(body.price)
        : body.regularPrice !== undefined
        ? Number(body.regularPrice)
        : product.price;

    product.regularPrice =
      body.regularPrice !== undefined
        ? Number(body.regularPrice)
        : product.regularPrice;

    product.salePrice =
      body.salePrice !== undefined
        ? Number(body.salePrice)
        : body.sale_price !== undefined
        ? Number(body.sale_price)
        : product.salePrice;

    product.sale_price =
      body.sale_price !== undefined
        ? Number(body.sale_price)
        : body.salePrice !== undefined
        ? Number(body.salePrice)
        : product.sale_price;

    product.costPrice =
      body.costPrice !== undefined ? Number(body.costPrice) : product.costPrice;

    product.stock =
      body.stock !== undefined ? Number(body.stock) : product.stock;

    product.lowStock =
      body.lowStock !== undefined ? Number(body.lowStock) : product.lowStock;

    product.stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";

    product.hsnCode =
      body.hsnCode !== undefined ? cleanText(body.hsnCode) : product.hsnCode;

    product.gst = body.gst !== undefined ? Number(body.gst) : product.gst;

    product.countryOfOrigin =
      body.countryOfOrigin !== undefined
        ? cleanText(body.countryOfOrigin)
        : product.countryOfOrigin;

    product.image =
      body.image !== undefined ? cleanText(body.image) : product.image;

    product.images =
      body.images !== undefined ? toArray(body.images) : product.images;

    product.gallery_images =
      body.gallery_images !== undefined
        ? toArray(body.gallery_images)
        : product.gallery_images;

    product.colors =
      body.colors !== undefined ? toArray(body.colors) : product.colors;

    product.sizes =
      body.sizes !== undefined ? toArray(body.sizes) : product.sizes;
      product.quantityOptions =
  body.quantityOptions !== undefined
    ? toArray(body.quantityOptions)
    : product.quantityOptions;

product.quantityPrices =
  body.quantityPrices !== undefined && Array.isArray(body.quantityPrices)
    ? body.quantityPrices
    : product.quantityPrices;

    product.material =
      body.material !== undefined ? cleanText(body.material) : product.material;

    product.weight =
      body.weight !== undefined ? cleanText(body.weight) : product.weight;

    product.videoUrl =
      body.videoUrl !== undefined ? cleanText(body.videoUrl) : product.videoUrl;

    product.specifications = Array.isArray(body.specifications)
      ? body.specifications
      : product.specifications;

    product.shipping =
      body.shipping !== undefined ? body.shipping : product.shipping;

    product.returnPolicy =
      body.returnPolicy !== undefined ? body.returnPolicy : product.returnPolicy;

    product.seo = body.seo !== undefined ? body.seo : product.seo;

    product.features =
      body.features !== undefined ? toArray(body.features) : product.features;

    product.featured =
      body.featured !== undefined ? Boolean(body.featured) : product.featured;

    product.flashSale =
      body.flashSale !== undefined ? Boolean(body.flashSale) : product.flashSale;

    product.discount =
      body.discount !== undefined ? Number(body.discount) : product.discount;

    product.status = "Pending Approval";
    product.reject_reason = "";

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated and sent for approval",
      product,
    });
  } catch (error: any) {
    console.error("Seller product update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}