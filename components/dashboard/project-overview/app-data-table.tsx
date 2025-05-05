"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableDemo } from "@/components/dashboard/project-overview/app-table";
import Link from "next/link";

interface CardForProjectProps {
  width?: string;
  height?: string;
  buttonText?: string;
}

export function CardForProject({
  width = "w-[350px]",
  height = "h-auto",
  buttonText = "Button",
}: CardForProjectProps) {
  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-2">
            <h1>Your Projects Overview</h1>
            <Link href="/projects">
              <Button variant="default" className="cursor-pointer">
                {buttonText}
              </Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <TableDemo />
          <div className="text-sm text-muted-foreground text-right">
            Showing 7 most recent projects
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
