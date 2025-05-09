import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { username, securityAnswer } = await request.json();

    if (!username || !securityAnswer) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid security answer" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Security answer verified successfully",
    });
  } catch (error) {
    console.error("Error verifying security answer:", error);
    return NextResponse.json(
      { error: "Failed to verify security answer" },
      { status: 500 }
    );
  }
}
