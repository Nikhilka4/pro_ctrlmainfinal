"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { ProjectDetailsForm } from "./project-details-form";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Client {
  username: string;
  companyName: string;
}

interface Project {
  _id: string;
  projectTitle: string;
  username: string;
  documents: any[];
  projectStatus: string;
  highPriority: boolean;
  startDate: string;
  estimatedEndDate: string;
  quarter: string;
  type: string;
  phoneNumber: string;
  address: string;
  documentStatus: string;
  paymentStatus: string;
  budget: number;
  paid: number;
}

interface FormData {
  projectTitle: string;
  projectStatus: string;
  highPriority: boolean;
  startDate: string;
  estimatedEndDate: string;
  quarter: string;
  type: string;
  phoneNumber: string;
  address: string;
  documentStatus: string;
  paymentStatus: string;
  budget: number;
  paid: number;
}

export function AdminTable() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Fetch clients when component mounts
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/users/clients");
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/projects/client?username=${selectedClient}`
          );
          if (!response.ok) throw new Error("Failed to fetch projects");
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to fetch projects");
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [selectedClient]);

  const handleCreateProject = async (data: any) => {
    try {
      const response = await fetch("/api/projects/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      setProjects((prev) => [...prev, newProject]);
      setSheetOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      throw error;
    }
  };

  const handleUpdateProject = async (data: any) => {
    try {
      const response = await fetch("/api/projects/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update project");

      const updatedProject = await response.json();
      setProjects((prev) =>
        prev.map((p) =>
          p.projectTitle === updatedProject.projectTitle ? updatedProject : p
        )
      );
      setSheetOpen(false);
      setSelectedProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      throw error;
    }
  };

  const handleDeleteProject = async (
    username: string,
    projectTitle: string
  ) => {
    try {
      const response = await fetch(
        `/api/projects/delete?username=${encodeURIComponent(
          username
        )}&title=${encodeURIComponent(projectTitle)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");

      setProjects((prev) =>
        prev.filter((p) => p.projectTitle !== projectTitle)
      );
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEditProject = async (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  const handleAddNewProject = () => {
    setSelectedProject(null); // Reset selected project
    setSheetOpen(true);
  };

  return (
    <Card className="w-[80%] mx-auto mt-10">
      <CardHeader className="flex flex-row justify-between items-center">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-[25%]">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.username} value={client.username}>
                {client.username} - {client.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!selectedClient}
              onClick={handleAddNewProject}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto max-h-screen">
            <SheetHeader>
              <SheetTitle>
                {selectedProject ? "Edit Project" : "Add New Project"}
              </SheetTitle>
              <SheetDescription>
                {selectedProject
                  ? "Edit project details"
                  : `Create a new project for ${
                      clients.find((c) => c.username === selectedClient)
                        ?.companyName || "selected client"
                    }`}
              </SheetDescription>
            </SheetHeader>
            <ProjectDetailsForm
              username={selectedClient}
              initialData={selectedProject as FormData | undefined}
              onSubmit={
                selectedProject ? handleUpdateProject : handleCreateProject
              }
              onCancel={() => {
                setSheetOpen(false);
                setSelectedProject(null);
              }}
            />
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">S.No</TableHead>
              <TableHead className="w-[30%]">Project Title</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[20%]">Documents</TableHead>
              <TableHead className="w-[20%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {selectedClient
                    ? "No projects found"
                    : "Select a client to view projects"}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project, index) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{project.projectTitle}</TableCell>
                  <TableCell>{project.projectStatus}</TableCell>
                  <TableCell>
                    <Button variant="link" className="px-0" asChild>
                      <Link
                        href={`/documentation/${project.username}/${project.projectTitle}`}
                      >
                        View Documents
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditProject(project)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              {project.projectTitle}? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteProject(
                                  project.username,
                                  project.projectTitle
                                )
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
