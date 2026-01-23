"use client";

import Link from "next/link";
import { z } from "zod";
import DeleteComponent from "@/components/dashboardComponents/DeleteComponent";
import { deleteClass } from "@/actions/dasboardAct/actions";
import { PopupContext } from "@/context/AppContext";
import { useContext, useTransition } from "react";

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
  const context = useContext(PopupContext);
  const [isLoading, startTransition] = useTransition();

  const tes = true;

  const handleDelete = (
    inputValue: string,
    className: string,
    classId: string
  ) => {
    if (inputValue !== className) {
      context?.setPopupState({
        isShow: true,
        title: "OOps!",
        message: "Input tidak cocok!.",
      });
      return;
    }

    startTransition(async () => {
      const res = await deleteClass(classId);

      if (!res.success) {
        context?.setPopupState({
          isShow: true,
          title: "Gagal!",
          message: "Gagal menghapus kelas. silakan coba lagi nanti.",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="card my-1 p-3" style={{ minWidth: 300 }} key={i}>
        <div className="d-flex align-items-center">
          <strong role="status">Sedang menghapus kelas ini...</strong>
          <div className="spinner-border ms-auto" aria-hidden="true"></div>
        </div>
      </div>
    );
  }

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

          <DeleteComponent
            classId={item._id}
            className={item.className}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
