import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AttributeRule from "@/models/AttributeRule";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

function clean(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

async function getCategoryHierarchyIds(categoryId: string) {
  const ids: string[] = [];

  let current: any = await Category.findById(categoryId).lean();

  while (current) {
    ids.unshift(String(current._id));

    if (!current.parent_id) break;

    current = await Category.findById(current.parent_id).lean();
  }

  return ids;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");

    const query: any = {
      status: "Active",
    };

    let hierarchyIds: string[] = [];

    if (categoryId) {
      hierarchyIds = await getCategoryHierarchyIds(categoryId);

      query.category_id = {
        $in: hierarchyIds.length > 0 ? hierarchyIds : [categoryId],
      };
    }

    const rules = await AttributeRule.find(query)
      .sort({
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    const depthMap = new Map(
      hierarchyIds.map((id, index) => [id, index])
    );

    const sortedRules = rules.sort((a: any, b: any) => {
      const aDepth = depthMap.get(String(a.category_id)) ?? 0;
      const bDepth = depthMap.get(String(b.category_id)) ?? 0;

      if (aDepth !== bDepth) return aDepth - bDepth;

      return Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    });

    const finalRulesMap = new Map<string, any>();

    for (const rule of sortedRules) {
      finalRulesMap.set(rule.fieldKey, {
        ...rule,
        inherited: String(rule.category_id) !== String(categoryId),
      });
    }

    return NextResponse.json({
      success: true,
      rules: Array.from(finalRulesMap.values()),
      hierarchyIds,
    });
  } catch (error: any) {
    console.error("Attribute rules GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Attribute rules fetch failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category required",
        },
        { status: 400 }
      );
    }

    const fieldName = clean(body.fieldName);

    if (!fieldName) {
      return NextResponse.json(
        {
          success: false,
          message: "Field name required",
        },
        { status: 400 }
      );
    }

    const rule = await AttributeRule.create({
      category_id: clean(body.category_id),
      category_name: clean(body.category_name),

      fieldName,

      fieldKey: clean(
        body.fieldKey ||
          fieldName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
      ),

      fieldType: body.fieldType || "text",

      options: Array.isArray(body.options)
        ? body.options.map((x: any) => clean(x)).filter(Boolean)
        : [],

      placeholder: clean(body.placeholder),
      unit: clean(body.unit),

      required: Boolean(body.required),
      filterable: Boolean(body.filterable),

      searchable:
        body.searchable === undefined ? true : Boolean(body.searchable),

      showOnProductPage:
        body.showOnProductPage === undefined
          ? true
          : Boolean(body.showOnProductPage),

      sortOrder: Number(body.sortOrder || 0),
      status: body.status || "Active",
    });

    return NextResponse.json({
      success: true,
      rule,
    });
  } catch (error: any) {
    console.error("Attribute rules POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Attribute rule create failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Rule ID required",
        },
        { status: 400 }
      );
    }

    await AttributeRule.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Rule deleted",
    });
  } catch (error: any) {
    console.error("Attribute rules DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Attribute rule delete failed",
      },
      { status: 500 }
    );
  }
}