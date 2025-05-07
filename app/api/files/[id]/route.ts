import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop()?.split("?")[0] ?? "";
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const projectTitle = url.searchParams.get("projectTitle");

    if (!username || !projectTitle) {
      return Response.json(
        { error: "Username and projectTitle are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fileupload");
    const filesCollection = db.collection("files");

    const result = await filesCollection.deleteOne({
      _id: new ObjectId(id),
      username,
      projectTitle,
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "File not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return Response.json({ error: "Error deleting file" }, { status: 500 });
  }
}
