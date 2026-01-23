"use client";

import { useRef, useState, useTransition } from "react";
import { confirmAlert } from "react-confirm-alert";
import CreateAsesmentComponent from "./CreateAsesmentComponent";
import { createAsesment } from "@/actions/asesmentAct/actions";

interface IStudent {
  _id: string;
  name: string;
  score: number;
}

export default function AsesmentComponent({
  stds,
  idKelas,
}: {
  stds: IStudent[];
  idKelas: string;
}) {
  const asesmentNameRef = useRef<HTMLInputElement>(null);
  const asesmenDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [students, setStudents] = useState<IStudent[]>(stds);
  const [isLoading, startTransition] = useTransition();

  const fetchInputNilai = () => {
    if (!asesmentNameRef.current || !asesmenDescriptionRef.current) {
      alert("Ada error element");
      return;
    }

    const requestData = {
      results: students,
      asesmentName: asesmentNameRef.current.value,
      asesmentDescription: asesmenDescriptionRef.current.value,
    };

    startTransition(async () => {
      const res = await createAsesment(idKelas, requestData);

      if (!res.success) {
        console.error(res);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menginput nilai!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
        return;
      }
      const newStudents = [...students];
      setStudents(
        newStudents.map((student) => {
          return {
            _id: student._id,
            name: student.name,
            score: 0,
          };
        })
      );
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Sukses!</h3>
            <p>{res.msg}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });

      if (!asesmentNameRef.current || !asesmenDescriptionRef.current) {
        console.error("Ada error element");
        return;
      }

      asesmentNameRef.current.value = "";
      asesmenDescriptionRef.current.value = "";
    });
  };

  const handleKonfirmasi = () => {
    if (!asesmentNameRef.current || !asesmenDescriptionRef.current) {
      alert("Ada error element");
      return;
    }

    if (!asesmentNameRef.current.value!.trim()) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Nama asesmen tidak boleh kosong!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      return;
    }

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="border rounded p-3">
          <h3>Info!</h3>
          <p className="mb-0">Apakah anda sudah yakin?</p>
          <p>Pastikan semua nilai telah diinputkan dengan benar</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={onClose}>
              batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchInputNilai();
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
      <form className="mb-3">
        <label htmlFor="namaAsesmen">Nama Tugas:</label>
        <input
          type="text"
          id="namaAsesmen"
          placeholder="Nama tugas"
          className="form-control"
          style={{ width: 250 }}
          ref={asesmentNameRef}
          autoComplete="off"
        />
        <label htmlFor="deskripsiTugas" className="form-label">
          Deskripsi Tugas{" "}
          <i>
            <span>opsional. Akan diisi otomatis oleh sistem</span>
          </i>
          :
        </label>
        <textarea
          id="deskripsiTugas"
          placeholder="Deskripsi tugas max 150 karakter"
          className="form-control"
          maxLength={150}
          style={{ width: 250, height: 150 }}
          ref={asesmenDescriptionRef}
        />
      </form>
      <ul className="list-group">
        {students.map((student: IStudent, i) => (
          <CreateAsesmentComponent
            student={student}
            students={students}
            i={i}
            setStudents={setStudents}
            key={student._id}
          />
        ))}
      </ul>
      <div className="d-flex justify-content-end px-2">
        <button
          className="btn btn-primary text-light my-2"
          onClick={handleKonfirmasi}
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Simpan Nilai"}
        </button>
      </div>
    </>
  );
}
