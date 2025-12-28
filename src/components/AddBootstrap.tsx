// AddBootstrap.tsx
"use client";

import { useEffect } from "react";

export default function AddBootstrap(): null {
  useEffect(() => {
    // Menggunakan dynamic import tanpa 'any'
    // TypeScript akan menganggap ini sebagai Promise modul
    import("bootstrap/dist/js/bootstrap.bundle.js")
      .then(() => {
        // Berhasil dimuat
      })
      .catch((err) => {
        console.error("Gagal memuat Bootstrap JS:", err);
      });
  }, []);

  return null;
}
