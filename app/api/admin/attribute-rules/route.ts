import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AttributeRule from "@/models/AttributeRule";

export const dynamic = "force-dynamic";

function clean(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("category_id");

    const query: any = {};

    if (categoryId) {
      query.category_id = categoryId;
    }

    query.status = "Active";

    const rules = await AttributeRule.find(query)
      .sort({
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      rules,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
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
        {
          status: 400,
        }
      );
    }

    const rule = await AttributeRule.create({
      category_id: body.category_id,
      category_name: clean(body.category_name),

      fieldName: clean(body.fieldName),

      fieldKey: clean(
        body.fieldKey ||
          body.fieldName
            ?.toLowerCase()
            .replace(/\s+/g, "_")
      ),

      fieldType: body.fieldType || "text",

      options: Array.isArray(body.options)
        ? body.options
        : [],

      placeholder: clean(body.placeholder),

      unit: clean(body.unit),

      required: Boolean(body.required),

      filterable: Boolean(body.filterable),

      searchable:
        body.searchable === undefined
          ? true
          : Boolean(body.searchable),

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
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
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
        {
          status: 400,
        }
      );
    }

    await AttributeRule.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Rule deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}