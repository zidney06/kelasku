import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/connectDb";
import User from "@/models/user";

export const nextOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // memaksa google untuk menampilkan polihan akun
          // jika tidak maka google akan otomatis memilih akun yang sedang login di browser
          prompt: "select_account",
        },
      },
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
          }

          return true;
        } catch (error) {
          console.error("Gagal proses register:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      await connectDB();

      const user = await User.findOne({ email: session.user?.email });

      if (!user) {
        throw new Error("User not found");
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
