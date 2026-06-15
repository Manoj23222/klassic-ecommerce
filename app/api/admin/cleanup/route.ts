import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Seller from "@/models/Seller";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function DELETE() {
  try {
    await connectDB();

    const customers = await User.deleteMany({
      role: { $ne: "admin" },
    });

    const sellers = await Seller.deleteMany({});

    const products = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Customers, sellers and products deleted successfully",
      deleted: {
        customers: customers.deletedCount,
        sellers: sellers.deletedCount,
        products: products.deletedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Cleanup failed",
      },
      { status: 500 }
    );
  }
}