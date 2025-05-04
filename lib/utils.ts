import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { gzip } from "zlib";
import { promisify } from "util";

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
