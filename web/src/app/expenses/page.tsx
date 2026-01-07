'use client'

import { ExpenseTable } from "@/components/dashboard/ExpenseTable";
import { MonthlyExpenseHistoryTable } from "@/components/dashboard/MonthlyExpenseHistoryTable";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useExpenses } from "@/hooks/useExpenses";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ExpensesPage() {
  const [open, setOpen] = useState(false);
  const { mutate } = useExpenses();

  const handleSuccess = () => {
    mutate();
    setOpen(false);
  };

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center bg-linear-to-r from-blue-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-destructive">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your daily expenditures.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-destructive/20 transition-all gap-2 bg-destructive hover:bg-destructive/90">
              <Plus size={20} />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <AddExpenseForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ExpenseTable />
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b text-destructive">
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MonthlyExpenseHistoryTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
