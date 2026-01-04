"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";

interface ISubAsesmentResult {
  _id: string;
  name: string;
}

interface IAsesmentResult {
  _id: string;
  studentData: ISubAsesmentResult;
  score: number;
}

export default function AsesmenPage() {
  const [asesmentResults, setAsesmentResults] = useState<IAsesmentResult[]>([]);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/asesment/${params.idKelas}/${params.idAsesmen}`)
      .then((res) => {
        setAsesmentResults(res.data.data.asesmentResults);
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

  return (
    <div className="container-fluid p-2">
      <Link
        href={`/dashboard/hasil-asesmen/${params.idKelas}`}
        className="btn btn-info text-light"
      >
        <i className="bi bi-arrow-return-left"></i>
      </Link>
      <h5>Hasil asesmen</h5>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nama</th>
            <th scope="col">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {asesmentResults.map((result, index) => (
            <tr key={result._id}>
              <th scope="row">{index + 1}</th>
              <td>{result.studentData.name}</td>
              <td>{result.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
