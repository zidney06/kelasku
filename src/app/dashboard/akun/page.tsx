import Link from "next/link";
import { getUserData } from "./actions";
import z from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  tier: z.string(),
});

export default async function AkunPage({ params }: { params: { id: string } }) {
  const res = await getUserData();
  let error: string = "";
  let user: z.infer<typeof userSchema> = { name: "", email: "", tier: "" };

  const parsedData = userSchema.safeParse(res.data);

  if (!res.success) {
    error = "Gagal mengambil data user";
  } else {
    const parsedData = userSchema.safeParse(res.data);

    if (!parsedData.success) {
      console.error(parsedData.error);
      error = "Gagal validasi zod";
    } else {
      user = parsedData.data;
    }
  }

  return (
    <div className="container-fluid p-2">
      <main className="">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <div className="row my-2">
          <div className="col-md-6">
            <h3>Informasi Akun</h3>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Detail Akun</h5>
                <p className="card-text">Nama: {user.name}</p>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Tier: {user.tier}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
