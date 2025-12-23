"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface IStudent {
  _id: string;
  name: string;
  attendance: number;
}

export default function PresensiPage() {
  const params = useParams();
  const [students, setStudents] = useState<IStudent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [isAttendanced, setIsAttendanced] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`/api/student/${params.idKelas}?isPresence=true`).then((res) => {
      setStudents(
        res.data.data.students.map((student: IStudent) => {
          return {
            _id: student._id,
            name: student.name,
            attendance: null,
          };
        }),
      );
      setIsAttendanced(res.data.data.isAttendanced);

      console.log(res.data);
    });
  }, [params]);

  console.log(isAttendanced);

  const handleHadirSemua = () => {
    const updatedStudents = students.map((siswa) => ({
      ...siswa,
      attendance: 1,
    }));

    setStudents(updatedStudents);
  };

  const updateStatus = (index: number, status: number) => {
    const newStudents = [...students];
    newStudents[index].attendance = status;
    setStudents(newStudents);
  };

  const handleKonfirmasi = () => {
    const belumAbsen = students.some((s) => s.attendance === null);
    if (belumAbsen) {
      alert("Ada siswa yang belum dipilih status kehadirannya!");
      return;
    }

    axios
      .post(`/api/student/${params.idKelas}/presensi`, { students })
      .then((res) => {
        console.log(res.data);
        setIsAttendanced(res.data.data.isAttendanced);
      });
  };

  console.log(students);

  return (
    <div className="container-fluid p-0">
      <main className="p-2">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <h1>Presensi</h1>
        <p>
          Presensi tanggal
          {" " +
            date.toLocaleDateString("id-ID", {
              timeZone: "Asia/Jakarta",
              dateStyle: "full",
            })}
        </p>
        {!isAttendanced ? (
          <div>
            <button
              className="btn btn-primary text-light my-2"
              onClick={handleHadirSemua}
            >
              Hadir semua
            </button>
            <ul className="list-group mx-auto" style={{ maxWidth: 700 }}>
              {students.map((siswa, i) => (
                <li
                  className="list-group-item d-md-flex justify-content-between align-items-center"
                  key={i}
                >
                  <p className="mb-0">{siswa.name}</p>
                  <div className="d-flex gap-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={"presensi" + i}
                        value="hadir"
                        id={"hadir" + i}
                        checked={siswa.attendance === 1}
                        onChange={() => updateStatus(i, 1)}
                      />
                      <label className="form-check-label" htmlFor={"hadir" + i}>
                        Hadir
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={"presensi" + i}
                        value="izin"
                        id={"izin" + i}
                        onChange={() => updateStatus(i, 2)}
                      />
                      <label className="form-check-label" htmlFor={"izin" + i}>
                        Izin
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={"presensi" + i}
                        value="alpha"
                        id={"alpha" + i}
                        onChange={() => updateStatus(i, 3)}
                      />
                      <label className="form-check-label" htmlFor={"alpha" + i}>
                        Alpha
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-primary text-light my-2"
              onClick={handleKonfirmasi}
            >
              Konfirmasi
            </button>
          </div>
        ) : (
          <p className="border text-center p-2">Hari ini sudah diabsen!</p>
        )}
      </main>
    </div>
  );
}
