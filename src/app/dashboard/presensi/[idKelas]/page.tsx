import Link from "next/link";
import mongoose from "mongoose";
import PresenceComponent from "@/components/presensiComponents/PresenceComponent";
import { getStudentsByClassId } from "@/actions/presenceAct/actions";
import z from "zod";

const stdSchema = z.object({
  _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  name: z.string(),
  attendanceStatus: z.number(),
});

const stdsSchema = z.array(stdSchema);

export default async function PresensiPage({
  params,
}: {
  params: Promise<{ idKelas: string }>;
}) {
  const { idKelas } = await params;

  const date = new Date();
  let isAttendanced = false;
  let students: z.infer<typeof stdsSchema> = [];
  let error: string | undefined = "";

  const res = await getStudentsByClassId(idKelas);

  if (!res.success) {
    error = res.msg;
  } else {
    const parsedStds = stdsSchema.safeParse(res.data!.students);

    if (!parsedStds.success) {
      console.error(parsedStds.error);
      error = "Gagal validasi zod";
    } else {
      isAttendanced = res.data!.isAttendanced;
      students = parsedStds.data;
    }
  }

  return (
    <div className="container-fluid p-0">
      <main className="p-2">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <h1>Presensi</h1>
        {error && <i>{error}</i>}
        <p>
          Presensi tanggal
          {" " +
            date.toLocaleDateString("id-ID", {
              timeZone: "Asia/Jakarta",
              dateStyle: "full",
            })}
        </p>
        {!isAttendanced ? (
          <PresenceComponent stds={students} idKelas={idKelas} />
        ) : (
          <p
            className="border text-center p-2 mx-auto"
            style={{ maxWidth: 800 }}
          >
            Hari ini sudah diabsen!
          </p>
        )}
      </main>
    </div>
  );
}
