"use client";

import { useRef, useTransition } from "react";
import { createClass } from "@/actions/dasboardAct/actions";
import { confirmAlert } from "react-confirm-alert";

export default function AddClassComponent() {
  const classNameRef = useRef<HTMLInputElement>(null);
  const subjectNameRef = useRef<HTMLInputElement>(null);
  const semesterRef = useRef<HTMLSelectElement>(null);
  /*
  memakai useTransition agar UX jadi lebih bagus
  isLoading bernilai boolean. jika req berlangsung dia bernilai true, jika selesai false.
  function stratTransition bisa diganti namanya sesuai keinginan.
  */
  const [isLoading, startTransition] = useTransition();

  const handleConfirm = () => {
    if (
      !classNameRef.current ||
      !subjectNameRef.current ||
      !semesterRef.current
    )
      return;

    if (
      !classNameRef.current.value ||
      !subjectNameRef.current.value ||
      !semesterRef.current.value
    ) {
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

    const smt = Number(semesterRef.current.value);

    if (smt < 1 && smt > 2) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3" style={{ minWidth: 300 }}>
            <h3>Error!</h3>
            <p>Semester hanya boleh dalam rentang 1 atau 2!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }

    const data = {
      className: classNameRef.current.value,
      subjectName: subjectNameRef.current.value,
      semester: semesterRef.current.value,
    };

    startTransition(async () => {
      const res = await createClass(data);

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
        return;
      }
      classNameRef.current!.value = "";
      subjectNameRef.current!.value = "";
      semesterRef.current!.value = "";
    });

    return;
  };

  return (
    <>
      <div className="border p-2 rounded">
        <div className="">
          <h1 className=" fs-5" id="kelasBaruLabel">
            Buat Kelas Baru
          </h1>
        </div>
        <div className="">
          <form className="mb-4" id="addClassForm">
            <label htmlFor="className" className="form-label">
              Nama kelas
            </label>
            <input
              type="text"
              id="className"
              ref={classNameRef}
              placeholder="Nama kelas"
              className="form-control"
              required
              name="className"
            />
            <label htmlFor="subjectName" className="form-label">
              Mata pelajaran
            </label>
            <input
              type="text"
              id="subjectName"
              ref={subjectNameRef}
              placeholder="Nama mata pelajaran"
              className="form-control"
              required
              name="subjectName"
            />
            <select
              className="form-select mt-2"
              aria-label="semester"
              ref={semesterRef}
              name="semester"
            >
              <option value="">Pilih semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </form>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            id="closeModal"
            onClick={handleConfirm}
            disabled={isLoading} // disable saat sedang melakukan request
          >
            {isLoading ? "Membuat..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </>
  );
}
