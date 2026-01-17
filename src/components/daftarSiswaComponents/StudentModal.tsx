"use client";

import {
  addStudentToClass,
  editStudent,
} from "@/actions/studentListAct/actions";
import { Dispatch, SetStateAction, useRef } from "react";
import { confirmAlert } from "react-confirm-alert";

export default function StudentModal({
  studentId,
  isEdit,
  idKelas,
  setIsEdit,
}: {
  studentId: string;
  isEdit: boolean;
  idKelas: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const studentNameRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    if (!studentNameRef.current?.value.trim()) {
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

    if (!isEdit) {
      addStudentToClass(
        idKelas!.toString(),
        studentNameRef.current.value.trim()
      ).then((res) => {
        if (!res.success) {
          confirmAlert({
            customUI: ({ onClose }) => (
              <div className="border rounded p-3" style={{ minWidth: 300 }}>
                <h3>Error!</h3>
                <p>{res.msg}</p>
                <button className="btn btn-primary" onClick={onClose}>
                  Oke
                </button>
              </div>
            ),
          });
        }
      });
    } else {
      editStudent(studentNameRef.current?.value, studentId, idKelas).then(
        (res) => {
          if (!res.success) {
            confirmAlert({
              customUI: ({ onClose }) => (
                <div className="border rounded p-3" style={{ minWidth: 300 }}>
                  <h3>Error!</h3>
                  <p>{res.msg}</p>
                  <button className="btn btn-primary" onClick={onClose}>
                    Oke
                  </button>
                </div>
              ),
            });
          }
        }
      );
    }

    studentNameRef.current!.value = "";
    setIsEdit(false);
  };

  return (
    <>
      <div
        className="modal fade"
        id="siswa"
        tabIndex={-1}
        aria-labelledby="siswaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="siswaLabel">
                {isEdit ? "Edit Siswa" : "Tambah Siswa"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsEdit(false)}
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="namaSiswa" className="form-label">
                Nama Siswa
              </label>
              <input
                type="text"
                id="namaSiswa"
                ref={studentNameRef}
                placeholder="Nama Siswa"
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setIsEdit(false)}
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
    </>
  );
}
