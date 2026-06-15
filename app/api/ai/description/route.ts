import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const description = `
Premium ${body.brand || ""} ${body.name} is designed for customers who want quality, style and value.

Key Highlights:
• Category: ${body.category || "General"}
• Brand: ${body.brand || "Klassic"}
• Price Range: ₹${body.price || "Best Price"}
• Features: ${body.features || "High quality, durable and easy to use"}

This product is perfect for daily use, gifting and premium lifestyle needs. Its modern design, reliable material and value pricing make it a smart choice for online shoppers.

Why buy from Klassic?
• Trusted marketplace experience
• Fast order processing
• Seller verified product
• Mobile-friendly shopping experience
• Great value for money
`;

  return NextResponse.json({ success: true, description });
}