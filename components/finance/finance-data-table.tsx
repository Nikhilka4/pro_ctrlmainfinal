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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface Project {
  _id: string;
  projectTitle: string;
  budget: number;
  paid: number;
  paymentStatus: string;
}

interface FinanceTableProps {
  width?: string;
  height?: string;
}

export function FinanceTable({
  width = "w-[350px]",
  height = "min-h-[600px]",
}: FinanceTableProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (session?.user?.username) {
          const response = await fetch(
            `/api/projects/client?username=${session.user.username}`
          );
          if (response.ok) {
            const data = await response.json();
            setProjects(data);
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

  // Filter items based on payment status
  const filteredItems = projects.filter((project) => {
    if (filter === "Active") return project.paymentStatus === "Active";
    if (filter === "Non Active") return project.paymentStatus === "Non Active";
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className={`${width} ${height} space-y-4`}>
      <div className="flex justify-between items-center">
        <Select onValueChange={handleFilterChange} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Non Active">Non-Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="p-4 shadow-2xl whitespace-nowrap rounded-md border">
        <Table className="relative h-full">
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead className="w-[200px]">Project Title</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="align-top">
            {currentItems.map((project, index) => (
              <TableRow key={project._id}>
                <TableCell className="font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>{project.projectTitle}</TableCell>
                <TableCell>{project.paymentStatus}</TableCell>
                <TableCell>₹{project.budget?.toLocaleString() || 0}</TableCell>
                <TableCell>₹{project.paid?.toLocaleString() || 0}</TableCell>
                <TableCell>
                  ₹
                  {(
                    (project.budget || 0) - (project.paid || 0)
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-background border-t">
            <TableRow>
              <TableCell colSpan={10}>
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
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
