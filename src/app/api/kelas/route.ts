import connectDB from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/googleAuth";
import Class from "@/models/class";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: token.email }).lean();

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const classes = await Class.find({ owner: user._id.toString() });

    return NextResponse.json({
      msg: "Daftar kelas",
      data: {
        username: token.name,
        classes,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const req = await request.json();

    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: token.email }).lean();

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const classCount = await Class.countDocuments({ owner: user._id });

    if (!classCount) {
      return NextResponse.json(
        { msg: "Class count not found" },
        { status: 404 },
      );
    }

    console.log(classCount);

    if (user.tier === "free" && classCount >= 5) {
      return NextResponse.json(
        {
          msg: "Anda sudah mencapai batas maksimum kelas yang dapat dibuat pada free tier.",
        },
        { status: 403 },
      );
    } else if (user.tier === "subscription" && classCount >= 10) {
      return NextResponse.json(
        {
          msg: "Anda sudah mencapai batas maksimum kelas yang dapat dibuat pada premium tier.",
        },
        { status: 403 },
      );
    }

    // buat daa kelasnya
    const newClass = await Class.create({
      owner: user._id,
      className: req.className,
      subjectName: req.subjectName,
      semester: req.semester,
      students: [],
    });

    return NextResponse.json({
      msg: "Oke dulu",
      data: {
        newClass,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
