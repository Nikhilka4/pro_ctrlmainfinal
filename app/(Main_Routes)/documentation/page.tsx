import { TableDemo } from "@/components/dashboard/documentation-overview/app-data-table";
import React from "react";

const page = () => {
  return (
    <div className="w-[95%] h-full mx-auto">
      <div className="w-full text-left mb-6">
        <h1 className="text-3xl font-bold">Documentation Hub</h1>
        <p className="text-lg">All your documents at one place</p>
      </div>
      <TableDemo />
    </div>
  );
};

export default page;
