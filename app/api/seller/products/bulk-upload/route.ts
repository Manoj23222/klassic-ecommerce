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

function list(value: any) {
  return clean(value)
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}
function normalizeImageUrl(value: any) {
  const url = clean(value).replace(/^"|"$/g, "");

  if (!url) return "/placeholder.png";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return url;
  }

  return `/${url}`;
}

function imageList(value: any) {
  return clean(value)
    .split("|")
    .map((x) => normalizeImageUrl(x))
    .filter(Boolean);
}

function parseQuantityPrices(value: any) {
  return clean(value)
    .split("|")
    .map((item) => {
      const [label, price] = item.split(":");

      return {
        label: clean(label),
        price: Number(price || 0),
      };
    })
    .filter((x) => x.label && x.price > 0);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const sellerId = clean(formData.get("seller_id"));
    const sellerStoreName =
      clean(formData.get("seller_store_name")) || "Klassic Seller";
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
        const price = num(row.price);

        const image = normalizeImageUrl(row.image);
const galleryImages = imageList(row.gallery_images);
const finalGalleryImages =
  galleryImages.length > 0 ? galleryImages : [image];

console.log("CSV IMAGE =", row.image);
console.log("FINAL IMAGE =", image);
          

        if (!name || !sku || !price) {
          failed.push({
            sku,
            name,
            reason: "name, sku and price required",
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

        const quantityOptions = list(row.quantityOptions);
        const quantityPrices = parseQuantityPrices(row.quantityPrices);

        const colors = list(row.colors);
        const sizes = list(row.sizes);
        const tags = list(row.tags);

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
          regularPrice: num(row.regularPrice || row.mrp || row.price),
          sale_price: num(row.sale_price || row.salePrice || row.price),
          salePrice: num(row.salePrice || row.sale_price || row.price),
          stock: num(row.stock),
          stockStatus: num(row.stock) > 0 ? "In Stock" : "Out of Stock",

          image,
          gallery_images: finalGalleryImages,
          images: finalGalleryImages,

          colors,
          sizes,
          tags,

          quantityOptions,
          quantities: quantityOptions,
          weightOptions: quantityOptions,
          quantityPrices,

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