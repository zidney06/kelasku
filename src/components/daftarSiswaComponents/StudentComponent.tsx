"use client";

import { deleteStudent } from "@/actions/studentListAct/actions";
import { Dispatch, SetStateAction } from "react";
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
}: {
  student: IStudent;
  setStudentId: Dispatch<SetStateAction<string>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  idKelas: string;
}) {
  const handleDeleteStudent = () => {
    deleteStudent(student._id, idKelas).then((res) => {
      if (!res.success) {
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menghapus data siswa</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      }
    });
    // axios
    //   .delete(`/api/student/${params.idKelas}/${studentId}`)
    //   .then(() => {
    //     setStudents(students.filter((student) => student._id !== studentId));
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     confirmAlert({
    //       customUI: ({ onClose }) => (
    //         <div className="border rounded p-3">
    //           <h3>Error!</h3>
    //           <p>Gagal menghapus data siswa!</p>
    //           <button className="btn btn-primary" onClick={onClose}>
    //             Oke
    //           </button>
    //         </div>
    //       ),
    //     });
    //   });
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

  return (
    <li
      key={student._id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <p className="mb-0">{student.name}</p>
      <div style={{ width: 100 }} className="d-flex justify-content-between">
        <button
          className="btn btn-info text-light"
          data-bs-target="#siswa"
          data-bs-toggle="modal"
          onClick={() => {
            setStudentId(student._id.toString());
            setIsEdit(true);
          }}
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-danger" onClick={() => handleDelete()}>
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    </li>
  );
}
