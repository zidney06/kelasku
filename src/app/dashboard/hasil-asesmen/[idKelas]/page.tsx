"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

interface Asesment {
  _id: string;
  name: string;
  date: Date;
  description: string;
  asesmentResults: string[];
}

export default function HasilPresensiPage() {
  const [asesments, setAsesments] = useState<Asesment[]>([]);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/asesment/${params.idKelas}`)
      .then((res) => {
        setAsesments(res.data.data.asesments);
      })
      .catch((error) => {
        console.error(error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal mengambil data hasil asesmen!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      });
  }, [params]);

  const fetchDeleteAsesment = (id: string) => {
    axios
      .delete(`/api/asesment/${params.idKelas}/${id}`)
      .then((res) => {
        setAsesments(
          asesments.filter(
            (asesment) => asesment._id !== res.data.data.deletedAsesmentId,
          ),
        );
      })
      .catch((error) => {
        console.error(error);
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
      });
  };

  const handleDelete = (id: string) => {
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
                fetchDeleteAsesment(id);
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
    <div className="container-fluid p-0">
      <main className="p-1">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>

        <h5></h5>

        <h5>Pilih Asesmen</h5>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Deskripsi</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {asesments.map((asesment: Asesment, i) => (
              <tr key={i}>
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
                    <Link
                      href={`/dashboard/hasil-asesmen/${params.idKelas}/asesmen/${asesment._id}`}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(asesment._id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
