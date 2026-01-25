"ise client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div
      className="d-flex align-items-center justify-content-between gap-2 bg-primary py-2 px-2 px-md-4"
      style={{ fontSize: ".9rem" }}
    >
      <Link
        href="/"
        className="text-light text-decoration-none d-flex align-items-center gap-2"
      >
        <Image
          src="/KelasKu.svg" // path otomatis mengarah ke folder public
          alt="Logo Produk"
          width={40}
          height={40}
          priority // untuk menandai gambar yang sangat penting (seperti hero image atau logo) agar dimuat lebih dulu (pra-muat/pre-load) oleh browser
        />
        <h3 className="m-0">KelasKu</h3>
      </Link>

      <Link href="/dashboard/akun" className="text-light text-decoration-none">
        <pre className="fs-6 m-0">
          <i className="bi bi-person-circle"></i> Akun{" "}
        </pre>
      </Link>
    </div>
  );
}
