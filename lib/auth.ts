import { cookies } from "next/headers";
import db from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return null;

  const [rows]: any = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [userId]
  );

  return rows[0] || null;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}