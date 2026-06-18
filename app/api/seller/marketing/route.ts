import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SellerCampaign from "@/models/SellerCampaign";

export const dynamic = "force-dynamic";

const allowedStatus = ["Draft", "Active", "Paused", "Ended"];

function text(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");
    const type = searchParams.get("type");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "seller_id required" },
        { status: 400 }
      );
    }

    const query: any = { seller_id: sellerId };
    if (type) query.type = type;

    const items = await SellerCampaign.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const sellerId = text(body.seller_id);
    const type = text(body.type);

    if (!sellerId || !type || !body.title) {
      return NextResponse.json(
        { success: false, message: "seller_id, type and title required" },
        { status: 400 }
      );
    }

    const item = await SellerCampaign.create({
      seller_id: sellerId,
      seller_store_name: text(body.seller_store_name),

      type,
      title: text(body.title),
      description: text(body.description),

      imageUrl: text(body.imageUrl),
      link: text(body.link),

      couponCode: text(body.couponCode).toUpperCase(),
      discount: Number(body.discount || 0),
      minOrder: Number(body.minOrder || 0),

      budget: Number(body.budget || 0),
      status: body.status || "Draft",
    });

    return NextResponse.json({
      success: true,
      message: "Marketing item saved",
      item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Save failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const itemId = text(body.item_id);
    const sellerId = text(body.seller_id);
    const status = text(body.status);

    if (!itemId || !sellerId || !status) {
      return NextResponse.json(
        { success: false, message: "item_id, seller_id and status required" },
        { status: 400 }
      );
    }

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const item = await SellerCampaign.findOneAndUpdate(
      {
        _id: itemId,
        seller_id: sellerId,
      },
      {
        status,
      },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Marketing item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated",
      item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const itemId = searchParams.get("item_id");
    const sellerId = searchParams.get("seller_id");

    if (!itemId || !sellerId) {
      return NextResponse.json(
        { success: false, message: "item_id and seller_id required" },
        { status: 400 }
      );
    }

    await SellerCampaign.findOneAndDelete({
      _id: itemId,
      seller_id: sellerId,
    });

    return NextResponse.json({
      success: true,
      message: "Marketing item deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}