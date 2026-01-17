import axios from "axios";
import Link from "next/link";
import AsesmentComponent from "@/components/hasilAsesmentsComponent/AsesmentComponent";
import { getAsesmentsList } from "@/actions/hasilAsesmentAct/actions";
import z from "zod";
import mongoose from "mongoose";

const asesmentSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  date: z.date(),
  description: z.string(),
  asesmentResults: z.array(
    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id))
  ),
});

const asesmentsSchema = z.array(asesmentSchema);

export default async function HasilPresensiPage({
  params,
}: {
  params: Promise<{ idKelas: string }>;
}) {
  let asesments: z.infer<typeof asesmentsSchema> = [];
  const { idKelas } = await params;
  let error: string = "";

  const res = await getAsesmentsList(idKelas);

  if (!res.success) {
    error = res.msg;
  } else {
    const parsedData = asesmentsSchema.safeParse(res.data);

    if (!parsedData.success) {
      console.error(parsedData.error);
      error = "Gagal validasi zod";
    } else {
      asesments = parsedData.data;
    }
  }

  return (
    <div className="container-fluid p-0">
      <main className="p-1">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>

        <h5></h5>

        <h5>Pilih Asesmen</h5>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Deskripsi</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {asesments.map((asesment: z.infer<typeof asesmentSchema>, i) => (
              <AsesmentComponent
                asesment={asesment}
                i={i}
                key={asesment._id}
                idKelas={idKelas}
              />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
