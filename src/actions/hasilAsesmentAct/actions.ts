"use server";

import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import Asesmen from "@/models/asesmen";
import User from "@/models/user";
import Student from "@/models/student";
import AsesmentResult from "@/models/asesmentResult";
import { getSession } from "@/utility/utility";
import { z } from "zod";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

const asesmentSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  date: z.date(),
  description: z.string(),
  asesmentResults: z.array(
    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  ),
});

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

interface IAsesmentResult {
  _id: string;
  studentData: iStudentData;
  score: number;
}

const mongooseIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id));

export const getAsesmentsList = async (classId: string) => {
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
      .select("owner asesments")
      .populate("asesments")
      .lean();

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const responseData = cls.asesments.map(
      (asesment: z.infer<typeof asesmentSchema>) => {
        return {
          ...asesment,
          _id: asesment._id.toString(),
          asesmentResults: asesment.asesmentResults.map((item) =>
            item.toString(),
          ),
        };
      },
    );

    return {
      success: true,
      msg: "Berhasil mengambil data asesments",
      data: responseData,
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};

export const getAsesmentResults = async (
  classId: string,
  asesmentId: string,
) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid
    const asmntId = z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id))
      .safeParse(asesmentId);

    if (!clsId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi classId",
        error: clsId.error,
      };
    } else if (!asmntId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi asmntId",
        error: asmntId.error,
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

    const cls = await Class.findById(clsId.data).select("owner").lean();

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const asesment = await Asesmen.findById(asesmentId).lean();

    if (!asesment) {
      return { success: false, msg: "Asesmen not found" };
    }

    const asesmentResults = await AsesmentResult.find({
      _id: { $in: asesment.asesmentResults },
    }).populate("studentData", "name");

    const asmntData = asesmentResults.map((item) => {
      return {
        _id: item._id.toString(),
        studentData: item.studentData,
        score: item.score,
      };
    });

    return {
      success: true,
      msg: "Berhasil mendapatkan data hasil asesment",
      data: asmntData,
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};

export const deleteAsesment = async (classId: string, asesmentId: string) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const clsId = mongooseIdSchema.safeParse(classId); // cek apakah id kelas valid
    const asmntId = z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id))
      .safeParse(asesmentId);

    if (!clsId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: clsId.error,
      };
    } else if (!asmntId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: asmntId.error,
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
      .select("owner asesments")
      .populate("asesments");

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const asesment = await Asesmen.findById(asesmentId, {
      new: true,
    }).populate({
      path: "asesmentResults",
      populate: {
        path: "studentData",
      },
    });

    if (!asesment) {
      return { success: false, msg: "Asesment not found" };
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

    cls.asesments.pull(asesment._id);

    await Promise.all([
      Student.bulkWrite(bulkOps),
      AsesmentResult.deleteMany({
        _id: { $in: asesment.asesmentResults },
      }),
      Asesmen.deleteOne({ _id: asesmentId }),
      cls.save(),
    ]);

    revalidatePath("/dashboard/hasil-asesmen/" + classId);

    return { success: true, msg: "Berhasil menghapus asesment" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};
