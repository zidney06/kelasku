"use client";

import { useState } from "react";
import StudentComponnent from "@/components/daftarSiswaComponents/StudentComponent";
import CreateStudentComponent from "@/components/daftarSiswaComponents/CreateStudentComponent";

interface IStudent {
  _id: string;
  name: string;
}

export default function Container({
  students,
  idKelas,
}: {
  students: IStudent[];
  idKelas: string;
}) {
  const [studentId, setStudentId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [studentName, setStudentName] = useState("");

  return (
    <>
      <CreateStudentComponent
        studentId={studentId}
        isEdit={isEdit}
        studentName={studentName}
        setStudentName={setStudentName}
        setIsEdit={setIsEdit}
        idKelas={idKelas}
      />

      <h3>Daftar Siswa</h3>
      <ul className="list-group mx-auto">
        {students.length > 0 ? (
          students.map((std: IStudent) => (
            <StudentComponnent
              student={std}
              setStudentName={setStudentName}
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
