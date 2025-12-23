import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import Student from "@/models/student";
import { NextRequest, NextResponse } from "next/server";

interface IStudent {
  _id: string;
  name: string;
  attendance: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const { classId } = await params;

    const { students } = await request.json();

    if (!Array.isArray(students)) {
      return Response.json({ msg: "Data tidak valid" }, { status: 400 });
    }

    const isAllValid = students.every(
      (s: IStudent) => s.attendance >= 1 && s.attendance <= 3,
    );

    if (!isAllValid) {
      return Response.json(
        {
          msg: "Status presensi harus angka 1 (Hadir), 2 (Izin), atau 3 (Alpha)!",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const currentClass = await Class.findById(classId);

    if (!currentClass) {
      return NextResponse.json(
        { msg: "Kelas tidak ditemukan" },
        { status: 404 },
      );
    }

    if (currentClass.attendanceHistory.includes(date)) {
      return NextResponse.json(
        { msg: "Presensi sudah pernah dilakukan pada tanggal ini" },
        { status: 400 },
      );
    }

    if (students.length !== currentClass.students.length) {
      return NextResponse.json(
        { msg: "Jumlah siswa tidak sesuai" },
        { status: 400 },
      );
    }

    currentClass.attendanceHistory.push(date);
    const operations = students.map((siswa: IStudent) => ({
      updateOne: {
        filter: { _id: siswa._id },
        update: {
          $inc: {
            attendance: siswa.attendance === 1 ? 1 : 0,
            permission: siswa.attendance === 2 ? 1 : 0,
            absence: siswa.attendance === 3 ? 1 : 0,
          },
        },
      },
    }));

    await Promise.all([currentClass.save(), Student.bulkWrite(operations)]);

    console.log(students, date, currentClass, "presensi");
    console.dir(operations, { depth: null });

    // buat logikanya

    return NextResponse.json({
      msg: "Presensi kelas " + classId + " berhasil disimpan!",
      data: {
        isAttendanced: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ msg: "Gagal simpan presensi" }, { status: 500 });
  }
}
