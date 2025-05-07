"use client";

import { useParams } from "next/navigation";
import FileUpload from "@/components/FileUpload";

export default function ProjectPage() {
  const params = useParams();
  const projectUsername =
    typeof params.projectUsername === "string" ? params.projectUsername : "";
  const projectTitle =
    typeof params.projectTitle === "string" ? params.projectTitle : "";

  return (

    <div>
      <FileUpload
        username={decodeURIComponent(projectUsername)}
        projectTitle={decodeURIComponent(projectTitle)}
      />
    </div>
  );
}
