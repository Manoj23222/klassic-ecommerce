import { NextResponse } from "next/server";
import Papa from "papaparse";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function clean(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function num(value: any) {
  return Number(value || 0);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const sellerId = clean(formData.get("seller_id"));
    const sellerStoreName = clean(formData.get("seller_store_name")) || "Klassic Seller";
    const file = formData.get("file") as File | null;

    if (!sellerId || !file) {
      return NextResponse.json(
        { success: false, message: "seller_id and file required" },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { success: false, message: parsed.errors[0].message },
        { status: 400 }
      );
    }

    const rows = parsed.data as any[];

    const created: any[] = [];
    const failed: any[] = [];

    for (const row of rows) {
      try {
        const name = clean(row.name);
        const sku = clean(row.sku).toUpperCase();
        const image = clean(row.image);
        const price = num(row.price);

        if (!name || !sku || !price || !image) {
          failed.push({
            sku,
            name,
            reason: "name, sku, price and image required",
          });
          continue;
        }

        const exists = await Product.findOne({ sku });

        if (exists) {
          failed.push({
            sku,
            name,
            reason: "SKU already exists",
          });
          continue;
        }

        const product = await Product.create({
          seller_id: sellerId,
          seller_store_name: sellerStoreName,

          name,
          brand: clean(row.brand),
          sku,

          category: clean(row.category) || "General",
          sub_category: clean(row.sub_category),
          subcategory: clean(row.sub_category),
          leaf_category: clean(row.leaf_category),

          description: clean(row.description),
          short_description: clean(row.short_description),
          shortDescription: clean(row.short_description),

          price,
          regularPrice: num(row.regularPrice || row.price),
          sale_price: num(row.sale_price || row.price),
          salePrice: num(row.sale_price || row.price),
          stock: num(row.stock),
          stockStatus: num(row.stock) > 0 ? "In Stock" : "Out of Stock",

          image,
          gallery_images: clean(row.gallery_images)
            ? clean(row.gallery_images).split("|").map((x) => x.trim()).filter(Boolean)
            : [],

          hsnCode: clean(row.hsnCode),
          gst: num(row.gst),
          countryOfOrigin: clean(row.countryOfOrigin) || "India",

          status: "Pending Approval",
        });

        created.push(product);
      } catch (error: any) {
        failed.push({
          sku: row.sku,
          name: row.name,
          reason: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bulk upload completed",
      createdCount: created.length,
      failedCount: failed.length,
      failed,
    });
  } catch (error: any) {
    console.error("Bulk upload error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}