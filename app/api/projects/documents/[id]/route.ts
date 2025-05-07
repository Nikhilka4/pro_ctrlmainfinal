import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Documentation from "@/models/Documentation";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const id = request.url.split("/").pop()?.split("?")[0] ?? "";

    const doc = await Documentation.findById(id);
    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    // Convert base64 data back to Buffer
    const buffer = Buffer.from(doc.data, "base64");

    // Create response with appropriate headers
    return new Response(buffer, {
      headers: {
        "Content-Type": doc.contentType,
        "Content-Disposition": `attachment; filename="${doc.filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return Response.json(
      { error: "Error downloading document" },
      { status: 500 }
    );
  }
}
