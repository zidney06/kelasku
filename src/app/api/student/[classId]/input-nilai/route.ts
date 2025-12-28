import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import AsesmentResult from "@/models/asesmentResult";
import Asesmen from "@/models/asesmen";
import Student from "@/models/student";

interface IAsesmentResult {
  _id: string;
  name: string;
  score: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const { classId } = await params;
    const { results, asesmenDescription, asesmenName } = await request.json();

    if (!asesmenName.trim()) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const currentClass = await Class.findById(classId);

    if (!currentClass) {
      return NextResponse.json({ msg: "Class not found" }, { status: 404 });
    }

    // buat data hasil asesmen untuk ditampilkan di tiap asesmen
    const asesmentResults = results.map((result: IAsesmentResult) => {
      return new AsesmentResult({
        studentId: result._id,
        studentName: result.name,
        score: result.score,
      });
    });

    // buat asesmen
    const newAsesment = new Asesmen({
      name: asesmenName,
      date: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }),
      description: asesmenDescription.trim(),
      asesmentResults: asesmentResults.map(
        (result: IAsesmentResult) => result._id,
      ),
    });

    // simpan id asesmen ke class
    currentClass.asesments.push(newAsesment._id);

    // simpan nilai siswa ke fieldnya
    await Promise.all(
      results.map(async (result: IAsesmentResult) => {
        const doc = await Student.findById(result._id);
        if (!doc) return;
        doc.scores.push(result.score);
        await doc.save();
      }),
    );

    // simpan asesmen dan hasil asesmen
    await Promise.all([
      AsesmentResult.insertMany(asesmentResults),
      newAsesment.save(),
      currentClass.save(),
    ]);

    return NextResponse.json(
      { msg: "Berhasil membuat asesmen baru" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
