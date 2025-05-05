import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Binary } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;
    const username = data.get("username") as string;
    const projectTitle = data.get("projectTitle") as string;

    if (!file || !username || !projectTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const binary = new Binary(Buffer.from(buffer));

    const client = await clientPromise;
    const db = client.db("fileupload");
    const filesCollection = db.collection("files");

    const result = await filesCollection.insertOne({
      filename: file.name,
      content: binary,
      size: file.size,
      uploadDate: new Date(),
      contentType: file.type,
      username: username,
      projectTitle: projectTitle,
    });

    return NextResponse.json({
      _id: result.insertedId,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
