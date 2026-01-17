"use client";

import { useState, useRef } from "react";
import { createClass } from "@/actions/dasboardAct/actions";
import { confirmAlert } from "react-confirm-alert";

export default function AddClassModal() {
  const classNameRef = useRef<HTMLInputElement>(null);
  const subjectNameRef = useRef<HTMLInputElement>(null);
  const semesterRef = useRef<HTMLSelectElement>(null);

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

    const data = {
      className: classNameRef.current.value,
      subjectName: subjectNameRef.current.value,
      semester: semesterRef.current.value,
    };

    createClass(data).then((res) => console.log(res));

    classNameRef.current.value = "";
    subjectNameRef.current.value = "";
    semesterRef.current.value = "";

    return;
  };

  return (
    <>
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
              <button
                className="btn btn-primary"
                // data-bs-dismiss="modal"
                id="closeModal"
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
