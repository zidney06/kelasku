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
    return { success: false, msg: "Cookie required" };
  }

  const parsedSession = sessionSchema.safeParse(session);

  if (parsedSession.success === false) {
    console.error(parsedSession.error);
    return { success: false, msg: "Unauthorized" };
  }
  return { data: parsedSession.data, success: true };
};
