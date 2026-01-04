import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import AsesmentResult from "@/models/asesmentResult";
import Asesmen from "@/models/asesmen";
import Student from "@/models/student";

interface iStudentData {
  _id: string;
  name: string;
  absence: number;
  permission: number;
  attendance: number;
  total: number;
  scores: number[];
  average: number;
  isDeleted: boolean;
}

// untuk asesment Results
interface IAsesmentResult {
  _id: string;
  studentData: iStudentData;
  score: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; asesmentId: string }> },
) {
  try {
    const { asesmentId } = await params;

    await connectDB();

    const asesment = await Asesmen.findById(asesmentId).lean();

    if (!asesment) {
      return NextResponse.json(
        {
          msg: "Asesmen not found",
        },
        { status: 404 },
      );
    }

    const asesmentResults = await AsesmentResult.find({
      _id: { $in: asesment.asesmentResults },
    }).populate("studentData", "name");

    return NextResponse.json(
      {
        msg: "Berhasil mendapatkan data hasil asesment",
        data: {
          asesmentResults,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; asesmentId: string }> },
) {
  try {
    const { asesmentId } = await params;

    await connectDB();

    const asesment = await Asesmen.findById(asesmentId, {
      new: true,
    }).populate({
      path: "asesmentResults",
      populate: {
        path: "studentData",
      },
    });

    if (!asesment) {
      return NextResponse.json(
        {
          msg: "Asesmen not found",
        },
        { status: 404 },
      );
    }

    // hapus nilai yang ada dalam student.scores
    const bulkOps = asesment.asesmentResults.map((result: IAsesmentResult) => {
      const index = result.studentData.scores.indexOf(result.score);

      // Salinan array
      const updatedScores = [...result.studentData.scores];
      updatedScores.splice(index, 1);

      // Hitung ulang average
      const totalSum = updatedScores.reduce((acc, curr) => acc + curr, 0);
      const average =
        updatedScores.length > 0 ? totalSum / updatedScores.length : 0;

      return {
        updateOne: {
          filter: { _id: result.studentData._id },
          update: { $set: { scores: updatedScores, average } },
        },
      };
    });

    await Promise.all([
      await Student.bulkWrite(bulkOps),
      await AsesmentResult.deleteMany({
        _id: { $in: asesment.asesmentResults },
      }),
      await Asesmen.deleteOne({ _id: asesmentId }),
    ]);

    return NextResponse.json(
      {
        msg: "Berhasil menghapus data hasil asesmen",
        data: {
          deletedAsesmentId: asesment._id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
