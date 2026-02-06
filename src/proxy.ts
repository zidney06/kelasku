import { NextRequest, NextResponse } from "next/server";
import connectDB from "./lib/connectDb";
import { getToken } from "next-auth/jwt";
import User from "./models/user";
import { getRemainingDays } from "./utility/utility";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  await connectDB();

  // validasi token dan ambil tokenya
  const token = await getToken({ req: request });

  // cek token
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = await User.findOne({
    email: token.email,
  }).select("expiryDate tier");

  if (user.tier === "subscription") {
    const remainingDays = getRemainingDays(user.expiryDate);

    if (remainingDays <= 0) {
      user.tier = "free";
      user.expiryDate = null;

      await user.save();
    }
  }

  // jika sudah aman lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/asesment/:path*",
    "/api/kelas/:path*",
    "/api/student/:path*",
  ],
};
