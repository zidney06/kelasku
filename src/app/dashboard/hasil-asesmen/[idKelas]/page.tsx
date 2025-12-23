"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    axios.get(`/api/asesment/${params.idKelas}`).then((res) => {
      setAsesments(res.data.data.asesments);
    });
  }, [params]);

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus asesmen ini?")) {
      axios.delete(`/api/asesment/${params.idKelas}/${id}`).then((res) => {
        setAsesments(
          asesments.filter(
            (asesment) => asesment._id !== res.data.data.deletedAsesmentId,
          ),
        );
      });
    }
  };

  return (
    <div className="container-fluid p-0">
      <main className="p-2">
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
                <td className="d-flex justify-content-between">
                  <Link
                    href={`/dashboard/hasil-asesmen/${params.idKelas}/asesmen/${asesment._id}`}
                    className="btn btn-primary"
                  >
                    Lihat
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(asesment._id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
