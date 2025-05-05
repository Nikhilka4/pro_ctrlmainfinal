"use client";

import * as React from "react";
import { useState } from "react";
import { CalculationResult } from "@/types/calculator";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EstimatorCardProps {
  width?: string;
  height?: string;
  onCalculate: (result: CalculationResult) => void;
}

export function EstimatorCard({
  width = "w-[350px]",
  height = "min-h-[600px]",
  onCalculate,
}: EstimatorCardProps) {
  const [unit, setUnit] = useState<"feet" | "meters">("feet");
  const [dimensions, setDimensions] = useState({
    width: "",
    length: "",
    height: "",
    price: "",
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const width = parseFloat(dimensions.width);
    const length = parseFloat(dimensions.length);
    const height = parseFloat(dimensions.height);
    const price = parseFloat(dimensions.price);

    if (!isNaN(width) && !isNaN(length) && !isNaN(height) && !isNaN(price)) {
      const area = width * length;
      const subTotal = area * price;
      const gst = subTotal * 0.18;
      const total = subTotal + gst;

      onCalculate({
        unit,
        area,
        height,
        pricePerUnit: price,
        subTotal,
        gst,
        total,
      });

      // Add smooth scrolling to bottom of page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>Building Cost Estimator</CardTitle>
        <CardDescription>
          Enter building dimensions to calculate cost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="space-y-2">
            <Label>Units</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={unit === "feet" ? "default" : "outline"}
                className="w-full"
                onClick={() => setUnit("feet")}
              >
                Feet
              </Button>
              <Button
                type="button"
                variant={unit === "meters" ? "default" : "outline"}
                className="w-full"
                onClick={() => setUnit("meters")}
              >
                Meters
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="width">Width of the building</Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter width"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    width: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="length">Length of the building</Label>
              <Input
                id="length"
                type="number"
                placeholder="Enter length"
                value={dimensions.length}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    length: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="height">Height of the building</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={dimensions.height}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    height: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="price">
                Price per Square {unit === "feet" ? "foot" : "meter"}
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={dimensions.price}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Calculate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
