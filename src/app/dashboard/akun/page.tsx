export const dynamic = "force-dynamic";

import Link from "next/link";
import { getUserData } from "../../../actions/akunAct/actions";
import z from "zod";
import Image from "next/image";
import SubscriptionComponent from "@/components/akunComponents/SubscriptionComponent";

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  tier: z.string(),
  image: z.string(),
  lastOrderId: z.string().optional(),
});

export default async function AkunPage() {
  const res = await getUserData();
  let error: string = "";
  let user: z.infer<typeof userSchema> = {
    name: "",
    email: "",
    tier: "",
    image: "",
  };

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

  if (error) {
    return (
      <div className="container-fluid p-2">
        <main className="">
          <Link href="/dashboard" className="btn btn-info text-light">
            <i className="bi bi-arrow-return-left"></i>
          </Link>
          <div className="row my-2">
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container-fluid p-2">
      <main className="">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <div className="row my-2">
          <div className="">
            <div className="border p-2 rounded d-flex justify-content-center">
              <div className="align-center text-center">
                <h5 className="">Detail Akun</h5>
                <Image
                  src={user.image}
                  className="rounded-circle mb-2"
                  alt="Profile Image"
                  width={100}
                  height={100}
                />
                <p className="">Nama: {user.name}</p>
                <p className="">Email: {user.email}</p>
                <p className="">Tier: {user.tier}</p>
                <SubscriptionComponent />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
