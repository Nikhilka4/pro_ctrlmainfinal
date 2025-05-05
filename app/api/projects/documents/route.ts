import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Documentation from "@/models/Documentation";
import { PDFDocument } from "pdf-lib";
import { createHash } from "crypto";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["application/pdf"];

// Helper function to compress PDF using pdf-lib
async function compressPDF(buffer: Buffer): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
    });
    return Buffer.from(compressedPdfBytes);
  } catch (error) {
    console.error("Error compressing PDF:", error);
    return buffer; // Return original buffer if compression fails
  }
}

// Helper function to validate file
function validateFile(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Only PDF files are allowed");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const username = formData.get("username") as string;
    const projectTitle = formData.get("projectTitle") as string;
    const files = formData.getAll("documents");

    // Validate request data
    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Verify project exists
    const project = await Project.findOne({ username, projectTitle });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Process files with validation and compression
    const processedFiles = await Promise.all(
      files.map(async (file: any) => {
        if (!(file instanceof File)) {
          throw new Error("Invalid file upload");
        }

        // Validate file
        validateFile(file);

        // Process file
        const buffer = Buffer.from(await file.arrayBuffer());
        const compressedBuffer = await compressPDF(buffer);

        // Create new documentation entry
        const doc = await Documentation.create({
          username,
          projectTitle,
          filename: file.name,
          data: compressedBuffer.toString("base64"),
          contentType: file.type,
          size: compressedBuffer.length,
        });

        return doc;
      })
    );

    // Return success response
    return NextResponse.json({
      message: "Documents uploaded successfully",
      documentsCount: processedFiles.length,
      totalSize: processedFiles.reduce((acc, file) => acc + file.size, 0),
    });
  } catch (error: any) {
    console.error("Error uploading documents:", error);

    // Return appropriate error response
    const status =
      error.message.includes("File size") || error.message.includes("Only PDF")
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get username and projectTitle from URL params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const projectTitle = searchParams.get("projectTitle");

    if (!username || !projectTitle) {
      return NextResponse.json(
        { error: "Username and project title are required" },
        { status: 400 }
      );
    }

    // Fetch documents for the project
    const documents = await Documentation.find(
      { username, projectTitle },
      { data: 0 } // Exclude the binary data from the response
    ).sort({ createdAt: -1 });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
}
