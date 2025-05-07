import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
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

    const file = await filesCollection.findOne({
      _id: new ObjectId(id),
      username,
      projectTitle,
    });

    if (!file) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    return new Response(file.content.buffer, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return Response.json({ error: "Error downloading file" }, { status: 500 });
  }
}
