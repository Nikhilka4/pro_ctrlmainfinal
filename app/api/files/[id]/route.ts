import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
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

    // Delete the file document
    const result = await filesCollection.deleteOne({
      _id: new ObjectId(params.id),
      username,
      projectTitle,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "File not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
