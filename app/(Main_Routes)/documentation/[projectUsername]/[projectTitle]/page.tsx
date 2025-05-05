"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useSession } from "next-auth/react";

interface ProjectDetails {
  username: string;
  projectTitle: string;
  projectStatus: string;
  startDate: string;
  estimatedEndDate?: string;
  quarter: string;
  type: string;
  phoneNumber: string;
  address: string;
  documentStatus: string;
  paymentStatus: string;
  budget: number;
  paid: number;
}

export default function ProjectPage({
  params,
}: {
  params: { projectUsername: string; projectTitle: string };
}) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const decodedTitle = decodeURIComponent(params.projectTitle);
  const decodedUsername = decodeURIComponent(params.projectUsername);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `/api/projects/details?username=${encodeURIComponent(
            decodedUsername
          )}&title=${encodeURIComponent(decodedTitle)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [decodedUsername, decodedTitle]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (error || !project) {
    return <div>Error: {error || "Project not found"}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">{project.projectTitle}</h1>

        {session?.user?.role === "admin" && (<div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Status:</span>{" "}
                {project.projectStatus}
              </p>
              <p>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(project.startDate).toLocaleDateString()}
              </p>
              {project.estimatedEndDate && (
                <p>
                  <span className="font-medium">Estimated End Date:</span>{" "}
                  {new Date(project.estimatedEndDate).toLocaleDateString()}
                </p>
              )}
              <p>
                <span className="font-medium">Quarter:</span> {project.quarter}
              </p>
              <p>
                <span className="font-medium">Type:</span> {project.type}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact & Payment</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {project.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Address:</span> {project.address}
              </p>
              <p>
                <span className="font-medium">Document Status:</span>{" "}
                {project.documentStatus}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {project.paymentStatus}
              </p>
              <p>
                <span className="font-medium">Budget:</span> ₹
                {project.budget.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Paid:</span> ₹
                {project.paid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>)}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Project Documents</h2>
          <FileUpload
            username={project.username}
            projectTitle={project.projectTitle}
          />
        </div>
      </div>
    </div>
  );
}
