"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Project {
  budget: number;
  paid: number;
}

interface PieChartProps {
  width?: string;
  height?: string;
  buttonText?: string;
}

export function Component({
  width = "w-[350px]",
  height = "h-auto",
  buttonText = "Button",
}: PieChartProps) {
  const { data: session } = useSession();
  const [totalBudget, setTotalBudget] = React.useState(0);
  const [totalPaid, setTotalPaid] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        if (session?.user?.username) {
          const response = await fetch(
            `/api/projects/client?username=${session.user.username}`
          );
          if (response.ok) {
            const projects: Project[] = await response.json();
            const budget = projects.reduce(
              (acc, project) => acc + (project.budget || 0),
              0
            );
            const paid = projects.reduce(
              (acc, project) => acc + (project.paid || 0),
              0
            );
            setTotalBudget(budget);
            setTotalPaid(paid);
          }
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [session]);

  const balance = totalBudget - totalPaid;

  const chartData = [
    { status: "paid", amount: totalPaid, fill: "#4ade80" },
    { status: "balance", amount: balance, fill: "#60a5fa" },
  ];

  const chartConfig = {
    amount: {
      label: "Amount",
    },
    paid: {
      label: "Paid",
      color: "#4ade80",
    },
    balance: {
      label: "Balance",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card className={`${width} ${height} flex flex-col shadow-2xl`}>
        <CardContent className="flex items-center justify-center h-full">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${width} ${height} flex flex-col shadow-2xl`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <div className="flex items-center justify-between space-x-2">
            <h1>Payment Status</h1>
            <Link href="/finance">
              <Button variant="default" className="cursor-pointer">
                {buttonText}
              </Button>
            </Link>
          </div>
        </CardTitle>
        <CardDescription>Current Payment Breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹{totalBudget.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex flex-col w-[95%] h-[30%] items-center justify-center">
          <div className="grid grid-cols-2 w-full">
            <h1 className="font-medium text-left">Total Amount:</h1>
            <h1 className="font-medium text-right">
              ₹{totalBudget.toLocaleString()}
            </h1>
          </div>
          <div className="grid grid-cols-2 w-full">
            <h1 className="font-medium text-left">Paid Amount:</h1>
            <h1 className="font-medium text-right">
              ₹{totalPaid.toLocaleString()}
            </h1>
          </div>
          <div className="grid grid-cols-2 w-full">
            <h1 className="font-medium text-left">Balance Amount:</h1>
            <h1 className="font-medium text-right">
              ₹{balance.toLocaleString()}
            </h1>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
