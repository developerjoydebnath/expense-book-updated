'use client';

import { IncomeTable } from "@/components/dashboard/IncomeTable";
import { MonthlyIncomeHistoryTable } from "@/components/dashboard/MonthlyIncomeHistoryTable";
import { AddMoneyForm } from "@/components/forms/AddMoneyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIncomes } from "@/hooks/useIncomes";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function IncomesPage() {
  const [open, setOpen] = useState(false);
  const { mutate } = useIncomes();

  const handleSuccess = () => {
    mutate();
    setOpen(false);
  };

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center bg-linear-to-r from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-primary">Incomes</h1>
          <p className="text-muted-foreground">Manage your earnings and sources of revenue.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all gap-2">
              <Plus size={20} />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
            </DialogHeader>
            <AddMoneyForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <IncomeTable />
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b text-primary">
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MonthlyIncomeHistoryTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
