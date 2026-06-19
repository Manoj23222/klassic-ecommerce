import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

function cleanText(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function cleanNumber(value: any, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const parentId = searchParams.get("parent_id");
    const level = searchParams.get("level");
    const leaf = searchParams.get("leaf");
    const status = searchParams.get("status");
    const showInMenu = searchParams.get("showInMenu");
    const featured = searchParams.get("featured");
    const sellerAllowed = searchParams.get("sellerAllowed");

    const query: any = {};

    if (status) query.status = status;

    if (parentId !== null) query.parent_id = parentId;

    if (level) query.level = Number(level);

    if (leaf === "true") query.isLeaf = true;
    if (leaf === "false") query.isLeaf = false;

    if (showInMenu === "true") query.showInMenu = true;
    if (showInMenu === "false") query.showInMenu = false;

    if (featured === "true") query.featured = true;
    if (featured === "false") query.featured = false;

    if (sellerAllowed === "true") query.sellerAllowed = true;
    if (sellerAllowed === "false") query.sellerAllowed = false;

    const categories = await Category.find(query)
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error("Categories fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Categories fetch failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const name = cleanText(body.name);
    const slug = cleanText(body.slug).toLowerCase();

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug required",
        },
        { status: 400 }
      );
    }

    const oldCategory = await Category.findOne({ slug });

    if (oldCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 400 }
      );
    }

    const commissionRate = cleanNumber(body.commissionRate, 0);
    const defaultGst = cleanNumber(body.defaultGst, 0);

    if (commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Commission rate must be between 0 and 100",
        },
        { status: 400 }
      );
    }

    if (defaultGst < 0 || defaultGst > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "GST must be between 0 and 100",
        },
        { status: 400 }
      );
    }

    const cleanPath =
      Array.isArray(body.path) && body.path.length > 0
        ? body.path.map((x: any) => cleanText(x)).filter(Boolean)
        : [name];

    const dynamicAttributes = Array.isArray(body.dynamicAttributes)
      ? body.dynamicAttributes.map((x: any) => cleanText(x)).filter(Boolean)
      : [];

    const category = await Category.create({
      name,
      slug,

      level: cleanNumber(body.level, 1),
      parent_id: cleanText(body.parent_id),

      path: cleanPath,

      isLeaf: Boolean(body.isLeaf),

      status: body.status === "Inactive" ? "Inactive" : "Active",

      image: cleanText(body.image),
      icon: cleanText(body.icon),
      description: cleanText(body.description),

      commissionRate,

      sortOrder: cleanNumber(body.sortOrder, 0),

      showInMenu: body.showInMenu !== false,
      featured: Boolean(body.featured),
      sellerAllowed: body.sellerAllowed !== false,

      defaultGst,
      hsnCode: cleanText(body.hsnCode),

      metaTitle: cleanText(body.metaTitle),
      metaDescription: cleanText(body.metaDescription),
      seoKeywords: cleanText(body.seoKeywords),

      dynamicAttributes,

      createdBy: cleanText(body.createdBy) || "Admin",
    });

    return NextResponse.json({
      success: true,
      message: "Category created",
      category,
    });
  } catch (error: any) {
    console.error("Category create error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Category slug already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Category create failed",
      },
      { status: 500 }
    );
  }
}