"use server";

import User from "@/models/googleAuth";
import { getSession } from "@/utility/utility";
import connectDB from "@/lib/connectDb";

export const getUserData = async () => {
  const session = await getSession();

  if (!session.success || !session.data) {
    return { success: false, msg: "Unauthorized" };
  }

  await connectDB();

  const user = await User.findOne({ email: session.data.user?.email })
    .select("name email tier image")
    .lean();

  if (!user) {
    return { success: false, msg: "User not found!" };
  }

  return { success: true, data: user };
};
