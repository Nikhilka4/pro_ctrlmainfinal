import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // First sort by highPriority (true comes first)
    // Then for high priority projects, sort by updatedAt in descending order
    const projects = await Project.find({ username }).sort({
      highPriority: -1,
      updatedAt: -1,
    });

    return NextResponse.json(projects);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
