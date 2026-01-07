'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditExpense } from "@/hooks/useExpenses";
import { Expense } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ExpenseFormData = {
  source: string;
  amount: string;
  date: string;
};

import { DatePicker } from "../shared/DatePicker";

export function EditExpenseForm({ expense, onSuccess }: { expense: Expense; onSuccess?: () => void }) {
  const form = useForm<ExpenseFormData>({ 
    defaultValues: { 
      source: expense.source, 
      amount: expense.amount.toString(), 
      date: expense.date 
    } 
  });
  const { executeMutation, fetching } = useEditExpense();

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await executeMutation({
        id: expense.id,
        object: {
          source: data.source,
          amount: parseFloat(data.amount),
          date: data.date
        }
      });
      toast.success("Expense updated!");
      onSuccess?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update expense");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="source" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Source</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Source" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input {...field} type="number" placeholder="Amount" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="date" control={form.control} render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <FormControl>
              <DatePicker 
                value={field.value} 
                onChange={field.onChange} 
                disabledFuture 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={fetching}>
          {fetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Expense
        </Button>
      </form>
    </Form>
  );
}
