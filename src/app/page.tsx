"use client";

// import Image from "next/image";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="container-fluid p-0">
      <div
        className="d-flex bg-primary p-2 justify-content-between"
        data-bs-theme="dark"
        style={{ fontSize: ".9rem" }}
      >
        <div className="d-flex align-items-center gap-2">
          <h3 className="text-light ">Navbar</h3>

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
              Logout
            </p>
          ) : (
            <p
              onClick={() => signIn("google")}
              className="m-0 text-light"
              style={{ cursor: "pointer" }}
            >
              Sign Up
            </p>
          )}
        </div>
      </div>

      <main className="px-2">
        <h1 className="">KelasKu</h1>
        <p>
          Selamat datang di aplikasi KelasKu, sebuah aplikasi yang dibuat untuk
          membantu guru dalam pekerjaannya.
        </p>
        <section>
          <h3>Contoh aplikasinya</h3>
        </section>
        <section>
          <h3>Macam-macam tier</h3>
          <div className="d-md-flex justify-content-around">
            <div
              className="card my-2 mx-auto mx-md-2 w-md-45 w-100"
              style={{ maxWidth: 600 }}
            >
              {/*<Image src="" alt="Card image cap"></Image>*/}
              <div className="card-body">
                <h5 className="card-title">Free tier</h5>
                <p className="card-text">Benefit</p>
                <ul>
                  <li>Jumlah maksimal data kelas per akun = 5</li>
                  <li>Jumlah maksimum siswa per kelas = 30</li>
                </ul>
                <p>Harga: Rp 0</p>
              </div>
            </div>
            <div
              className="card my-2 mx-auto mx-md-2 w-md-45 w-100"
              style={{ maxWidth: 600 }}
            >
              {/*<Image src="" alt="Card image cap"></Image>*/}
              <div className="card-body">
                <h5 className="card-title">Subscription tier</h5>
                <p className="card-text">Benefit</p>
                <ul>
                  <li>Jumlah maksimal data kelas per akun: 10</li>
                  <li>Jumlah maksimum siswa per kelas: 50</li>
                </ul>
                <p>Harga: Rp 15.000</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>Zidni Ahmad Nuril Adha 2025</p>
      </footer>
    </div>
  );
}
