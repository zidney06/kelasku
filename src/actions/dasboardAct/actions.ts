"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import connectDB from "@/lib/connectDb";
import User from "@/models/googleAuth";
import Class from "@/models/class";
import Asesmen from "@/models/asesmen";
import AsesmentResult from "@/models/asesmentResult";
import Student from "@/models/student";
import mongoose from "mongoose";
import { getSession } from "@/utility/utility";

const classSchema = z.object({
  className: z
    .string()
    .min(2)
    .regex(/^[a-zA-Z\s\d]+$/),
  subjectName: z
    .string()
    .min(2)
    .regex(/^[a-zA-Z\s\d]+$/),
  semester: z.string().regex(/^[1-9]+$/),
});

const userSchema = z.object({
  email: z.email(),
  name: z.string(),
  image: z.string(),
});

const sessionSchema = z.object({
  user: userSchema,
});

export const getClassList = async () => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("name")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found!" };
    }

    const rawClassList = await Class.find({ owner: user._id.toString() });

    const classList = rawClassList.map((cls) => {
      return {
        ...cls,
        _id: cls._id.toString(),
        className: cls.className,
        subjectName: cls.subjectName,
        semester: cls.semester,
        students: cls.students.map((std: string) => std.toString()),
      };
    });

    return {
      success: true,
      msg: "Class list fetched successfully!",
      data: {
        classList,
        username: user.name,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
};

export const createClass = async (data: {
  className: string;
  subjectName: string;
  semester: string;
}) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    const validatedData = classSchema.safeParse(data);

    if (!validatedData.success) {
      console.error(validatedData.error);
      return { success: false, msg: "Validation error" };
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

    const classCount = await Class.countDocuments({ owner: user._id });

    if (user.tier === "free" && classCount >= 5) {
      return {
        success: false,
        msg: "Anda sudah mencapai batas maksimum kelas yang dapat dibuat pada free tier.",
      };
    } else if (user.tier === "subscription" && classCount >= 10) {
      return {
        success: false,
        msg: "Anda sudah mencapai batas maksimum kelas yang dapat dibuat pada premium tier.",
      };
    }

    // buat data kelasnya
    const newClass = new Class({
      owner: user._id,
      className: validatedData.data.className,
      subjectName: validatedData.data.subjectName,
      semester: validatedData.data.semester,
      students: [],
    });

    // simpan ke db
    await newClass.save();

    revalidatePath("/dashboard");

    return {
      success: true,
      msg: "Class created successfully",
      data: {
        _id: newClass._id.toString(),
        className: newClass.className,
        subjectName: newClass.subjectName,
        semester: newClass.semester,
        students: [],
      }, // jika langsung mengirmkan newClass, akan ada error maximum call stack size exceeded. jadi kirim data yang diperlukan UI aja
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
};

export const deleteClass = async (classId: string) => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const clsId = z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id))
      .safeParse(classId);

    if (!clsId.success) {
      return { success: false, msg: "Invalid class ID" };
    }

    const user = await User.findOne({
      email: session.data.user.email,
    })
      .select("_id")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    const cls = await Class.findById(clsId.data);

    if (!cls) {
      return { success: false, msg: "Class not found!" };
    }

    if (cls.owner.toString() !== user._id.toString()) {
      return { success: false, msg: "User not auhorized" };
    }

    const asesments = await Asesmen.find({
      _id: { $in: cls.asesments },
    });

    const idAsesmentresults = asesments.flatMap((item) => item.asesmentResults);

    // Hapus data siswa, asesmenResults, asesmen, dan kelas menggunakan transaksi
    const mongooseSession = await mongoose.startSession();

    try {
      await mongooseSession.withTransaction(async () => {
        await AsesmentResult.deleteMany(
          { _id: { $in: idAsesmentresults } },
          { mongooseSession }
        );
        await Asesmen.deleteMany(
          { _id: { $in: cls.asesments } },
          { mongooseSession }
        );
        await Student.deleteMany(
          { _id: { $in: cls.students } },
          { mongooseSession }
        );
        await Class.deleteOne({ _id: cls._id }, { mongooseSession });
      });
    } catch (error) {
      console.error(error);
      throw new Error("Gagal menghapus kelas");
    } finally {
      await mongooseSession.endSession();
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      msg: "Class deleted succesfully!",
      data: cls._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal Server Error" };
  }
};
