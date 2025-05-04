import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import multer from "multer";
import { compress } from "@/lib/utils";

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const title = formData.get("title") as string;
    const files = formData.getAll("documents") as File[];

    if (!username || !title) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Process and compress each file
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const compressedBuffer = await compress(Buffer.from(buffer));
        return {
          name: file.name,
          data: compressedBuffer,
          contentType: "application/pdf",
        };
      })
    );

    // Update project with new documents
    const project = await Project.findOneAndUpdate(
      { username, title },
      {
        $push: { documents: { $each: compressedFiles } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Documents uploaded successfully",
      documentsCount: compressedFiles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
