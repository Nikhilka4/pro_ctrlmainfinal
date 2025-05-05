"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Download, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

interface UploadedFile {
  _id: string;
  filename: string;
  size: number;
  uploadDate: string;
}

interface FileUploadProps {
  username: string;
  projectTitle: string;
}

export default function FileUpload({
  username,
  projectTitle,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const compressPDF = async (file: File): Promise<Uint8Array> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.save();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const uploadFiles = async () => {
    setUploading(true);
    try {
      for (const file of files) {
        const compressedPDF = await compressPDF(file);
        const formData = new FormData();
        const compressedFile = new File([compressedPDF], file.name, {
          type: "application/pdf",
        });
        formData.append("file", compressedFile);
        formData.append("username", username);
        formData.append("projectTitle", projectTitle);

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }
      setFiles([]);
      fetchUploadedFiles();
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(
        `/api/files?username=${username}&projectTitle=${projectTitle}`
      );
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(
        `/api/files/${fileId}?username=${username}&projectTitle=${projectTitle}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh the file list after successful deletion
        fetchUploadedFiles();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, [username, projectTitle]);

  const downloadFile = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(
        `/api/download/${fileId}?username=${username}&projectTitle=${projectTitle}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {session?.user?.role === "admin" && (<div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 mb-6 rounded-lg text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop PDF files here, or click to select files</p>
      </div>)}

      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">Uploaded Files:</h3>
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded"
            >
              <span>{file.filename}</span>
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  size={"icon"}
                  variant="ghost"
                  onClick={() => downloadFile(file._id, file.filename)}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                >
                  <Download className="w-4 h-4 inline-block mr-1" />
                </Button>
                {session?.user?.role === "admin" && (<Button
                  variant="ghost"
                  size={"icon"}
                  onClick={() => deleteFile(file._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 inline-block mr-1" />
                </Button>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
