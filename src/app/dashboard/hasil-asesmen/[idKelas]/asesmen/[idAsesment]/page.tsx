import { getAsesmentResults } from "@/actions/hasilAsesmentAct/actions";
import Link from "next/link";
import z from "zod";

const stdDataSchema = z.object({
  name: z.string(),
});

const asmntResultSchema = z.object({
  _id: z.string(),
  studentData: stdDataSchema,
  score: z.number(),
});

const asmntResultsSchema = z.array(asmntResultSchema);

export default async function AsesmenPage({
  params,
}: {
  params: Promise<{ idKelas: string; idAsesment: string }>;
}) {
  const { idKelas, idAsesment } = await params;
  let error: string = "";
  let asesmentResults: z.infer<typeof asmntResultsSchema> = [];

  const res = await getAsesmentResults(idKelas, idAsesment);

  if (!res.success) {
    error = res.msg;
  } else {
    const parsedData = asmntResultsSchema.safeParse(res.data);

    if (!parsedData.success) {
      console.error(parsedData.error);
      error = "Gagal validasi zod";
    } else {
      asesmentResults = parsedData.data;
    }
  }

  return (
    <div className="container-fluid p-2">
      <Link
        href={`/dashboard/hasil-asesmen/${idKelas}`}
        className="btn btn-info text-light"
      >
        <i className="bi bi-arrow-return-left"></i>
      </Link>
      <h5>Hasil asesmen</h5>
      {error && <p>Gagal mendapatkan data hasil asesment</p>}
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
