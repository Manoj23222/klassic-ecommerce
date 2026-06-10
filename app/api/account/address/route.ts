import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not logged in" },
      { status: 401 }
    );
  }

  const [rows]: any = await db.query(
    `SELECT 
      name, email, role, phone, address, city, pincode, address_type
     FROM users 
     WHERE id = ?`,
    [userId]
  );

  return NextResponse.json({
    success: true,
    user: rows[0],
    address: rows[0],
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const fields: string[] = [];
  const values: any[] = [];

  if (body.name !== undefined) {
    fields.push("name = ?");
    values.push(body.name);
  }

  if (body.phone !== undefined) {
    fields.push("phone = ?");
    values.push(body.phone);
  }

  if (body.address !== undefined) {
    fields.push("address = ?");
    values.push(body.address);
  }

  if (body.city !== undefined) {
    fields.push("city = ?");
    values.push(body.city);
  }

  if (body.pincode !== undefined) {
    fields.push("pincode = ?");
    values.push(body.pincode);
  }

  if (body.address_type !== undefined) {
    fields.push("address_type = ?");
    values.push(body.address_type);
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { success: false, error: "No data to update" },
      { status: 400 }
    );
  }

  values.push(userId);

  await db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  return NextResponse.json({ success: true });
}