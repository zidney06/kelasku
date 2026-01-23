"use server";

import { z } from "zod";
import connectDB from "@/lib/connectDb";
import User from "@/models/googleAuth";
import Class from "@/models/class";
import Student from "@/models/student";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { getSession } from "@/utility/utility";

interface IStudent {
  _id: string;
  name: string;
}

const mongooseIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id));

export const getStudentsByClassId = async (classId: string) => {
  try {
    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid

    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("_id")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    const cls = await Class.findById(clsId.data)
      .select("owner students attendanceHistory")
      .populate({
        path: "students",
        match: { isDeleted: false },
        select: "name",
      })
      .lean();

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const stds = cls.students.map((std: IStudent) => {
      return { ...std, _id: std._id.toString(), name: std.name };
    });

    return { success: true, data: stds };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Error fetching students" };
  }
};

export const addStudentToClass = async (
  classId: string,
  studentName: string
) => {
  try {
    const stdName = z
      .string()
      .min(1)
      .max(150)
      .regex(/^[a-zA-Z\s]+$/)
      .safeParse(studentName);
    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid

    if (stdName.success === false || !clsId.success) {
      return { success: false, msg: "Invalid request" };
    }

    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("tier")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    const cls = await Class.findById(classId).select("owner students");

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    // cek tier
    if (user.tier === "free" && cls.students.length >= 30) {
      return { success: false, msg: "Free tier limit reached!" };
    } else if (user.tier === "subscription" && cls.students.length >= 50) {
      return { success: false, msg: "Subscription tier limit reached!" };
    }

    const newStudent = new Student({
      name: stdName.data,
    });

    cls.students.push(newStudent._id);

    await Promise.all([cls.save(), newStudent.save()]);

    revalidatePath(`/dashboard/studentList/${classId}`);

    return { success: true, msg: "Student added successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error!" };
  }
};

export const editStudent = async (
  studentName: string,
  studentId: string,
  classId: string
) => {
  try {
    // validasi input user
    const stdName = z
      .string()
      .min(1)
      .max(150)
      .regex(/^[a-zA-Z\s]+$/)
      .safeParse(studentName);
    const clsId = mongooseIdSchema.safeParse(classId);
    const stdId = mongooseIdSchema.safeParse(studentId);

    if (!stdName.success || !clsId.success || !stdId.success) {
      return { success: false, msg: "Invalid Request" };
    }

    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Failed to get user sesion!" };
    }

    await connectDB();

    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("_id")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    const cls = await Class.findById(clsId.data).select("owner").lean();

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      stdId.data,
      { name: stdName.data },
      { new: true }
    );

    if (!updatedStudent) {
      return { success: false, msg: "Document not found!" };
    }

    revalidatePath(`/dashboard/studentList/${classId}`);

    return { success: true, msg: "Berhasil update data siswa" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
};

export const deleteStudent = async (studentId: string, classId: string) => {
  try {
    // validasi input user
    // refine = custom validation that zod don't have
    const clsId = z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id))
      .safeParse(classId);
    const stdId = z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id))
      .safeParse(studentId);

    if (!clsId.success || !stdId.success) {
      return { success: false, msg: "Invalid Request" };
    }

    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Failed to get user sesion!" };
    }

    await connectDB();

    // cek apakah user merupakan pemilik data kelas
    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("_id")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    const cls = await Class.findById(clsId.data).select("owner").lean();

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    // kenapa kok gak langsung dihapus aja
    // karena ini nanti akan berhubungan dengan dokumen asesmen
    const deletedStudent = await Student.findByIdAndUpdate(
      stdId.data,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedStudent) {
      return { success: false, msg: "Student not found!" };
    }

    await Class.findByIdAndUpdate(clsId.data, {
      $pull: {
        students: stdId.data,
      },
    });

    revalidatePath(`/dashboard/studentList/${classId}`);

    return { success: true, msg: "Berhasil menghapus data siswa!" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
};
