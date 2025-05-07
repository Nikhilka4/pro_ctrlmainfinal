"use client";

import React, { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import { FinanceTable } from "./finance-data-table";
import { useSession } from "next-auth/react";

interface FinancialSummary {
  totalBudget: number;
  totalPaid: number;
  totalBalance: number;
}

interface Project {
  budget: number;
  paid: number;
}

export function FinanceOverview() {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBudget: 0,
    totalPaid: 0,
    totalBalance: 0,
  });
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        if (session?.user?.username) {
          const response = await fetch(
            `/api/projects/client?username=${session.user.username}`
          );
          if (response.ok) {
            const projects = await response.json();
            const totalBudget = projects.reduce(
              (acc: number, project: Project) => acc + (project.budget || 0),
              0
            );
            const totalPaid = projects.reduce(
              (acc: number, project: Project) => acc + (project.paid || 0),
              0
            );
            const totalBalance = totalBudget - totalPaid;

            setSummary({
              totalBudget,
              totalPaid,
              totalBalance,
            });
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

  if (loading) {
    return <div>Loading financial data...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-5">
      <div className="h-[45%] md:h-[25%] w-[90%] grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-14 my-4">
        <div className="h-full w-full flex items-center justify-center rounded-4xl shadow-xl border-1 border-muted bg-[#4ade80]">
          <IndianRupee className="h-7 md:h-10 w-7 md:w-10" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">
              ₹{summary.totalBudget.toLocaleString()}
            </span>
            <span className="text-sm">Total Budget</span>
          </div>
        </div>
        <div className="h-full w-full flex items-center justify-center rounded-4xl shadow-xl border-1 border-muted bg-[#60a5fa]">
          <IndianRupee className="h-7 md:h-10 w-7 md:w-10" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">
              ₹{summary.totalPaid.toLocaleString()}
            </span>
            <span className="text-sm">Amount Paid</span>
          </div>
        </div>
        <div className="h-full w-full flex items-center justify-center rounded-4xl shadow-xl border-1 border-muted bg-[#de6f4a]">
          <IndianRupee className="h-7 md:h-10 w-7 md:w-10" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">
              ₹{summary.totalBalance.toLocaleString()}
            </span>
            <span className="text-sm">Balance Amount</span>
          </div>
        </div>
      </div>
      <div className="h-[55%] md:h-[75%] w-[90%] flex items-center justify-center">
        <FinanceTable width="w-full" height="h-full" />
      </div>
    </div>
  );
}
