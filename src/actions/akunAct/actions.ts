"use server";

import User from "@/models/googleAuth";
import { getSession } from "@/utility/utility";
import connectDB from "@/lib/connectDb";
import midtransClient from "midtrans-client";

export const getUserData = async () => {
  const session = await getSession();

  if (!session.success || !session.data) {
    return { success: false, msg: "Unauthorized" };
  }

  await connectDB();

  const user = await User.findOne({ email: session.data.user?.email })
    .select("name email tier image")
    .lean();

  if (!user) {
    return { success: false, msg: "User not found!" };
  }

  return { success: true, data: user };
};

export const getPaymentToken = async () => {
  const session = await getSession();

  if (!session.success || !session.data) {
    return { success: false, msg: "Unauthorized" };
  }

  await connectDB();

  const user = await User.findOne({ email: session.data.user?.email })
    .select("name email")
    .lean();

  if (!user) {
    return { success: false, msg: "User not found!" };
  }

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  });

  let parameter = {
    transaction_details: {
      // ID unik untuk pesanan ini. Penting: ID ini tidak boleh sama dengan transaksi sebelumnya.
      // Jika kamu mencoba membayar dua kali dengan ID yang sama, Midtrans akan menolak.
      order_id: `order-id-${Math.round(new Date().getTime() / 1000)}`,
      gross_amount: 15000,
    },
    // Ini berarti kamu mengaktifkan fitur 3D Secure. Pelanggan akan diarahkan untuk memasukkan kode OTP dari bank mereka.
    // Sangat disarankan untuk selalu true demi keamanan dan menghindari fraud.
    credit_card: {
      secure: true,
    },
    // customer detail ini opsional tapi sebaiknya diisi
    customer_details: {
      username: user.name,
      email: user.email,
    },
  };
  const transsaction = await snap.createTransaction(parameter);

  const transsactionToken = transsaction.token;

  console.log("Midtrans transaction token:", transsactionToken);
};
