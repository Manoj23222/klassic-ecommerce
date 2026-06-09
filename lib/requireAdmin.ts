import { cookies } from "next/headers";
import db from "@/lib/db";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [users]: any = await db.query(
    "SELECT id, role FROM users WHERE id = ?",
    [userId]
  );

  if (users.length === 0 || users[0].role !== "admin") {
    throw new Error("Admin access required");
  }

  return users[0];
}