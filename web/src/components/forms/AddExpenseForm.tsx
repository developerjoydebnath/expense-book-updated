'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddExpense } from "@/hooks/useExpenses";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DatePicker } from "../shared/DatePicker";

type ExpenseFormData = {
  source: string;
  amount: string;
  date: string;
};

export function AddExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<ExpenseFormData>({ 
    defaultValues: { 
      source: "", 
      amount: "", 
      date: format(new Date(), "yyyy-MM-dd") 
    } 
  });
  const { executeMutation, fetching } = useAddExpense();

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add an expense");
        return;
      }

      await executeMutation({
        object: {
          source: data.source,
          amount: parseFloat(data.amount),
          date: data.date,
          userId: user.id
        }
      });
      toast.success("Expense added!");
      form.reset({
        source: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd")
      });
      console.log('before on success')
      onSuccess?.();
      console.log('after on success')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add expense");
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
          Add Expense
        </Button>
      </form>
    </Form>
  );
}
