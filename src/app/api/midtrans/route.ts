import User from "@/models/user";
import midtransClient from "midtrans-client";
import { NextRequest, NextResponse } from "next/server";

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

async function setSubscription(orderId: string) {
  const user = await User.findOne({ lastOrderId: orderId });

  if (user) {
    let newExpiryDate;
    const now = new Date();

    // LOGIKA PENTING:
    // Jika user masih punya sisa masa aktif (perpanjang sebelum habis),
    // tambahkan 30 hari dari tanggal expiry lama agar user tidak rugi.
    if (user.expiryDate && user.expiryDate > now) {
      newExpiryDate = new Date(user.expiryDate);
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    } else {
      // Jika sudah expired atau baru pertama kali, tambah 30 hari dari SEKARANG
      newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    }

    user.tier = "subscription";
    user.expiryDate = newExpiryDate;

    await user.save();
  } else {
    throw new Error("User not found");
  }
}

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const statusResponse = await (apiClient as any).transaction.notification(
      request,
    );

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // ini buat kartu kredit kalo gak salah
    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        setSubscription(orderId);
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      // ini buat e wallet kayak gopay atau qris
      setSubscription(orderId);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 },
    );
  }
}
