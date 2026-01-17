"use client";

import Link from "next/link";
import { z } from "zod";
import DeleteComponent from "@/components/dashboardComponents/DeleteComponent";
import { confirmAlert } from "react-confirm-alert";

const classSchema = z.object({
  _id: z.preprocess((val) => String(val), z.string()),
  className: z.string(),
  subjectName: z.string(),
  semester: z.union([z.string(), z.number()]),
  students: z.array(z.string()),
});

export default function ClassCard({
  item,
  i,
}: {
  item: z.infer<typeof classSchema>;
  i: number;
}) {
  return (
    <div className="card my-1" style={{ minWidth: 300 }} key={i}>
      <div className="card-body">
        <h5 className="card-title">{item.className}</h5>

        <p>Jumlah siswa: {item.students.length}</p>
        <p>Mata pelajaran: {item.subjectName}</p>
        <p>Semester: {item.semester}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Aksi
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link
                  href={"/dashboard/studentList/" + item._id}
                  className="dropdown-item"
                >
                  Daftar Siswa
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/presensi/" + item._id}
                  className="dropdown-item"
                >
                  Presensi
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/asesmen/" + item._id}
                  className="dropdown-item"
                >
                  Asesmen
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/statistik-siswa/" + item._id}
                  className="dropdown-item"
                >
                  Statistik Siswa
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/hasil-asesmen/" + item._id}
                  className="dropdown-item"
                >
                  Hasil Asesmen
                </Link>
              </li>
            </ul>
          </div>

          <DeleteComponent classId={item._id} className={item.className} />
        </div>
      </div>
    </div>
  );
}
