'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddIncome } from "@/hooks/useIncomes";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type MoneyFormData = {
  source: string;
  amount: string;
  date: string;
};

import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { DatePicker } from "../shared/DatePicker";

export function AddMoneyForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<MoneyFormData>({ 
    defaultValues: { 
      source: "", 
      amount: "", 
      date: format(new Date(), "yyyy-MM-dd") 
    } 
  });
  const { executeMutation, fetching } = useAddIncome();

  const onSubmit = async (data: MoneyFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add money");
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
      toast.success("Money added!");
      form.reset({
        source: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd")
      });
      onSuccess?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add money");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="source" control={form.control} render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Source (e.g. Salary)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} type="number" placeholder="Amount" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="date" control={form.control} render={({ field }) => (
          <FormItem className="flex flex-col">
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
          Add Money
        </Button>
      </form>
    </Form>
  );
}
