import connectDB from "@/lib/connectDb";
import User from "@/models/googleAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    await connectDB();

    console.log(userId);

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      msg: "Berhasil mendapatkan data user",
      data: {
        user: {
          name: user.name,
          email: user.email,
          tier: user.tier,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
