"use client";

// import Image from "next/image";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="container-fluid p-0">
      <div
        className="d-flex bg-primary py-2 px-4 justify-content-between"
        data-bs-theme="dark"
        style={{ fontSize: ".9rem" }}
      >
        <div className="d-flex align-items-center gap-2">
          <Image
            src="/KelasKu.svg" // Path otomatis mengarah ke folder public
            alt="Logo Produk"
            width={40} // Sesuaikan lebar
            height={40} // Sesuaikan tinggi
            priority // Tambahkan ini jika logo ada di bagian atas (LCP)
          />
          <h3 className="text-light m-0">KelasKu</h3>

          <Link href="/dashboard" className="text-light text-decoration-none">
            Dashboard
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2">
          {session ? (
            <p
              onClick={() => signOut()}
              className="m-0 text-light"
              style={{ cursor: "pointer" }}
            >
              Sign Out
            </p>
          ) : (
            <p
              onClick={() => signIn("google")}
              className="m-0 text-light"
              style={{ cursor: "pointer" }}
            >
              Sign Up/ Sign In
            </p>
          )}
        </div>
      </div>

      <main className="p-2">
        <div
          className="d-lg-flex justify-content-around"
          style={{ height: 400 }}
        >
          <div className="col-lg-6 text-center d-flex align-items-center">
            <div>
              <h1 className="text-primary">Manajemen kelas</h1>
              <p>
                Selamat datang di aplikasi KelasKu, sebuah aplikasi yang dibuat
                untuk membantu guru dalam pekerjaannya di berbagai jenjang
                pendidikan.
              </p>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <h3 className="text-primary">Contoh aplikasinya</h3>
          </div>
        </div>
        <section>
          <h3 className="text-center text-primary">Macam-macam tier</h3>
          <div className="d-md-flex justify-content-around">
            <div
              className="card border-info my-2 mx-auto mx-md-2 w-md-45 w-100"
              style={{ maxWidth: 600 }}
            >
              {/*<Image src="" alt="Card image cap"></Image>*/}
              <div className="card-body">
                <h5 className="card-title">Free tier</h5>
                <p className="card-text m-0">Benefit: </p>
                <ul>
                  <li>Jumlah maksimal data kelas per akun = 5</li>
                  <li>Jumlah maksimum siswa per kelas = 30</li>
                </ul>
                <p>Harga: Rp 0</p>
              </div>
            </div>
            <div
              className="card border-info my-2 mx-auto mx-md-2 w-md-45 w-100"
              style={{ maxWidth: 600 }}
            >
              {/*<Image src="" alt="Card image cap"></Image>*/}
              <div className="card-body">
                <h5 className="card-title">Subscription tier</h5>
                <p className="card-text m-0">Benefit: </p>
                <ul>
                  <li>Jumlah maksimal data kelas per akun: 10</li>
                  <li>Jumlah maksimum siswa per kelas: 50</li>
                </ul>
                <p>Harga: Rp 15.000</p>
              </div>
            </div>
          </div>
        </section>
        <section className="my-5 mx-4">
          <h3 className="text-primary text-center mb-3">
            <strong>FAQ</strong>
          </h3>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Apa saja fitur utama yang tersedia di aplikasi ini?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  Aplikasi kami menyediakan tiga pilar utama manajemen kelas:
                  Presensi Digital yang cepat, Pemberian nilai Asesmen
                  (tugas/ujian) yang fleksibel, serta Statistik Siswa otomatis
                  yang merangkum data kehadiran dan nilai yang mudah dipahami.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Apa perbedaan antara akun Free dan Subscription?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  Akun <strong>Free</strong> memungkinkan Anda mencoba fitur
                  dasar manajemen kelas secara gratis. Dengan beralih ke{" "}
                  <strong>Subscription</strong>, Anda akan mendapatkan tambahan
                  fitur dan keunggulan yang lebih lengkap., serta dapat
                  menikmati fitur-fitur baru sebelum.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Berapa biaya langganannya?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  Layanan Subscription kami sangat terjangkau, hanya sekitar{" "}
                  <strong>Rp15.000 per bulan</strong> (setara harga segelas
                  kopi). Anda bisa berlangganan kapan saja untuk membuka seluruh
                  potensi aplikasi guna mempermudah urusan administrasi kelas
                  Anda.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="container bg-primary text-light p-3 rounded rounded-5 my-3 d-lg-flex"
          style={{ height: 400 }}
        >
          <div className="col-lg-6 d-flex align-items-center">
            <div>
              <h2>Ayo, Coba Sekarang!</h2>
            </div>
          </div>
          <div className="col-lg-6">ini gambar</div>
        </section>
      </main>

      <footer
        className="bg-primary text-light d-flex justify-content-center align-items-center"
        style={{ height: 50 }}
      >
        <p className="m-0">Zidni Ahmad Nuril Adha 2025</p>
      </footer>
    </div>
  );
}
