import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function getCurrentUser() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return null;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) return null;

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}