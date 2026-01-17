import Link from "next/link";
import { getStudentsByClassId } from "@/actions/studentListAct/actions";
import Container from "@/components/daftarSiswaComponents/Container";

interface IStudent {
  _id: string;
  name: string;
}

export default async function StudentList({
  params,
}: {
  params: Promise<{ idKelas: string }>;
}) {
  const { idKelas } = await params;
  let students: IStudent[] = [];
  let error: string | undefined = "";

  const res = await getStudentsByClassId(idKelas);

  if (res.success && res.data) {
    students = res.data;
  } else {
    error = res.msg;
  }

  if (error) {
    return (
      <div className="container-fluid px-0">
        <p className="text-center">Gagal mengambil data siswa</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <main className="p-2">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>

        <Container students={students} idKelas={idKelas} />
      </main>
    </div>
  );
}
