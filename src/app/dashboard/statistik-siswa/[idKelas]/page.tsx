import axios from "axios";
import Link from "next/link";
import { z } from "zod";
import mongoose from "mongoose";
import Container from "@/components/statistikComponents/Container";
import { getStudentsByClassId } from "@/actions/statistikAct/actions";

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

const studentSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  absence: z.number(),
  permission: z.number(),
  attendance: z.number(),
  total: z.number(),
  scores: z.array(z.number()),
  average: z.number(),
});

const stdsSchema = z.array(studentSchema);

export default async function HasilPresensiPage({
  params,
}: {
  params: Promise<{ idKelas: string }>;
}) {
  let students: IStudent[] = [];
  const { idKelas } = await params;
  let error: string = "";

  const res = await getStudentsByClassId(idKelas);

  if (!res.success) {
    error = res.msg;
  } else {
    const parsedStds = stdsSchema.safeParse(res.data);

    if (!parsedStds.success) {
      console.error(parsedStds.error);
      error = "Gagal validasi zod";
    } else {
      students = parsedStds.data;
    }
  }

  return (
    <div className="p-2">
      <Link href="/dashboard" className="btn btn-info text-light mb-2">
        <i className="bi bi-arrow-return-left"></i>
      </Link>

      <Container students={students} />
    </div>
  );
}
