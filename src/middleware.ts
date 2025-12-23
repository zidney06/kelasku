import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Kode di sini hanya akan dijalankan jika token valid
    return NextResponse.next();
  },
  {
    callbacks: {
      // Fungsi ini mengecek apakah token ada dan belum kadaluarsa
      // Jika return false, user otomatis diredirect ke halaman login
      authorized: ({ token }) => {
        // Jika token tidak ada, artinya belum login atau sudah expired
        return !!token;
      },
    },
    pages: {
      // Jika tidak login / token tidak valid, pindahkan ke halaman utama "/"
      signIn: "/loginRegister",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/asesment/:path*",
    "/api/kelas/:path*",
    "/api/student/:path*",
  ],
};
