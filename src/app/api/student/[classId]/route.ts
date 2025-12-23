import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/connectDb";
import Student from "@/models/student";
import Class from "@/models/class";
import User from "@/models/googleAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const { classId } = await params;
    const isPresence = request.nextUrl.searchParams.get("isPresence");

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const kelas = await Class.findById(classId).populate({
      path: "students",
      match: { isDeleted: false },
    });

    if (!kelas) {
      return NextResponse.json({ msg: "Class not found" }, { status: 404 });
    }

    let response;
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });

    if (isPresence === "true") {
      const isAttendanced = kelas.attendanceHistory.includes(today);

      response = {
        students: kelas.students,
        isAttendanced,
      };
    } else {
      response = {
        students: kelas.students,
      };
    }

    return NextResponse.json({
      msg: "Mengambil data berhasil",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;

  try {
    const { name } = await request.json();
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    if (!name)
      return NextResponse.json({ msg: "Name is required" }, { status: 400 });

    const user = await User.findOne({ email: token.email }).lean();

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const currentClass = await Class.findById(classId);

    if (!currentClass) {
      return NextResponse.json({ msg: "Class not found" }, { status: 404 });
    }

    // cek tier
    if (user.tier === "free" && currentClass.students.length >= 30) {
      return NextResponse.json(
        {
          msg: "Anda sudah mencapai batas maksimum jumlah siswa pada satu kelas yang dapat dibuat pada free tier.",
        },
        { status: 403 },
      );
    } else if (
      user.tier === "subscription" &&
      currentClass.students.length >= 50
    ) {
      return NextResponse.json(
        {
          msg: "Anda sudah mencapai batas maksimum jumlah siswa pada satu kelas yang dapat dibuat pada premium tier.",
        },
        { status: 403 },
      );
    }

    const newStudent = new Student({
      name,
    });

    currentClass.students.push(newStudent._id);

    await Promise.all([currentClass.save(), newStudent.save()]);

    return NextResponse.json({
      msg: "Menambahkan data berhasil",
      data: {
        newStudent,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
