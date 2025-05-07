import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
