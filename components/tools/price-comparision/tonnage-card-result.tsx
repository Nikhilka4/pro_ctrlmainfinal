import * as React from "react";
import { TonnageResult } from "@/types/calculator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TonnageResultCardProps {
  width?: string;
  height?: string;
  result?: TonnageResult;
}

export function TonnageResultCard({
  width = "w-[350px]",
  height = "min-h-[600px]",
  result,
}: TonnageResultCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-4">
      {/* First Card - Square Feet Based */}
      <Card className={` ${height} ${width} shadow-2xl`}>
        <CardHeader>
          <CardTitle>Square Feet Calculation</CardTitle>
          <CardDescription>Cost based on area</CardDescription>
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
                  sq.ft.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price per Square foot</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.pricePerUnit) : "0"}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  / sq.ft.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sub Total</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.subTotalPerSqFt) : "0"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>GST (18%)</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.gstPerSqFt) : "0"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="rounded-lg border p-3 bg-slate-100">
                <span className="text-xl font-bold text-slate-900">
                  ₹{result ? formatNumber(result.totalPerSqFt) : "0"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Second Card - Tonnage Based */}
      <Card className={`${width} shadow-2xl`}>
        <CardHeader>
          <CardTitle>Tonnage Calculation</CardTitle>
          <CardDescription>Cost based on weight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>Total Load</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  {result ? formatNumber(result.load) : "0"}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price per Ton</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.pricePerTon) : "0"}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  / ton
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sub Total</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.subTotalPerTon) : "0"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>GST (18%)</Label>
              <div className="rounded-lg border p-3 bg-slate-50">
                <span className="text-lg font-medium">
                  ₹{result ? formatNumber(result.gstPerTon) : "0"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="rounded-lg border p-3 bg-slate-100">
                <span className="text-xl font-bold text-slate-900">
                  ₹{result ? formatNumber(result.totalPerTon) : "0"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
