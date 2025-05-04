import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing required fields");
          }

          const lowercaseUsername = credentials.username.toLowerCase();
          const user = await User.findOne({ username: lowercaseUsername });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await user.comparePassword(
            credentials.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
            companyName: user.companyName,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.companyName = user.companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          username: token.username as string,
          role: token.role as "admin" | "client",
          companyName: token.companyName as string,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
