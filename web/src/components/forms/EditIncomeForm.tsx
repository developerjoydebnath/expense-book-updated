'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditIncome } from "@/hooks/useIncomes";
import { Income } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type IncomeFormData = {
  source: string;
  amount: string;
  date: string;
};

import { DatePicker } from "../shared/DatePicker";

export function EditIncomeForm({ income, onSuccess }: { income: Income; onSuccess?: () => void }) {
  const form = useForm<IncomeFormData>({ 
    defaultValues: { 
      source: income.source, 
      amount: income.amount.toString(), 
      date: income.date 
    } 
  });
  const { executeMutation, fetching } = useEditIncome();

  const onSubmit = async (data: IncomeFormData) => {
    try {
      await executeMutation({
        id: income.id,
        object: {
          source: data.source,
          amount: parseFloat(data.amount),
          date: data.date
        }
      });
      toast.success("Income updated!");
      onSuccess?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update income");
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
          Update Income
        </Button>
      </form>
    </Form>
  );
}
