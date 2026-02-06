import { getUserData } from "../../../actions/akunAct/actions";
import z from "zod";
import Link from "next/link";

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  tier: z.string(),
  image: z.string(),
  lastOrderId: z.string().optional(),
});

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderIdFromUrl = (await searchParams).order_id;

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
      error = "Gagal saat mengambil data user";
    } else {
      user = parsedData.data;
    }
  }

  // cek apakah user memiliki order_id yang sesuai dengan yang di URL
  if (orderIdFromUrl && user.lastOrderId !== orderIdFromUrl) {
    error = "Order ID tidak sesuai";
  }

  if (error) {
    return (
      <div className="p-0 d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <h1>EEH, BENTAR DULU</h1>
          <p>{error}</p>
          <Link href="/dashboard" className="text-decoration-none">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1>Pembayaran Berhasil</h1>
        <p>Terimakasih telah menggunakan fitur langanan kami.</p>
        <Link href="/dashboard" className="text-decoration-none">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
