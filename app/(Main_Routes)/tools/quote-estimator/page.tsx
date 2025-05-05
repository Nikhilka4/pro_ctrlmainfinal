"use client";

import { EstimatorCard } from "@/components/tools/instant-estimator/estimator-card";
import { ResultCard } from "@/components/tools/instant-estimator/result-card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { CalculationResult } from "@/types/calculator";

export default function QuoteEstimator() {
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult>();

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4">
      <div className="w-full text-left mb-6">
        <h1 className="text-3xl font-bold">Quote Estimator</h1>
        <p className="text-lg">Project quote estimator</p>
      </div>

      {/* Responsive layout - column on mobile, row on desktop */}
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="w-full md:w-1/2">
          <EstimatorCard
            width="w-full"
            height="h-fit"
            onCalculate={setCalculationResult}
          />
        </div>

        {/* Horizontal separator for mobile, vertical for desktop */}
        <div className="md:hidden w-full my-4">
          <Separator orientation="horizontal" />
        </div>
        <div className="hidden md:block">
          <Separator orientation="vertical" />
        </div>

        <div className="w-full md:w-1/2">
          <ResultCard
            width="w-full"
            height="h-fit"
            result={calculationResult}
          />
        </div>
      </div>
    </div>
  );
}
