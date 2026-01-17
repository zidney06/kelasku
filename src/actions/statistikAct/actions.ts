"use server";

import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import User from "@/models/googleAuth";
import { z } from "zod";
import mongoose from "mongoose";
import { getSession } from "@/utility/utility";

const mongooseIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id));

interface IStudent {
  _id: string;
  name: string;
  absence: number;
  permission: number;
  attendance: number;
  total: number;
  scores: number[];
  average: number;
}

export const getStudentsByClassId = async (classId: string) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid

    if (!clsId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: clsId.error,
      };
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
      .select("owner students")
      .populate({
        path: "students",
        match: { isDeleted: false },
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

    // tambahkan property ke respon
    const stds = cls.students.map((std: IStudent) => {
      return {
        ...std,
        _id: std._id.toString(),
      };
    });

    return {
      success: true,
      msg: "Berhasil mendapatkan daftar siswa",
      data: stds,
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};
