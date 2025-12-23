"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    axios.get("/api/student/" + params.idKelas).then((res) => {
      setStudents(res.data.data.students);
    });
  }, [params]);

  const handleAddStudent = () => {
    axios
      .post("/api/student/" + params.idKelas, { name: studentName })
      .then((res) => {
        setStudents([...students, res.data.data.newStudent]);
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
      .then((res) => {
        setStudents(
          students.map((student) =>
            student._id === studentId
              ? { ...student, name: studentName }
              : student,
          ),
        );
      });

    setStudentName("");
  };

  const handleEditClick = (studentId: string, studentName: string) => {
    setStudentId(studentId);
    setStudentName(studentName);
    setIsEditing(true);
  };

  const handleDelete = (studentId: string) => {
    if (confirm("Yakin ingin menghapus data siswa ini?")) {
      axios
        .delete(`/api/student/${params.idKelas}/${studentId}`)
        .then((res) => {
          setStudents(students.filter((student) => student._id !== studentId));
        });
    }
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
            <li className="list-group-item">Tidak ada siswa</li>
          )}
        </ul>
      </main>
    </div>
  );
}
