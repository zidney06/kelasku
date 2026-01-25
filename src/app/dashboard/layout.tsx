"use client";

import Popup from "@/components/Popup";
import Navbar from "@/components/dashboardComponents/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
