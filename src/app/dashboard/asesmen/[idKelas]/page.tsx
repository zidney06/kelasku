"use client";

import { useParams } from "next/navigation";
import { type KeyboardEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

interface IStudent {
  _id: string;
  name: string;
  score: number;
}

export default function InputNilaiPage() {
  const [asesmenName, setAsesmenName] = useState<string>("");
  const [asesmenDescription, setAsesmenDescription] = useState<string>("");
  const [students, setStudents] = useState<IStudent[]>([]);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/student/${params.idKelas}`)
      .then((res) => {
        setStudents(
          res.data.data.students.map((student: IStudent) => {
            return {
              _id: student._id,
              name: student.name,
              score: 0,
            };
          }),
        );
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal mengambil daftar data siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  }, [params]);

  const blockInvalidChar = (event: KeyboardEvent<HTMLInputElement>) => {
    const blockedChars = ["e", "E", "+", "-"];

    if (blockedChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  const hndlNilai = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);

    const newStudents = [...students];

    newStudents[index].score = value;

    if (value < 0) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Minimal nilai adalah 0!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      newStudents[index].score = 0;
    } else if (value > 100) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Nilai maksimal adalah 100!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      newStudents[index].score = 100;
    }
    setStudents(newStudents);
  };

  const fetchInputNilai = () => {
    axios
      .post(`/api/student/${params.idKelas}/input-nilai`, {
        results: students,
        asesmenName,
        asesmenDescription,
      })
      .then((res) => {
        console.log(res.data);

        const newStudents = [...students];

        setStudents(
          newStudents.map((student) => {
            return {
              _id: student._id,
              name: student.name,
              score: 0,
            };
          }),
        );

        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Berhasil Input Nilai!</h3>
              <p>Berhasil menginput nilai!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });

        setAsesmenName("");
        setAsesmenDescription("");
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menginput nilai!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  };

  const handleKonfirmasi = () => {
    if (!asesmenName.trim()) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Nama asesmen tidak boleh kosong!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="border rounded p-3">
          <h3>Info!</h3>
          <p className="mb-0">Apakah anda sudah yakin?</p>
          <p>Pastikan semua nilai telah diinputkan dengan benar</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={onClose}>
              batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchInputNilai();
                onClose();
              }}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="p-2">
      <Link href="/dashboard" className="btn btn-info text-light">
        <i className="bi bi-arrow-return-left"></i>
      </Link>
      <h1>Buat asesmen atau tugas</h1>

      <form className="mb-3">
        <label htmlFor="namaAsesmen">Nama Tugas:</label>
        <input
          type="text"
          id="namaAsesmen"
          placeholder="Nama tugas"
          className="form-control"
          style={{ width: 250 }}
          value={asesmenName}
          autoComplete="off"
          onChange={(e) => setAsesmenName(e.target.value)}
        />
        <label htmlFor="deskripsiTugas" className="form-label">
          Deskripsi Tugas{" "}
          <i>
            <span>opsional. Akan diisi otomatis oleh sistem</span>
          </i>
          :
        </label>
        <textarea
          id="deskripsiTugas"
          placeholder="Deskripsi tugas max 150 karakter"
          className="form-control"
          maxLength={150}
          style={{ width: 250, height: 150 }}
          value={asesmenDescription}
          onChange={(e) => setAsesmenDescription(e.target.value)}
        />
      </form>
      <ul className="list-group">
        {students.map((student: IStudent, i) => (
          <li
            className="list-group-item d-sm-flex justify-content-between align-items-center"
            key={i}
          >
            <p className="">{student.name}</p>

            <div className="justify-content-end d-md-flex">
              <input
                type="number"
                placeholder="Nilai"
                className="form-control"
                style={{ width: 200 }}
                onKeyDown={blockInvalidChar}
                value={student.score.toString()}
                onChange={(e) => hndlNilai(e, i)}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-end px-2">
        <button
          className="btn btn-primary text-light my-2"
          onClick={handleKonfirmasi}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
