import * as React from "react";
import { CalculationResult } from "@/types/calculator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ResultCardProps {
  width?: string;
  height?: string;
  result?: CalculationResult;
}

export function ResultCard({
  width = "w-[350px]",
  height = "min-h-[600px]",
  result,
}: ResultCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Calculated results for your building</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label>Total Area</Label>
            <div className="rounded-lg border p-3 bg-slate-50">
              <span className="text-lg font-medium">
                {result ? formatNumber(result.area) : "0"}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                sq. {result?.unit ?? "ft."}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Price per Square {result?.unit === "meters" ? "meter" : "foot"}
            </Label>
            <div className="rounded-lg border p-3 bg-slate-50">
              <span className="text-lg font-medium">
                ₹{result ? formatNumber(result.pricePerUnit) : "0"}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                / sq. {result?.unit ?? "ft."}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sub Total</Label>
            <div className="rounded-lg border p-3 bg-slate-50">
              <span className="text-lg font-medium">
                ₹{result ? formatNumber(result.subTotal) : "0"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>GST (18%)</Label>
            <div className="rounded-lg border p-3 bg-slate-50">
              <span className="text-lg font-medium">
                ₹{result ? formatNumber(result.gst) : "0"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estimated Total Cost</Label>
            <div className="rounded-lg border p-3 bg-slate-100">
              <span className="text-xl font-bold text-slate-900">
                ₹{result ? formatNumber(result.total) : "0"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
