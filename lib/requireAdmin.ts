import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const userId =
    cookieStore.get("user_id")?.value ||
    cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const user: any = await User.findById(userId)
    .select("_id name email role")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}