"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// Define project status phases in order
const PROJECT_PHASES = [
  "Quoted",
  "Design",
  "Fabrication",
  "Transportation",
  "Assembly",
  "Bolting",
  "Erection",
  "Finishing Touches",
];

// Calculate progress based on current project status
const calculateProgress = (status: string): number => {
  const phaseIndex = PROJECT_PHASES.indexOf(status);
  if (phaseIndex === -1) return 0;
  return Math.round(((phaseIndex + 1) / PROJECT_PHASES.length) * 100);
};

interface Project {
  _id: string;
  projectTitle: string;
  projectStatus: string;
  updatedAt: string;
}

export function TableDemo() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemsPerPage = 10;
  const isDocumentationPage = pathname === "/documentation";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (session?.user?.username) {
          const response = await fetch(
            `/api/projects/client?username=${session.user.username}`
          );
          if (response.ok) {
            const data = await response.json();
            // Sort projects by updatedAt in descending order
            const sortedProjects = data.sort(
              (a: Project, b: Project) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
            setProjects(sortedProjects);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = isDocumentationPage
    ? projects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : projects.slice(0, 7); // Only show recent 7 projects on dashboard

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead className="w-[200px]">Project Title</TableHead>
            <TableHead>Project Status</TableHead>
            <TableHead>Last Updated Date</TableHead>
            <TableHead>Progress bar with percentage</TableHead>
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
              <TableCell>{project.projectTitle}</TableCell>
              <TableCell>{project.projectStatus}</TableCell>
              <TableCell>
                {new Date(project.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Progress value={calculateProgress(project.projectStatus)} />
                <span className="text-xs text-muted-foreground">
                  {calculateProgress(project.projectStatus)}%
                </span>
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
  );
}
