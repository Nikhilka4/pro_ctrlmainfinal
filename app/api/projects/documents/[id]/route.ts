import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Documentation from "@/models/Documentation";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const doc = await Documentation.findById(params.id);
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Convert base64 data back to Buffer
    const buffer = Buffer.from(doc.data, "base64");

    // Create response with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": doc.contentType,
        "Content-Disposition": `attachment; filename="${doc.filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return NextResponse.json(
      { error: "Error downloading document" },
      { status: 500 }
    );
  }
}
