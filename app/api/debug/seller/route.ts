import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  return NextResponse.json({
    seller_id: cookieStore.get("seller_id")?.value || "",
    user_id: cookieStore.get("user_id")?.value || "",
  });
}