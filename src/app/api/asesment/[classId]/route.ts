import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import Asesmen from "@/models/asesmen";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const { classId } = await params;

    await connectDB();

    const currentClass = await Class.findById(classId).lean();

    if (!currentClass) {
      return NextResponse.json({ msg: "Class not found" }, { status: 404 });
    }

    const asesmentsId = currentClass.asesments;

    const asesments = await Asesmen.find({ _id: { $in: asesmentsId } });

    return NextResponse.json(
      { msg: "Berhasil mengambil data asesmen", data: { asesments } },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
