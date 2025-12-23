import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/connectDb";
import User from "@/models/googleAuth";

interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          const userExists = await User.findOne({ email: user.email });

          if (!userExists) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
            console.log("User baru berhasil didaftarkan via Google");
          }

          return true;
        } catch (error) {
          console.error("Gagal proses auto-register:", error);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user?.email });
      if (user && session.user) {
        (session.user as IUser).id = user._id.toString();
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
