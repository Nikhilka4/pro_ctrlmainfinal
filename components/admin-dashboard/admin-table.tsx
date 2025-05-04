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
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

interface Client {
  username: string;
  companyName: string;
}

interface Project {
  _id: string;
  title: string;
  username: string;
  documents: string[];
}

export function AdminTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [selectedClient]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !projectTitle) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/projects/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedClient,
          title: projectTitle,
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      setProjects((prev) => [...prev, newProject]);
      setProjectTitle("");
      setSheetOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-[80%] mx-auto mt-10">
      <CardHeader className="flex flex-row justify-between items-center">
        
          <Select value={selectedClient} onValueChange={setSelectedClient} >
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
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Project</SheetTitle>
              <SheetDescription>
                Create a new project for{" "}
                {selectedClient
                  ? clients.find((c) => c.username === selectedClient)
                      ?.companyName
                  : "selected client"}
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <Input
                  placeholder="Project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">S.No</TableHead>
              <TableHead className="w-[40%]">Project Title</TableHead>
              <TableHead className="w-[40%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  {selectedClient
                    ? "No projects found"
                    : "Select a client to view projects"}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project, index) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-10">
                      <Button
                        variant="link"
                        className="px-4 py-2 rounded cursor-pointer"
                      >
                        View All Documents ({project.documents?.length || 0})
                      </Button>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <button className="bg-[#f3555a] hover:bg-[#f3555ac2] text-white px-4 py-2 rounded ml-2 cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
