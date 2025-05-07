import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
// import Project from "@/models/Project";
import Documentation from "@/models/Documentation";
import { PDFDocument } from "pdf-lib";
import { File } from "buffer";

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

// interface UploadedFile extends File {
//   name: string;
//   type: string;
//   size: number;
//   arrayBuffer(): Promise<ArrayBuffer>;
// }

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const title = formData.get("title") as string;
    const files = formData.getAll("documents");

    if (!username || !title || files.length === 0) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process files with validation and compression
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error("Invalid file upload");
        }

        // Validate file
        validateFile(file);

        // Process file
        const buffer = Buffer.from(await file.arrayBuffer());
        const compressedBuffer = await compressPDF(buffer);

        return {
          filename: file.name,
          data: compressedBuffer.toString("base64"),
          size: compressedBuffer.length,
          contentType: file.type,
          uploadDate: new Date(),
          username,
          projectTitle: title,
        };
      })
    );

    // Save all files to database
    const savedDocs = await Documentation.insertMany(processedFiles);

    return Response.json({
      message: "Files uploaded successfully",
      files: savedDocs.map((doc) => ({
        _id: doc._id,
        filename: doc.filename,
        size: doc.size,
        uploadDate: doc.uploadDate,
      })),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return Response.json({ error: "Error uploading files" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const projectTitle = url.searchParams.get("projectTitle");

    if (!username || !projectTitle) {
      return Response.json(
        { error: "Username and projectTitle are required" },
        { status: 400 }
      );
    }

    const docs = await Documentation.find({
      username,
      projectTitle,
    }).sort({ uploadDate: -1 });

    return Response.json(
      docs.map((doc) => ({
        _id: doc._id,
        filename: doc.filename,
        size: doc.size,
        uploadDate: doc.uploadDate,
      }))
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return Response.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
}
