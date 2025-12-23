"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="container-fluid d-flex" style={{ height: "100vh" }}>
      <Link href="/">Home</Link>
      <div className="border border-2 rounded w-50 mx-auto form text-center p-1 auth-box my-auto">
        <h3>{isRegister ? "Registrasi" : "Login"}</h3>
        {isLogin && <span>Anda sudah login</span>}
        {isRegister ? (
          <div className="px-3 my-1 my-2">
            <button className="btn btn-outline-secondary" onClick={() => null}>
              Daftar dengan Google
            </button>
          </div>
        ) : (
          <div className="px-3 my-1 my-2">
            <button className="btn btn-outline-secondary" onClick={() => null}>
              Login dengan Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
