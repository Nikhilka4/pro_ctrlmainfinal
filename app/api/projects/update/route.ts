import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { username, projectTitle, ...updateData } = await request.json();

    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    const project = await Project.findOneAndUpdate(
      { username, projectTitle },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
