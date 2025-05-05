import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { gzip } from "zlib";
import { promisify } from "util";
import { PDFDocument } from "pdf-lib";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const gzipPromise = promisify(gzip);

export async function compress(buffer: Buffer): Promise<Buffer> {
  try {
    return await gzipPromise(buffer);
  } catch (error) {
    console.error("Error compressing file:", error);
    throw error;
  }
}

export async function compressPDF(buffer: Buffer): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);

    // Compress the PDF with valid options
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(compressedPdfBytes);
  } catch (error) {
    console.error("Error compressing PDF:", error);
    return buffer; // Return original buffer if compression fails
  }
}
