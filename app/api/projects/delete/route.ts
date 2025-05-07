import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const projectTitle = searchParams.get("title");

    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    const deletedProject = await Project.findOneAndDelete({
      username,
      projectTitle,
    });

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Remove project reference from user
    await User.findOneAndUpdate(
      { username },
      { $pull: { projects: deletedProject._id } }
    );

    return NextResponse.json({
      message: "Project deleted successfully",
      deletedProject,
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
