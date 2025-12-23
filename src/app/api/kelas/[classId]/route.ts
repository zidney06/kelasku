import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Class from "@/models/class";
import Student from "@/models/student";
import Asesmen from "@/models/asesmen";
import AsesmentResult from "@/models/asesmentResult";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const { classId } = await params;

    await connectDB();

    const deletedClass = await Class.findById(classId);

    if (!deletedClass) {
      return NextResponse.json(
        { msg: "Kelas tidak ditemukan" },
        { status: 404 },
      );
    }

    const asesments = await Asesmen.find({
      _id: { $in: deletedClass.asesments },
    });

    const idAsesmentresults = asesments.flatMap((item) => item.asesmentResults);

    // Hapus data siswa, asesmenResults, asesmen, dan kelas
    await Promise.all([
      AsesmentResult.deleteMany({ _id: { $in: idAsesmentresults } }),
      Asesmen.deleteMany({ _id: { $in: deletedClass.asesments } }),
      Student.deleteMany({ _id: { $in: deletedClass.students } }),
      Class.deleteOne({ _id: classId }),
    ]);

    return NextResponse.json(
      {
        msg: "Berhasil menghapus kelas",
        data: {
          deletedClassId: deletedClass._id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
