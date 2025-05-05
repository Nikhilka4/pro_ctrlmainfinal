import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpdateProps {
  width?: string;
  height?: string;
}

export function Update({
  width = "w-[350px]",
  height = "h-auto",
}: UpdateProps) {
  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-2">
            <h1>Your Updates</h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full">
        <h1>No Updates</h1>
      </CardContent>
    </Card>
  );
}
