import { Component } from "@/components/dashboard/finance-overview/pie-chart";
import { CardForProject } from "@/components/dashboard/project-overview/app-data-table";
import { Update } from "@/components/dashboard/Update/update";
import { CardForDocumentation } from "@/components/dashboard/documentation-overview/app-data-table";

export default function Home() {
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 grid-rows-4 md:grid-rows-2 gap-8 p-4">
      <div className="md:col-span-2">
        <CardForProject
          width="w-full"
          height="h-full"
          buttonText="View All Projects"
        />
      </div>
      <div>
        <Component width="w-full" height="h-full" buttonText="View More" />
      </div>
      <div>
        <Update width="w-full" height="h-full" />
      </div>
      <div className="md:col-span-2">
        <CardForDocumentation
          width="w-full"
          height="h-full"
          buttonText="View All Documentation"
        />
      </div>
    </div>
  );
}
