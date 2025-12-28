"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

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

export default function AkunPage() {
  const params = useParams();

  const [studentName, setStudentName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    axios
      .get("/api/student/" + params.idKelas)
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

  const handleAddStudent = () => {
    if (!studentName.trim()) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Nama siswa tidak boleh kosong!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }
    axios
      .post("/api/student/" + params.idKelas, { name: studentName })
      .then((res) => {
        setStudents([...students, res.data.data.newStudent]);
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menambahkan siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });

    setStudentName("");
  };

  const handleConfirm = () => {
    if (isEditing) {
      handleEditStudent(studentId);
    } else {
      handleAddStudent();
    }
  };

  const handleEditStudent = (studentId: string) => {
    axios
      .patch(`/api/student/${params.idKelas}/${studentId}`, {
        name: studentName,
      })
      .then(() => {
        setStudents(
          students.map((student) =>
            student._id === studentId
              ? { ...student, name: studentName }
              : student,
          ),
        );
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal mengedit data siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });

    setStudentName("");
  };

  const handleEditClick = (studentId: string, studentName: string) => {
    setStudentId(studentId);
    setStudentName(studentName);
    setIsEditing(true);
  };

  const deleteSiswa = (studentId: string) => {
    axios
      .delete(`/api/student/${params.idKelas}/${studentId}`)
      .then(() => {
        setStudents(students.filter((student) => student._id !== studentId));
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menghapus data siswa!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  };

  const handleDelete = (studentId: string) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="border rounded p-3" style={{ width: "300px" }}>
          <h3>Info!</h3>
          <p className="mb-0">Apakah anda yakin?</p>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-danger" onClick={onClose}>
              batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                deleteSiswa(studentId);
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
    <div className="container-fluid px-0">
      <main className="p-2">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <h5 className="m-0">
          Tambah Siswa?
          <i
            className="bi bi-plus-lg btn btn-outline-dark mx-1"
            data-bs-toggle="modal"
            data-bs-target="#siswaBaru"
          ></i>
        </h5>

        <div
          className="modal fade"
          id="siswaBaru"
          tabIndex={-1}
          aria-labelledby="siswaBaruLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="siswaBaruLabel">
                  {isEditing ? "Edit Siswa" : "Tambah Siswa"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsEditing(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form className="mb-4">
                  <label htmlFor="namaSiswa" className="form-label">
                    Nama Siswa
                  </label>
                  <input
                    type="text"
                    id="namaSiswa"
                    placeholder="Nama Siswa"
                    className="form-control"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setIsEditing(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleConfirm}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
        <h3>Daftar Siswa</h3>
        <ul className="list-group mx-auto" style={{ maxWidth: 700 }}>
          {students.length > 0 ? (
            students.map((student: IStudent) => (
              <li
                key={student._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <p className="mb-0">{student.name}</p>
                <div
                  style={{ width: 100 }}
                  className="d-flex justify-content-between"
                >
                  <button
                    className="btn btn-info text-light"
                    data-bs-target="#siswaBaru"
                    data-bs-toggle="modal"
                    onClick={() => handleEditClick(student._id, student.name)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(student._id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">Tidak ada siswa</li>
          )}
        </ul>
      </main>
    </div>
  );
}
