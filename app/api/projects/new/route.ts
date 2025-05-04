import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { username } = data;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new project
    const project = await Project.create(data);

    // Add project reference to user
    await User.findOneAndUpdate(
      { username },
      { $push: { projects: project._id } }
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
