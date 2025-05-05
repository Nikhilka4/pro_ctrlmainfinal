"use client";

import * as React from "react";
import { useState } from "react";
import { TonnageResult } from "@/types/calculator";

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

interface TonnageCardProps {
  width?: string;
  height?: string;
  onCalculate: (result: TonnageResult) => void;
}

export function TonnageCard({
  width = "w-[350px]",
  height = "min-h-[600px]",
  onCalculate,
}: TonnageCardProps) {
  const [dimensions, setDimensions] = useState({
    width: "",
    length: "",
    height: "",
    price: "",
    load: "",
    pricePerTon: "",
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const width = parseFloat(dimensions.width);
    const length = parseFloat(dimensions.length);
    const height = parseFloat(dimensions.height);
    const price = parseFloat(dimensions.price);
    const load = parseFloat(dimensions.load);
    const pricePerTon = parseFloat(dimensions.pricePerTon);

    if (
      !isNaN(width) &&
      !isNaN(length) &&
      !isNaN(height) &&
      !isNaN(price) &&
      !isNaN(load) &&
      !isNaN(pricePerTon)
    ) {
      const area = width * length;
      const subTotalPerSqFt = area * price;
      const gstPerSqFt = subTotalPerSqFt * 0.18;
      const totalPerSqFt = subTotalPerSqFt + gstPerSqFt;
      const subTotalPerTon = (area * 10.764 * load)/1000 * pricePerTon;
      const gstPerTon = subTotalPerTon * 0.18;
      const totalPerTon = subTotalPerTon + gstPerTon; 
      
      onCalculate({
        area,
        height,
        load,
        pricePerUnit: price,
        pricePerTon,
        subTotalPerSqFt,
        gstPerSqFt,
        totalPerSqFt,
        subTotalPerTon,
        gstPerTon,
        totalPerTon,
      });

      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className={`${width} ${height} shadow-2xl my-auto`}>
      <CardHeader>
        <CardTitle>Building Cost Estimator</CardTitle>
        <CardDescription>
          Enter building dimensions to calculate cost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-6">
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
              <Label htmlFor="price">Price per Square Meter</Label>
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

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="load">Load</Label>
              <Input
                id="load"
                type="number"
                placeholder="Enter load in kg"
                value={dimensions.load}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    load: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="pricePerTon">Price per Ton</Label>
              <Input
                id="pricePerTon"
                type="number"
                placeholder="Enter price per ton"
                value={dimensions.pricePerTon}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    pricePerTon: e.target.value,
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
