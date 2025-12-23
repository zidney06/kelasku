"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface IAsesmentResult {
  _id: string;
  studentName: string;
  score: number;
}

export default function AsesmenPage() {
  const [asesmentResults, setAsesmentResults] = useState<IAsesmentResult[]>([]);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/asesment/${params.idKelas}/${params.idAsesmen}`)
      .then((res) => {
        console.log(res.data);
        setAsesmentResults(res.data.data.asesmentResults);
      });
  }, [params]);

  console.log(asesmentResults);

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
              <td>{result.studentName}</td>
              <td>{result.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
