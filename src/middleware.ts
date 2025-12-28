export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/asesment/:path*",
    "/api/kelas/:path*",
    "/api/student/:path*",
  ],
};
