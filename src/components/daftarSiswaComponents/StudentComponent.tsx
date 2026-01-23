"use client";

import { deleteStudent } from "@/actions/studentListAct/actions";
import { Dispatch, SetStateAction, useTransition } from "react";
import { confirmAlert } from "react-confirm-alert";

interface IStudent {
  _id: string;
  name: string;
}

export default function StudentComponnent({
  student,
  setStudentId,
  setIsEdit,
  idKelas,
  setStudentName,
}: {
  student: IStudent;
  setStudentName: Dispatch<SetStateAction<string>>;
  setStudentId: Dispatch<SetStateAction<string>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  idKelas: string;
}) {
  const handleEdit = () => {
    setStudentName(student.name);
    setStudentId(student._id.toString());
    setIsEdit(true);
  };
  const [isLoading, startTransition] = useTransition();

  const handleDeleteStudent = () => {
    startTransition(async () => {
      const res = await deleteStudent(student._id, idKelas);

      if (!res.success) {
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
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
  };

  const handleDelete = () => {
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
                handleDeleteStudent();
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

  if (isLoading) {
    return (
      <li
        key={student._id}
        className="list-group-item d-flex justify-content-center align-items-center p-2"
      >
        <p className="m-0">
          <strong>Sedang menghapus siswa ini...</strong>
        </p>
      </li>
    );
  }

  return (
    <li
      key={student._id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <p className="mb-0">{student.name}</p>
      <div style={{ width: 100 }} className="d-flex justify-content-between">
        <button className="btn btn-info text-light" onClick={handleEdit}>
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-danger" onClick={() => handleDelete()}>
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    </li>
  );
}
