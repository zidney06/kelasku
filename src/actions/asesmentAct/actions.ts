"use server";

import connectDB from "@/lib/connectDb";
import Class from "@/models/class";
import AsesmentResult from "@/models/asesmentResult";
import Asesmen from "@/models/asesmen";
import Student from "@/models/student";
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
    const stds = cls.students.map((std: IStudent) => {
      return {
        ...std,
        _id: std._id.toString(),
        name: std.name,
        score: 0,
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

const resultSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  score: z.number().min(0).max(100),
});

const requestSchema = z.object({
  results: z.array(resultSchema),
  asesmentName: z.string().min(3).trim(),
  asesmentDescription: z.string().max(150).trim(),
});

export const createAsesment = async (
  classId: string,
  requestData: z.infer<typeof requestSchema>
) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const clsId = mongooseIdSchema.safeParse(classId);
    const req = requestSchema.safeParse(requestData);

    if (!clsId.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: clsId.error,
      };
    }

    if (!req.success) {
      return {
        success: false,
        msg: "Gagal dalam validasi input",
        error: req.error,
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

    const cls = await Class.findById(clsId.data).select("owner asesments");

    // cek apakah kelas ada
    if (!cls) {
      return { success: false, msg: "Class not found" };
    }

    // apakah user adalah pemiliknya
    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    // buat data hasil asesmen untuk ditampilkan di tiap asesmen
    const asesmentResults = req.data.results.map(
      (result: z.infer<typeof resultSchema>) => {
        return new AsesmentResult({
          studentData: result._id,
          score: result.score,
        });
      }
    );

    const newAsesment = new Asesmen({
      name: req.data.asesmentName,
      date: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }),
      description: req.data.asesmentDescription.trim(),
      asesmentResults: asesmentResults.map(
        (result: z.infer<typeof resultSchema>) => result._id
      ),
    });

    // simpan id asesmen ke class
    cls.asesments.push(newAsesment._id);

    // simpan nilai siswa ke fieldnya
    // buat bulkWriteOptnya dulu memakai agregation pipeline + bulkWrite
    const bulkWriteOpt = req.data.results.map(
      (result: z.infer<typeof resultSchema>) => {
        return {
          updateOne: {
            filter: { _id: result._id },
            update: [
              // ciri-ciri memakai agregation adalah adanya []
              {
                $set: {
                  scores: { $concatArrays: ["$scores", [result.score]] }, // stage 1: masukan nilai ke field scores
                },
              },
              {
                $set: {
                  average: { $avg: "$scores" }, // update nilai rata-rata siswa
                },
              },
            ],
          },
        };
      }
    );

    // simpan asesmen dan hasil asesmen
    await Promise.all([
      Student.bulkWrite(bulkWriteOpt),
      AsesmentResult.insertMany(asesmentResults),
      newAsesment.save(),
      cls.save(),
    ]);

    return {
      success: true,
      msg: "Berhasil membuat asesmen baru",
      data: newAsesment._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error!" };
  }
};
