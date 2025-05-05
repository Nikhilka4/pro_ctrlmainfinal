import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const title = searchParams.get("title");

    if (!username || !title) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    const project = await Project.findOne({ username, projectTitle: title });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
