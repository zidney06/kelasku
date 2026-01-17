"use client";

import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";

export default function DeleteClassModal({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) {
  const [inputedClassName, setInputedClassName] = useState("");

  const handleDelete = () => {
    if (inputedClassName !== className) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3" style={{ minWidth: 300 }}>
            <h3>Error!</h3>
            <p>Input tidak sesuai!!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      setInputedClassName("");
      return;
    }

    console.log("delete", inputedClassName, className);

    return;
  };

  return (
    <>
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
                Ketikan nama kelas <strong>{className}</strong>
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
                onClick={() => setInputedClassName("")}
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
    </>
  );
}
