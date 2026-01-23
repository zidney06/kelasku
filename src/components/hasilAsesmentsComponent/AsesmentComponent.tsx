"use client";

import { deleteAsesment } from "@/actions/hasilAsesmentAct/actions";
import Link from "next/link";
import { useTransition } from "react";
import { confirmAlert } from "react-confirm-alert";

interface Asesment {
  _id: string;
  name: string;
  date: Date;
  description: string;
  asesmentResults: string[];
}

export default function AsesmentComponent({
  asesment,
  i,
  idKelas,
}: {
  asesment: Asesment;
  i: number;
  idKelas: string;
}) {
  const [isLoading, startTransition] = useTransition();

  const fetchDeleteAsesment = () => {
    startTransition(async () => {
      const res = await deleteAsesment(idKelas, asesment._id);

      if (!res.success) {
        console.error(res.msg);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal menghapus data hasil asesmen!</p>
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
        <div className="border rounded p-3 mx-3" style={{ width: "300px" }}>
          <h3>Info!</h3>
          <p>Apakah anda yakin mau menghapus data hasil asesmen?</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={onClose}>
              batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchDeleteAsesment();
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
    <tr>
      <th scope="row">{i + 1}</th>
      <td>{asesment.name}</td>
      <td>
        {new Date(asesment.date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Jakarta",
        })}
      </td>
      <td>{asesment.description}</td>
      <td className="p-0">
        <div className="d-md-flex justify-content-around mx-auto">
          {isLoading ? (
            <p className="text-center m-0">Sedang menghapus...</p>
          ) : (
            <>
              <Link
                href={`/dashboard/hasil-asesmen/${idKelas}/asesmen/${asesment._id}`}
                className="btn btn-primary"
              >
                <i className="bi bi-box-arrow-right"></i>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete()}>
                <i className="bi bi-trash3"></i>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
