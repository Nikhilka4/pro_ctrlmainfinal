import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, password, companyName } = await request.json();

    if (!username || !password || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lowercaseUsername = username.toLowerCase();

    const existingUser = await User.findOne({ username: lowercaseUsername });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      username: lowercaseUsername,
      password,
      companyName,
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
