import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const { username, securityQuestion, securityAnswer } = await request.json();

    if (!username || !securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Use updateOne instead of findOne and save to avoid triggering validation on other fields
    const result = await User.updateOne(
      { username: username.toLowerCase() },
      {
        $set: {
          securityQuestion,
          securityAnswer: securityAnswer.toLowerCase(),
          isVerified: true,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Security details updated successfully",
    });
  } catch (error) {
    console.error("Error updating security details:", error);
    return NextResponse.json(
      { error: "Failed to update security details" },
      { status: 500 }
    );
  }
}
