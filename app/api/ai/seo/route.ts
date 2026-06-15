import { NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  const { name, category } = await req.json();

  return NextResponse.json({
    success: true,
    seoTitle: `Buy ${name} Online at Best Price | Klassic`,
    seoDescription: `Shop ${name} in ${category || "top categories"} at Klassic. Best price, trusted sellers, fast delivery and premium marketplace experience.`,
    keywords: `${name}, buy ${name} online, ${category}, best price, Klassic marketplace, online shopping India`,
    slug: slugify(name || "klassic-product"),
  });
}