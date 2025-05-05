"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, X } from "lucide-react";

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

interface ProjectDetailsFormProps {
  username: string;
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData & { username: string }) => Promise<void>;
  onCancel: () => void;
}

export function ProjectDetailsForm({
  username,
  initialData,
  onSubmit,
  onCancel,
}: ProjectDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    projectTitle: "",
    projectStatus: "Quoted",
    highPriority: false,
    startDate: "",
    estimatedEndDate: "",
    quarter: "Q1",
    type: "PEB Construction",
    phoneNumber: "",
    address: "",
    documentStatus: "Quotation",
    paymentStatus: "Active",
    budget: 0,
    paid: 0,
    ...initialData,
  });

  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const projectStatusOptions = [
    "Quoted",
    "Design",
    "Fabrication",
    "Transportation",
    "Assembly",
    "Bolting",
    "Erection",
    "Finishing Touches",
  ];

  const quarterOptions = ["Q1", "Q2", "Q3", "Q4"];

  const typeOptions = ["PEB Construction", "Conventional Construction"];

  const documentStatusOptions = [
    "Quotation",
    "Agreement letter",
    "Order confirmation",
    "Advance payment receipt",
    "Payment Due letter",
    "Final invoice",
  ];

  const paymentStatusOptions = ["Active", "Non Active"];

  const handleInputChange = (
    field: keyof FormData,
    value: FormData[keyof FormData]
  ) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  const validateFiles = (fileList: FileList): File[] => {
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(fileList).forEach((file) => {
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 10MB size limit`);
        return;
      }
      validFiles.push(file);
    });

    return validFiles;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      setFiles(validFiles);

      if (validFiles.length === 0) {
        setUploadError("No valid files selected");
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadError && files.length <= 1) {
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      await onSubmit({
        username,
        ...formData,
      });

      if (files.length > 0) {
        const fd = new FormData();
        fd.append("username", username);
        fd.append("title", formData.projectTitle);
        files.forEach((file) => {
          fd.append("documents", file);
        });

        setUploadProgress(10);

        const response = await fetch("/api/projects/documents", {
          method: "POST",
          body: fd,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        setUploadProgress(100);
        toast.success(`${files.length} document(s) uploaded successfully`);
        setFiles([]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        setUploadError(error.message);
        toast.error(error.message);
      } else {
        setUploadError("Failed to submit project");
        toast.error("Failed to submit project");
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-8">
      <div className="space-y-2">
        <Label htmlFor="projectTitle">Project Title</Label>
        <Input
          id="projectTitle"
          value={formData.projectTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("projectTitle", e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectStatus">Project Status</Label>
        <Select
          value={formData.projectStatus}
          onValueChange={(value) => handleInputChange("projectStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {projectStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="highPriority"
          checked={formData.highPriority}
          onCheckedChange={(checked: boolean) =>
            handleInputChange("highPriority", checked)
          }
        />
        <Label htmlFor="highPriority">High Priority</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("startDate", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
          <Input
            id="estimatedEndDate"
            type="date"
            value={formData.estimatedEndDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("estimatedEndDate", e.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quarter">Quarter</Label>
        <Select
          value={formData.quarter}
          onValueChange={(value) => handleInputChange("quarter", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select quarter" />
          </SelectTrigger>
          <SelectContent>
            {quarterOptions.map((quarter) => (
              <SelectItem key={quarter} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Project Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleInputChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          pattern="[0-9]{10}"
          maxLength={10}
          value={formData.phoneNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("phoneNumber", e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("address", e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentStatus">Document Status</Label>
        <Select
          value={formData.documentStatus}
          onValueChange={(value) => handleInputChange("documentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select document status" />
          </SelectTrigger>
          <SelectContent>
            {documentStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select
          value={formData.paymentStatus}
          onValueChange={(value) => handleInputChange("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            {paymentStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("budget", parseFloat(e.target.value))
            }
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paid">Paid Amount</Label>
          <Input
            id="paid"
            type="number"
            value={formData.paid}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("paid", parseFloat(e.target.value))
            }
            required
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !!uploadError}
          className="min-w-[100px]"
        >
          {submitting
            ? uploadProgress > 0
              ? "Uploading..."
              : "Saving..."
            : initialData
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
