import NextAuth from "next-auth";
import mongoose from 'mongoose';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare global {
    var mongoose: {
      promise: Promise<typeof mongoose> | null;
      conn: typeof mongoose | null;
    };
  }