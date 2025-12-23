import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="d-flex align-items-center gap-4 bg-primary p-2">
        <Link href="/" className="text-light fs-2 text-decoration-none">
          Kelasku
        </Link>

        <Link
          href="/dashboard/akun"
          className="text-light text-decoration-none"
        >
          akun
        </Link>
      </div>
      {children}
    </div>
  );
}
