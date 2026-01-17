import { getStudentsByClassId } from "@/actions/asesmentAct/actions";
import AsesmentComponent from "@/components/asesmentComponents/AsesmentComponent";
import Link from "next/link";
import z from "zod";
import mongoose from "mongoose";

const stdSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  score: z.number(),
});

const stdsSchema = z.array(stdSchema);

export default async function InputNilaiPage({
  params,
}: {
  params: Promise<{ idKelas: string }>;
}) {
  const { idKelas } = await params;
  let students: z.infer<typeof stdsSchema> = [];
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
      <Link href="/dashboard" className="btn btn-info text-light">
        <i className="bi bi-arrow-return-left"></i>
      </Link>
      <h1>Buat asesmen atau tugas</h1>
      {error && <p>{error}</p>}

      {/* Sini */}
      <AsesmentComponent stds={students} idKelas={idKelas} />
      {/* sini  */}
    </div>
  );
}
