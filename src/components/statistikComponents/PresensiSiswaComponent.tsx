"use client";

import { Dispatch, SetStateAction } from "react";

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

export default function PresensiSiswaComponent({
  students,
  isPresence,
  setIsPresence,
}: {
  students: IStudent[];
  isPresence: boolean;
  setIsPresence: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div>
      <h3>Hasil Presensi</h3>

      <button
        className="btn btn-primary my-2"
        onClick={() => setIsPresence(!isPresence)}
      >
        Nilai rata-rata siswa
      </button>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nama</th>
            <th scope="col">Hadir</th>
            <th scope="col">Izin</th>
            <th scope="col">Alpha</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: IStudent, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{student.name}</td>
              <td>{student.attendance}</td>
              <td>{student.permission}</td>
              <td>{student.absence}</td>
              <td>
                {student.absence + student.permission + student.attendance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
