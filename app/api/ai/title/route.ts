import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, brand, features } = await req.json();

  return NextResponse.json({
    success: true,
    titles: [
      `${brand || "Klassic"} ${name} | Premium Quality | Best Price Online`,
      `${name} for Daily Use with ${features || "Durable Design"} | Buy on Klassic`,
      `${brand || "Klassic"} ${name} - Stylish, Durable & Value for Money`,
      `Buy ${name} Online | Trusted Seller | Fast Delivery | Klassic`,
    ],
  });
}