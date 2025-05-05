import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const projectTitle = url.searchParams.get("projectTitle");

    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and projectTitle are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fileupload");
    const filesCollection = db.collection("files");

    const files = await filesCollection
      .find({ username, projectTitle })
      .project({
        content: 0, // Exclude the file content from the response
        username: 0,
        projectTitle: 0,
      })
      .sort({ uploadDate: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Error fetching files" },
      { status: 500 }
    );
  }
}
