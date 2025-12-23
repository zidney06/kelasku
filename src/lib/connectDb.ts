import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;

declare global {
  // Menggunakan 'var' adalah standar untuk deklarasi global di TS
  // Kita definisikan struktur objeknya dengan jelas
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

if (!MONGODB_URI) {
  throw new Error("Tolong definisikan MONGO_URI di file .env.local");
}

// Menyiapkan cache global agar koneksi tidak dibuat ulang terus-menerus
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Matikan buffer agar error cepat terdeteksi
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
