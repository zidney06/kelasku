"use client";

import {
  addStudentToClass,
  editStudent,
} from "@/actions/studentListAct/actions";
import { Dispatch, SetStateAction, useTransition } from "react";
import { confirmAlert } from "react-confirm-alert";

export default function CreateStudentComponent({
  studentId,
  isEdit,
  idKelas,
  setIsEdit,
  studentName,
  setStudentName,
}: {
  studentId: string;
  isEdit: boolean;
  idKelas: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  studentName: string;
  setStudentName: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, startTransition] = useTransition();

  const handleConfirm = async () => {
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

    if (!isEdit) {
      startTransition(async () => {
        const res = await addStudentToClass(
          idKelas!.toString(),
          studentName.trim()
        );

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
      startTransition(async () => {
        const res = await editStudent(studentName.trim(), studentId, idKelas);
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
    }

    setStudentName("");
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setStudentName("");
  };

  return (
    <>
      <div className="" id="siswa">
        <div className="p-2 border rounded my-2">
          <div className="">
            <h1 className=" fs-5" id="siswaLabel">
              {isEdit ? "Edit Siswa" : "Tambah Siswa"}
            </h1>
          </div>
          <div className="">
            <label htmlFor="namaSiswa" className="form-label">
              {isEdit ? "Edit Nama Siswa" : "Nama Siswa"}
            </label>
            <input
              type="text"
              id="namaSiswa"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama Siswa"
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-between p-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading
                ? "Memproses..."
                : isEdit
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
