"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";

interface IClass {
  _id: string;
  className: string;
  subjectName: string;
  semester: string;
  students: [];
}

export default function DashboardPage() {
  const [classList, setClassList] = useState<IClass[]>([]);
  const [username, setUsername] = useState("user");

  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [semester, setSemester] = useState("");
  const [classId, setClassId] = useState("");
  const [requiredClassName, setRequiredClassName] = useState("");
  const [inputedClassName, setInputedClassName] = useState("");

  useEffect(() => {
    axios
      .get("/api/kelas")
      .then((res) => {
        setUsername(res.data.data.username);
        setClassList(res.data.data.classes);
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3" style={{ minWidth: 300 }}>
              <h3>Error!</h3>
              <p>Gagal mengambil data kelas!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  }, []);

  const handleDeleteClick = (classId: string, className: string) => {
    setClassId(classId);
    setRequiredClassName(className);
  };

  const resetDeleteModal = () => {
    setClassId("");
    setRequiredClassName("");
    setInputedClassName("");
  };

  const handleConfirm = () => {
    if (!className || !subjectName || !semester) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3" style={{ minWidth: 300 }}>
            <h3>Error!</h3>
            <p>Isi semua field!!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }

    axios
      .post("/api/kelas", {
        className,
        subjectName,
        semester,
      })
      .then((res) => {
        setClassList([...classList, res.data.data.newClass]);
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal membuat kelas!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });

    setClassName("");
    setSubjectName("");
    setSemester("");
  };

  const handleDelete = () => {
    if (inputedClassName === requiredClassName) {
      axios
        .delete(`/api/kelas/${classId}`)
        .then((res) => {
          setClassList(
            classList.filter(
              (item) => item._id !== res.data.data.deletedClassId,
            ),
          );
        })
        .catch((error) => {
          console.error(error);
          confirmAlert({
            customUI: ({ onClose }) => (
              <div className="border rounded p-3">
                <h3>Error!</h3>
                <p>Gagal menghapus kelas!</p>
                <button className="btn btn-primary" onClick={onClose}>
                  Oke
                </button>
              </div>
            ),
          });
        });
    } else {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Input tidak sesuai!!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
    }
    resetDeleteModal();
  };

  return (
    <div className="container-fluid p-0">
      <main className="p-2">
        <p>Halo {username}, selamat Datang</p>

        <h5 className="m-0">
          Buat Kelas Baru?{" "}
          <i
            className="bi bi-plus-lg btn btn-outline-dark"
            data-bs-toggle="modal"
            data-bs-target="#kelasBaru"
          ></i>
        </h5>

        <div
          className="modal fade"
          id="kelasBaru"
          tabIndex={-1}
          aria-labelledby="kelasBaruLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="kelasBaruLabel">
                  Buat Kelas Baru
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form className="mb-4">
                  <label htmlFor="className" className="form-label">
                    Nama kelas
                  </label>
                  <input
                    type="text"
                    id="className"
                    placeholder="Nama kelas"
                    className="form-control"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                  <label htmlFor="subjectName" className="form-label">
                    Mata pelajaran
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    placeholder="Nama mata pelajaran"
                    className="form-control"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                  <select
                    className="form-select mt-2"
                    aria-label="semester"
                    onChange={(e) => setSemester(e.target.value)}
                    value={semester}
                  >
                    <option value="">Pilih semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Tutup
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

        {/*modal delete*/}
        <div
          className="modal fade"
          id="confirmDelete"
          tabIndex={-1}
          aria-labelledby="confirmDeleteLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="confirmDeleteLabel">
                  Yakin?
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Ketikan nama kelas <strong>{requiredClassName}</strong>
                </p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama kelas"
                  value={inputedClassName}
                  onChange={(e) => setInputedClassName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetDeleteModal}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => handleDelete()}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-4">Daftar kelas</h2>

        <div className="row cols-md-2 p-2 g-2">
          {classList.length > 0 ? (
            classList.map((item: IClass, i) => (
              <div
                className="card my-2 mx-sm-2"
                style={{ maxWidth: 500, minWidth: 300 }}
                key={i}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.className}</h5>

                  <p>Jumlah siswa: {item.students.length}</p>
                  <p>Mata pelajaran: {item.subjectName}</p>
                  <p>Semester: {item.semester}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Aksi
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            href={"/dashboard/daftar-siswa/" + item._id}
                            className="dropdown-item"
                          >
                            Daftar Siswa
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/presensi/" + item._id}
                            className="dropdown-item"
                          >
                            presensi
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/asesmen/" + item._id}
                            className="dropdown-item"
                          >
                            Asesmen
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/statistik-siswa/" + item._id}
                            className="dropdown-item"
                          >
                            Statistik Siswa
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/hasil-asesmen/" + item._id}
                            className="dropdown-item"
                          >
                            Hasil Asesmen
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDelete"
                      onClick={() =>
                        handleDeleteClick(item._id, item.className)
                      }
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mx-auto">
              <div className="card my-2 mx-sm-2">
                <div className="card-body">
                  <h5 className="card-title m-0 text-center">
                    Belum ada kelas
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
