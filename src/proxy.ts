import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/auth/signin", // sesuaikan dengan halaman loginmu
//   },
// });

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/asesment/:path*",
    "/api/kelas/:path*",
    "/api/student/:path*",
  ],
};
