import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import Student from "@/models/student";
import Class from "@/models/class";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;

  try {
    const { name } = await request.json();

    await connectDB();

    if (!name)
      return NextResponse.json({ msg: "Name is required" }, { status: 400 });

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { name },
      { new: true },
    );

    return NextResponse.json(
      {
        msg: "Student updated successfully",
        data: {
          _id: updatedStudent._id,
          name: updatedStudent.name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string; classId: string }> },
) {
  try {
    const { studentId, classId } = await params;

    await connectDB();

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (!student)
      return NextResponse.json({ msg: "Student not found" }, { status: 404 });

    const existedClass = await Class.findByIdAndUpdate(
      classId,
      {
        $pull: {
          students: studentId,
        },
      },
      { new: true },
    );

    console.log(student, existedClass);

    return NextResponse.json(
      {
        msg: "Student deleted successfully",
        data: {
          deletedStudentId: student._id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
