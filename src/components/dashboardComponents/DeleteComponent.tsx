"use client";

import { confirmAlert } from "react-confirm-alert";
import DeleteClassModal from "./DeleteClassModal";
import { useContext, useRef } from "react";
import { PopupContext } from "@/context/AppContext";
import { deleteClass } from "@/actions/dasboardAct/actions";

export default function DeleteComponent({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) {
  const classNameRef = useRef<HTMLInputElement>(null);
  const context = useContext(PopupContext);

  const handleDelete = () => {
    if (classNameRef.current?.value !== className) {
      context?.setPopupState({
        isShow: true,
        title: "OOps!",
        message: "Input tidak cocok!.",
      });
      return;
    }
    deleteClass(classId).then((res) => {
      if (!res.success) {
        context?.setPopupState({
          isShow: true,
          title: "Gagal!",
          message: "Gagal menghapus kelas. silakan coba lagi nanti.",
        });
      }
      console.log(res);
    });
  };

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
                handleDelete();
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
      <DeleteClassModal classId={classId} className={className} />
      <button className="btn btn-danger" onClick={handleBtnClick}>
        <i className="bi bi-trash3"></i>
      </button>
    </>
  );
}
