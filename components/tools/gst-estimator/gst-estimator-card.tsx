"use client";
import * as React from "react";

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

interface GSTEstimatorCardProps {
  width?: string;
  height?: string;
}

export function GSTEstimatorCard({
  width = "w-[350px]",
  height = "min-h-[600px]",
}: GSTEstimatorCardProps) {
  const [amount, setAmount] = React.useState<string>("");
  const [gstRate, setGstRate] = React.useState<string>("9");
  const [customGst, setCustomGst] = React.useState<string>("");
  const [result, setResult] = React.useState<number | null>(null);

  const calculateGST = () => {
    const baseAmount = parseFloat(amount);
    const rate =
      gstRate === "custom" ? parseFloat(customGst) : parseFloat(gstRate);
    if (!isNaN(baseAmount) && !isNaN(rate)) {
      const gstAmount = (baseAmount * rate) / 100;
      setResult(gstAmount);
    }
  };

  return (
    <Card className={`${width} ${height} shadow-2xl`}>
      <CardHeader>
        <CardTitle>GST Calculator</CardTitle>
        <CardDescription>
          Calculate GST amount for your transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateGST();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>GST Rate</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={gstRate === "9" ? "default" : "outline"}
                  onClick={() => setGstRate("9")}
                  className="flex-1"
                >
                  9%
                </Button>
                <Button
                  type="button"
                  variant={gstRate === "18" ? "default" : "outline"}
                  onClick={() => setGstRate("18")}
                  className="flex-1"
                >
                  18%
                </Button>
                <Button
                  type="button"
                  variant={gstRate === "custom" ? "default" : "outline"}
                  onClick={() => setGstRate("custom")}
                  className="flex-1"
                >
                  Custom
                </Button>
              </div>
            </div>
            {gstRate === "custom" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="customGst">Custom GST %</Label>
                <Input
                  id="customGst"
                  placeholder="Enter GST percentage"
                  type="number"
                  value={customGst}
                  onChange={(e) => setCustomGst(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              Calculate
            </Button>
            {result !== null && (
              <div className="mt-4 p-4 bg-secondary rounded-md">
                <p className="text-center">GST Amount: ₹{result.toFixed(2)}</p>
                <p className="text-center">
                  Total Amount: ₹{(parseFloat(amount) + result).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
