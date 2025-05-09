import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, password, companyName } = await request.json();

    if (!username || !password || !companyName) {
      return NextResponse.json(
        { error: "All fields are required" },
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
      role: "client",
      securityQuestion: "", // Initialize with empty security fields
      securityAnswer: "",
      isVerified: false, // User needs to set security info to be verified
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          username: user.username,
          role: user.role,
          companyName: user.companyName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
