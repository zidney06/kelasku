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

export default function NilaiSiswaComponent({
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
      <h3>Nilai rata-rata siswa</h3>

      <button
        className="btn btn-primary my-2"
        onClick={() => setIsPresence(!isPresence)}
      >
        Presensi
      </button>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nama</th>
            <th scope="col">Rata-rata</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: IStudent, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{student.name}</td>
              <td>{student.average.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
