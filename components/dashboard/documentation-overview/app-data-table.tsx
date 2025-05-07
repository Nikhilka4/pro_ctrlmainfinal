"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface CardForDocumentationProps {
  width?: string;
  height?: string;
  buttonText?: string;
}

interface ProjectWithLatestDoc {
  _id: string;
  projectTitle: string;
  username: string;
  documentStatus: string;
  latestDocument?: {
    filename: string;
    uploadDate: string;
  };
}

interface Document {
  filename: string;
  uploadDate: string;
}

export function TableDemo() {
  const [projects, setProjects] = useState<ProjectWithLatestDoc[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemsPerPage = 10;
  const isDocumentationPage = pathname === "/documentation";

  useEffect(() => {
    const fetchProjectsWithDocs = async () => {
      try {
        if (session?.user?.username) {
          const projectsResponse = await fetch(
            `/api/projects/client?username=${session.user.username}`
          );
          if (!projectsResponse.ok) return;
          const projectsData = await projectsResponse.json();

          const projectsWithDocs = await Promise.all(
            projectsData.map(async (project: ProjectWithLatestDoc) => {
              const docsResponse = await fetch(
                `/api/projects/documents?username=${
                  project.username
                }&projectTitle=${encodeURIComponent(project.projectTitle)}`
              );
              if (!docsResponse.ok) return project;

              const docs = await docsResponse.json();
              if (docs && docs.length > 0) {
                const sortedDocs = (docs as Document[]).sort(
                  (a, b) =>
                    new Date(b.uploadDate).getTime() -
                    new Date(a.uploadDate).getTime()
                );
                return {
                  ...project,
                  latestDocument: {
                    filename: sortedDocs[0].filename,
                    uploadDate: sortedDocs[0].uploadDate,
                  },
                };
              }
              return project;
            })
          );

          // Sort projects by latest document date
          const sortedProjects = projectsWithDocs.sort((a, b) => {
            const dateA = a.latestDocument?.uploadDate
              ? new Date(a.latestDocument.uploadDate)
              : new Date(0);
            const dateB = b.latestDocument?.uploadDate
              ? new Date(b.latestDocument.uploadDate)
              : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

          setProjects(sortedProjects);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsWithDocs();
  }, [session]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = isDocumentationPage
    ? projects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : projects.slice(0, 7); // Show only first 7 projects on non-documentation pages

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea className="whitespace-nowrap rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead className="w-[200px] text-center">
                Project Title
              </TableHead>
              <TableHead className="text-center">
                Documentation Status
              </TableHead>
              {/* <TableHead>Last Updated Date</TableHead> */}
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProjects.map((project, index) => (
              <TableRow key={project._id}>
                <TableCell className="font-medium">
                  {isDocumentationPage
                    ? (currentPage - 1) * itemsPerPage + index + 1
                    : index + 1}
                </TableCell>
                <TableCell className="text-center">
                  {project.projectTitle}
                </TableCell>
                <TableCell className="text-center">
                  {project.documentStatus}
                </TableCell>
                {/* <TableCell>
                  {project.latestDocument
                    ? new Date(
                        project.latestDocument.uploadDate
                      ).toLocaleDateString()
                    : "No documents"}
                </TableCell> */}
                <TableCell className="text-center">
                  <Link
                    href={`/documentation/${project.username}/${project.projectTitle}`}
                  >
                    <Button variant="outline" size="sm">
                      View All Documents
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {isDocumentationPage && (
            <TableFooter className="sticky bottom-0 bg-background border-t">
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-end gap-2 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {!isDocumentationPage && (
        <div className="text-sm text-muted-foreground text-right">
          Showing 7 most recent projects
        </div>
      )}
    </div>
  );
}

export function CardForDocumentation({
  width = "w-[350px]",
  height = "h-auto",
  buttonText = "Button",
}: CardForDocumentationProps) {
  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-2">
            <h1>Your Documentation Overview</h1>
            <Link href="/documentation">
              <Button variant="default" className="cursor-pointer">
                {buttonText}
              </Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TableDemo />
      </CardContent>
    </Card>
  );
}
