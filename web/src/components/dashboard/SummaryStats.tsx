'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useSummary } from "@/hooks/useSummary";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export function SummaryStats({ 
  onAddMoney, 
  onAddExpense,
  refreshTrigger 
}: { 
  onAddMoney: () => void; 
  onAddExpense: () => void;
  refreshTrigger?: number;
}) {
  const { summary, isLoading, mutate } = useSummary();

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      mutate();
    }
  }, [refreshTrigger, mutate]);

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-32 animate-pulse bg-muted rounded-xl" />;
  if (!summary) return <div>No data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-primary font-semibold uppercase tracking-wider">Available Money</CardDescription>
          <Button size="icon" variant="default" onClick={onAddMoney} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
            <Plus size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.availableMoney?.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-destructive/20 to-destructive/5 border-destructive/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-destructive font-semibold uppercase tracking-wider">Today&apos;s Expense</CardDescription>
          <Button size="icon" variant="destructive" onClick={onAddExpense} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
            <Plus size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.todayExpense?.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-secondary/20 to-secondary/5 border-secondary/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-foreground font-semibold uppercase tracking-wider">Monthly Expense</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.thisMonthExpense?.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
