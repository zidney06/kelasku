"use client";

import { confirmAlert } from "react-confirm-alert";
import { useRef } from "react";

export default function DeleteComponent({
  classId,
  className,
  handleDelete,
}: {
  classId: string;
  className: string;
  handleDelete: (
    inputValue: string,
    className: string,
    classId: string
  ) => void;
}) {
  const classNameRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="border rounded p-3" style={{ minWidth: 300 }}>
          <h3>Yakin?</h3>
          <div className="my-1">
            <label htmlFor="className">Masukan nama kelas: {className}</label>
            <input
              type="text"
              className="form-control"
              id="className"
              autoComplete="off"
              ref={classNameRef}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={onClose}>
              Batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleDelete(classNameRef.current!.value, className, classId);
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
    <>
      <button className="btn btn-danger" onClick={handleBtnClick}>
        <i className="bi bi-trash3"></i>
      </button>
    </>
  );
}
