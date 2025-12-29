"use client";

import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div
        className="d-flex align-items-center gap-2 bg-primary py-2 px-2 px-md-4"
        style={{ fontSize: ".9rem" }}
      >
        <Link
          href="/"
          className="text-light text-decoration-none d-flex align-items-center gap-2"
        >
          <Image
            src="/KelasKu.svg" // Path otomatis mengarah ke folder public
            alt="Logo Produk"
            width={40} // Sesuaikan lebar
            height={40} // Sesuaikan tinggi
            priority // Tambahkan ini jika logo ada di bagian atas (LCP)
          />
          <h3 className="m-0">KelasKu</h3>
        </Link>

        <Link
          href="/dashboard/akun"
          className="text-light text-decoration-none"
        >
          {/*<i className="bi bi-person"></i>*/}
          akun
        </Link>
      </div>
      {children}
    </div>
  );
}
