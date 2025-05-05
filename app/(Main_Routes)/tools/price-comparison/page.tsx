
"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { TonnageResult } from "@/types/calculator";
import { TonnageCard } from "@/components/tools/price-comparision/tonnage-card";
import { TonnageResultCard } from "@/components/tools/price-comparision/tonnage-card-result";

export default function PriceComparision() {
  const [calculationResult, setCalculationResult] =
    useState<TonnageResult>();

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4">
      <div className="w-full text-left mb-6">
        <h1 className="text-3xl font-bold">Price Comparision</h1>
        <p className="text-lg">Project price comparision</p>
      </div>

      {/* Responsive layout - column on mobile, row on desktop */}
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full h-full md:w-1/2">
          <TonnageCard
            width="w-full"
            height="h-fit"
            onCalculate={setCalculationResult}
          />
        </div>

        {/* Horizontal separator for mobile, vertical for desktop */}
        <div className="w-full">
          <Separator orientation="horizontal" />
        </div>

        <div className="w-full">
          <TonnageResultCard
            width="w-full"
            height="h-fit"
            result={calculationResult}
          />
        </div>
      </div>
    </div>
  );
}
