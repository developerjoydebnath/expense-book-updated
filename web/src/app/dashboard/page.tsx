'use client'

import { ExpenseGraph } from "@/components/dashboard/ExpenseGraph";
import { ExpenseTable } from "@/components/dashboard/ExpenseTable";
import { IncomeGraph } from "@/components/dashboard/IncomeGraph";
import { IncomeTable } from "@/components/dashboard/IncomeTable";
import { MonthlyExpenseTable } from "@/components/dashboard/MonthlyExpenseTable";
import { MonthlyIncomeTable } from "@/components/dashboard/MonthlyIncomeTable";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { AddMoneyForm } from "@/components/forms/AddMoneyForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useExpenses } from "@/hooks/useExpenses";
import { useIncomes } from "@/hooks/useIncomes";
import { useSummary } from "@/hooks/useSummary";
import { format } from "date-fns";
import { useState } from "react";

export default function DashboardPage() {
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { mutate: mutateExpenses } = useExpenses();
  const { mutate: mutateIncomes } = useIncomes();
  const { mutate: mutateSummary } = useSummary();

  const handleSuccess = () => {
    mutateExpenses();
    mutateIncomes();
    mutateSummary();
    setRefreshTrigger(prev => prev + 1);
    setAddMoneyOpen(false);
    setAddExpenseOpen(false);
  };

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <main className="container mx-auto py-8 px-4 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your finances with ease and precision.</p>
      </div>
      
      <SummaryStats 
        onAddMoney={() => setAddMoneyOpen(true)} 
        onAddExpense={() => setAddExpenseOpen(true)} 
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Add Money</DialogTitle></DialogHeader>
          <AddMoneyForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <AddExpenseForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseGraph refreshTrigger={refreshTrigger} />
        <IncomeGraph refreshTrigger={refreshTrigger} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border shadow-sm h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-destructive">
            Today&apos;s Expenses
          </h2>
          <ExpenseTable initialDate={today} hideFilter refreshTrigger={refreshTrigger} />
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
            Last 5 Incomes
          </h2>
          <IncomeTable 
            hideFilter 
            limit={5} 
            orderBy={[{ date: "DescNullsFirst" }]} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border shadow-sm h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-destructive">
            Monthly Expenses (Last 12 Months)
          </h2>
          <MonthlyExpenseTable refreshTrigger={refreshTrigger} />
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm h-full">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
            Monthly Incomes (Last 12 Months)
          </h2>
          <MonthlyIncomeTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}
