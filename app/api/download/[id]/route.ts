import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const file = await filesCollection.findOne({
      _id: new ObjectId(params.id),
      username,
      projectTitle,
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Create response with the file content
    const response = new NextResponse(file.content.buffer, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.filename}"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Error downloading file" },
      { status: 500 }
    );
  }
}
