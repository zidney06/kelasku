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

const studentAttendanceSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  attendanceStatus: z.number().min(1).max(3),
});

const stdsAtdDataSchema = z.array(studentAttendanceSchema);

const mongooseIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id));

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

    // tambahkan property ke respon
    const stds = cls.students.map(
      (std: z.infer<typeof studentAttendanceSchema>) => {
        return {
          ...std,
          _id: std._id.toString(),
          name: std.name,
          attendanceStatus: 0,
        };
      }
    );

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });

    const isAttendanced = cls.attendanceHistory.includes(today);

    if (isAttendanced) {
      return {
        success: true,
        msg: "Sudah diabesn hari ini",
        data: { students: [], isAttendanced },
      };
    } else {
      return {
        success: true,
        msg: "Berhasil mengambil data siswa untuk diabsen",
        data: {
          students: stds,
          isAttendanced,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Error fetching students" };
  }
};

export const setStudentsAttendance = async (
  classId: string,
  studentAttendanceData: z.infer<typeof stdsAtdDataSchema>
) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const parsedStudentAtdData = stdsAtdDataSchema.safeParse(
      studentAttendanceData
    );
    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid

    if (!clsId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: clsId.error,
      };
    }

    if (!parsedStudentAtdData.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: parsedStudentAtdData.error,
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

    const cls = await Class.findById(clsId.data).select(
      "owner attendanceHistory students"
    );

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });

    if (cls.attendanceHistory.includes(date)) {
      return {
        success: false,
        msg: "Presensi sudah pernah dilakukan pada tanggal ini",
      };
    }

    if (parsedStudentAtdData.data.length !== cls.students.length) {
      return { success: false, msg: "Jumlah siswa tidak sesuai" };
    }

    cls.attendanceHistory.push(date);

    const operations = parsedStudentAtdData.data.map(
      (siswa: z.infer<typeof studentAttendanceSchema>) => ({
        updateOne: {
          filter: { _id: siswa._id },
          update: {
            $inc: {
              attendance: siswa.attendanceStatus === 1 ? 1 : 0,
              permission: siswa.attendanceStatus === 2 ? 1 : 0,
              absence: siswa.attendanceStatus === 3 ? 1 : 0,
            },
          },
        },
      })
    );

    await Promise.all([cls.save(), Student.bulkWrite(operations)]);

    revalidatePath("/dashboard/presensi/" + clsId.data);

    return {
      success: true,
      msg: "Presensi kelas " + classId + " berhasil disimpan!",
      data: {
        isAttendanced: true, // entah kepake gak ni
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error!" };
  }
};
