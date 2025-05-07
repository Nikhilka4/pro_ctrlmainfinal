import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const clients = await User.find({ role: "client" }).select("-password");
    return NextResponse.json(clients);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
