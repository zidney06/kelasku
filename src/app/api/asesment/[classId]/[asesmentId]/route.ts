import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import AsesmentResult from "@/models/asesmentResult";
import Asesmen from "@/models/asesmen";
import Student from "@/models/student";

// untuk asesment Results

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
    });

    console.log(asesment, asesmentResults);

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
    const { classId, asesmentId } = await params;

    await connectDB();

    const asesment = await Asesmen.findByIdAndDelete(asesmentId, { new: true });

    if (!asesment) {
      return NextResponse.json(
        {
          msg: "Asesmen not found",
        },
        { status: 404 },
      );
    }

    await AsesmentResult.deleteMany({
      _id: { $in: asesment.asesmentResults },
    });

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
