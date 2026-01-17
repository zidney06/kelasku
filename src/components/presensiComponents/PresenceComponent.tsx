"use client";

import { setStudentsAttendance } from "@/actions/presenceAct/actions";
import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";

interface IStudent {
  _id: string;
  name: string;
  attendanceStatus: number;
}

interface IStds {
  _id: string;
  name: string;
  attendanceStatus: number;
}

interface Props {
  stds: IStds[];
  idKelas: string;
}

export default function PresenceComponent({ stds, idKelas }: Props) {
  const [students, setStudents] = useState<IStudent[]>(stds);

  const handleHadirSemua = () => {
    const updatedStudents = students.map((siswa) => ({
      ...siswa,
      attendanceStatus: 1,
    }));

    setStudents(updatedStudents);
  };

  const updateStatus = (index: number, status: number) => {
    const newStudents = [...students];
    newStudents[index].attendanceStatus = status;
    setStudents(newStudents);
  };

  const handleKonfirmasi = () => {
    const belumAbsen = students.some((s) => s.attendanceStatus === 0);
    if (belumAbsen) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Ada siswa yang belum dipilih status kehadirannya!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }

    setStudentsAttendance(idKelas, students).then((res) => {
      if (!res.success) {
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal mengabsen siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      }
    });
  };

  return (
    <div className="">
      <button
        className="btn btn-primary text-light my-2"
        onClick={handleHadirSemua}
      >
        Hadir semua
      </button>
      <ul className="list-group">
        {students.length > 0 ? (
          students.map((siswa, i) => (
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
                    checked={siswa.attendanceStatus === 1}
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
          ))
        ) : (
          <p className="text-center border rounded p-2 mb-0">Belum ada siswa</p>
        )}
      </ul>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary text-light my-2"
          onClick={handleKonfirmasi}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
