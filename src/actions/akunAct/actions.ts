"use server";

import User from "@/models/user";
import { getSession, getRemainingDays } from "@/utility/utility";
import connectDB from "@/lib/connectDb";
import midtransClient from "midtrans-client";

export const getUserData = async () => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findOne({ email: session.data.user?.email })
      .select("name email tier image lastOrderId")
      .lean();

    if (!user) {
      return { success: false, msg: "User not found!" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};

export const getPaymentToken = async () => {
  try {
    const session = await getSession();

    if (!session.success || !session.data) {
      return { success: false, msg: "Unauthorized" };
    }

    await connectDB();

    const user = await User.findOne({ email: session.data.user?.email });

    if (!user) {
      return { success: false, msg: "User not found!" };
    }

    // cek apakah masa langganan user masih aktif
    // jika tinggal 3 hari lagi, baru bisa menambah masa aktif
    const remainingDays = getRemainingDays(user.expiryDate);

    if (remainingDays > 3) {
      return { success: false, msg: "Subscription is still active!" };
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });

    const nameParts = user.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const orderId = `order-id-${Math.round(new Date().getTime() / 1000)}`;

    const parameter = {
      transaction_details: {
        // ID unik untuk pesanan ini. Penting: ID ini tidak boleh sama dengan transaksi sebelumnya.
        // Jika kamu mencoba membayar dua kali dengan ID yang sama, Midtrans akan menolak.
        order_id: orderId,
        // total yang harus dibayar client
        gross_amount: 15000,
      },
      // Ini berarti kamu mengaktifkan fitur 3D Secure. Pelanggan akan diarahkan untuk memasukkan kode OTP dari bank mereka.
      // Sangat disarankan untuk selalu true demi keamanan dan menghindari fraud.
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: "0001", // ID produk di sistem sendiri
          price: 15000, // Harga per satuan
          quantity: 1, // Jumlah barang
          name: "Subscibtion plan, 1 month (30 days)", // Nama produk yang muncul di struk Midtrans
        },
      ],

      // customer detail ini opsional tapi sebaiknya diisi
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email: user.email,
      },
      callbacks: {
        finish:
          "https://multiviewing-cutaneously-jonnie.ngrok-free.dev/dashboard/payment-success",
      },
    };

    const transsaction = await snap.createTransaction(parameter);

    // simpan data orderId ke user
    user.lastOrderId = orderId;

    await user.save();

    const transsactionToken = transsaction.token;

    return { success: true, token: transsactionToken };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Internal server error" };
  }
};
/*
PROPERTY YANG ADA DALAM PARAMETER MIDTRANS
==================================================

// Logic pemisahan nama (seperti yang kita bahas sebelumnya)
const nameParts = user.name.trim().split(" ");
const firstName = nameParts[0];
const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

let parameter = {
  // --- [WAJIB] DETAIL TRANSAKSI ---
  transaction_details: {
    order_id: `ORDER-${Date.now()}`, // Wajib: ID unik transaksi
    gross_amount: 50000,             // Wajib: Total bayar (harus sama dengan total item_details)
  },

  // --- [OPSIONAL] DETAIL BARANG (Sangat disarankan diisi) ---
  item_details: [
    {
      id: "ITEM1",                   // ID produk di sistem kamu
      price: 25000,                  // Harga per satuan
      quantity: 2,                   // Jumlah barang
      name: "Kaos Polos Hitam",      // Nama produk yang muncul di struk Midtrans
      brand: "Brand Lokal",          // Opsional: Merk barang
      category: "Fashion",           // Opsional: Kategori
      merchant_name: "Toko Utama"    // Opsional: Nama toko jika marketplace
    }
  ],

  // --- [OPSIONAL] DETAIL CUSTOMER (Sangat disarankan agar tidak kosong di dashboard) ---
  customer_details: {
    first_name: firstName,           // Nama depan
    last_name: lastName,             // Nama belakang (sisa nama)
    email: user.email,               // Email aktif pembeli
    phone: "08123456789",            // Nomor HP (Gunakan string)

    // Alamat Penagihan
    billing_address: {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone: "08123456789",
      address: "Jl. Sudirman No. 1", // Alamat lengkap
      city: "Jakarta",               // Kota
      postal_code: "12190",          // Kode pos
      country_code: "IDN"            // Wajib 3 digit ISO (Indonesia = IDN)
    },

    // Alamat Pengiriman (Bisa berbeda dengan billing)
    shipping_address: {
      first_name: "Penerima Paket",
      last_name: "",
      phone: "08998877665",
      address: "Jl. Gatot Subroto No. 5",
      city: "Bandung",
      postal_code: "40111",
      country_code: "IDN"
    }
  },

  // --- [OPSIONAL] PENGATURAN PEMBAYARAN ---
  enabled_payments: ["credit_card", "gopay", "shopeepay", "bank_transfer"], // Batasi metode bayar tertentu

  credit_card: {
    secure: true,                    // Wajib true untuk fitur 3D Secure (OTP)
    save_card: false,                // Jika true, customer bisa simpan kartu (butuh izin khusus Midtrans)
    installment: {                   // Opsional: Pengaturan cicilan
      required: false,
      terms: {
        bni: [3, 6, 12],             // Pilihan bulan cicilan per bank
        mandiri: [3, 6]
      }
    }
  },

  // --- [OPSIONAL] REDIRECT URL (Halaman tujuan setelah bayar) ---
  callbacks: {
    finish: "https://toko-kamu.com/payment/success", // Jika bayar berhasil
    error: "https://toko-kamu.com/payment/error",     // Jika sistem error
    pending: "https://toko-kamu.com/payment/pending"  // Jika menunggu pembayaran (misal Alfamart/VA)
  },

  // --- [OPSIONAL] CUSTOM FIELDS (Untuk simpan data tambahan yang tidak ada di field atas) ---
  // Data ini akan dikirim balik ke Webhook/Notification kamu
  custom_field1: "Member-Gold",
  custom_field2: "Promo-Ramadhan",
  custom_field3: "Diskon-Referral"
};
*/
