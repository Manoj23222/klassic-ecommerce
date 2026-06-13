import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { seller_id } = body;

    if (!seller_id || !mongoose.Types.ObjectId.isValid(seller_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(seller_id);

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    seller.bank_account_holder =
      body.bank_account_holder ?? seller.bank_account_holder;
    seller.bank_name = body.bank_name ?? seller.bank_name;
    seller.bank_account_number =
      body.bank_account_number ?? seller.bank_account_number;
    seller.bank_ifsc = body.bank_ifsc ?? seller.bank_ifsc;
    seller.upi_id = body.upi_id ?? seller.upi_id;

    await seller.save();

    return NextResponse.json({
      success: true,
      message: "Bank details updated",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}