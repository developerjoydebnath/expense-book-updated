import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/lib/types";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useEffect } from "react";

export function ExpenseGraph({ refreshTrigger }: { refreshTrigger?: number }) {
  const { expenses, isLoading, mutate } = useExpenses();

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      mutate();
    }
  }, [refreshTrigger, mutate]);

  // Group by month (last 12 months)
  const data = Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(startOfMonth(new Date()), i);
    const key = format(date, "yyyy-MM");
    const label = format(date, "MMM yyyy");
    
    const total = (expenses || [])
      .filter((e: Expense) => {
        const expenseDate = parseISO(e.date);
        return format(expenseDate, "yyyy-MM") === key;
      })
      .reduce((sum: number, e: Expense) => sum + e.amount, 0);
      
    return { 
      fullDate: key,
      month: label,
      amount: total 
    };
  });

  if (isLoading) return <Card className="mt-8 h-[300px] animate-pulse bg-muted" />;

  return (
    <Card className="mt-8 border-destructive/20 shadow-lg bg-linear-to-br from-destructive/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          Monthly Expense Graph
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Last 12 Months</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fontWeight: 600 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
              />
              <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="amount" position="top" style={{ fontSize: 10, fill: '#ef4444', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}


// here i got a issue in the daily graph. every thing was okey for last 6 days as i started using it from last sunday and today is sunday also. last sunday my expense was 65tk and today my expense is 20 tk. here in graph it is showing 85tk that means the expense is showing last sunday + this sunday and i think ohter days will be same. but here the logic is to show only this days expense not the total of all sunday. fix this issue this is a major bug, and beside this disabled date in the calender after today. that means in the future date will be disabled. user only can select upto todays date not in future it make no sense