import { getServerSession } from "next-auth";
import { nextOptions } from "@/lib/nextAuth";
import z from "zod";

const userSchema = z.object({
  email: z.email(),
  name: z.string(),
  image: z.string(),
});

const sessionSchema = z.object({
  user: userSchema,
});

export const getSession = async () => {
  const session = await getServerSession(nextOptions);

  if (!session) {
    return { success: false, msg: "Unauthorized" };
  }

  const parsedSession = sessionSchema.safeParse(session);

  if (parsedSession.success === false) {
    console.error(parsedSession.error);
    return { success: false, msg: "Validation failed" };
  }
  return { data: parsedSession.data, success: true };
};

export const getRemainingDays = (expiryDate: Date) => {
  if (!expiryDate) return 0;

  const now: any = new Date();
  const expiry: any = new Date(expiryDate);

  // Hitung selisih dalam milidetik
  const diffInMs = expiry - now;

  // Konversi ke hari (pembulatan ke atas)
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};
