import mongoose, { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedTestData } from "./seed";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
    mongod?: MongoMemoryServer;
  };
}

// Menyiapkan cache global agar koneksi tidak dibuat ulang terus menerus
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

    let uri;

    if (process.env.NODE_MYENV === "test") {
      if (!cached.mongod) {
        cached.mongod = await MongoMemoryServer.create();
      }
      uri = cached.mongod.getUri();
      console.log("🛠️  Connected to MONGODB-MEMORY-SERVER (Mock DB)");
    } else {
      uri = process.env.MONGO_URI!;
    }

    if (!uri) {
      throw new Error("Tolong definisikan MONGO_URI");
    }

    cached.promise = mongoose
      .connect(uri, opts)
      .then(async (mongooseInstance) => {
        // JALANKAN SEED hanya jika di mode test
        if (process.env.NODE_MYENV === "test") {
          await seedTestData();
        }
        return mongooseInstance;
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
