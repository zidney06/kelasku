"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";

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

export default function HasilPresensiPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [isPresence, setIsPresence] = useState<boolean>(true);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/student/${params.idKelas}`)
      .then((res) => {
        setStudents(res.data.data.students);
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal mengambil data siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  }, [params]);

  return (
    <div className="p-2">
      <Link href="/dashboard" className="btn btn-info text-light mb-2">
        <i className="bi bi-arrow-return-left"></i>
      </Link>

      {isPresence ? (
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
      ) : (
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
      )}
    </div>
  );
}
