"use client";

import { useState } from "react";
import StudentComponnent from "@/components/daftarSiswaComponents/StudentComponent";
import StudentModal from "@/components/daftarSiswaComponents/StudentModal";

interface IStudent {
  _id: string;
  name: string;
}

export default function ({
  students,
  idKelas,
}: {
  students: IStudent[];
  idKelas: string;
}) {
  const [studentId, setStudentId] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <h5 className="m-0">
        Tambah Siswa
        <i
          className="bi bi-plus-lg btn btn-outline-dark mx-1"
          data-bs-toggle="modal"
          data-bs-target="#siswa"
        ></i>
      </h5>
      <StudentModal
        studentId={studentId}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        idKelas={idKelas}
      />

      <h3>Daftar Siswa</h3>
      <ul className="list-group mx-auto">
        {students.length > 0 ? (
          students.map((std: IStudent) => (
            <StudentComponnent
              student={std}
              setIsEdit={setIsEdit}
              idKelas={idKelas}
              setStudentId={setStudentId} // ini buat pas editSiswa
              key={std._id}
            />
          ))
        ) : (
          <li className="list-group-item text-center">Tidak ada siswa</li>
        )}
      </ul>
    </>
  );
}
