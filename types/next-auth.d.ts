import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      role: "admin" | "client";
      companyName: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: "admin" | "client";
    companyName: string;
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: "admin" | "client";
    companyName: string;
    isVerified?: boolean;
  }
}
