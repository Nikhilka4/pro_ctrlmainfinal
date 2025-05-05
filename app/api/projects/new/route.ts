import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { username, projectTitle } = data;

    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if project with same title exists for this user
    const existingProject = await Project.findOne({ username, projectTitle });
    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this title already exists" },
        { status: 400 }
      );
    }

    // Create new project with default values
    const project = await Project.create({
      ...data,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highPriority: data.highPriority || false,
    });

    // Add project reference to user
    await User.findOneAndUpdate(
      { username },
      { $push: { projects: project._id } }
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
