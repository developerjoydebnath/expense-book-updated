'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const form = useForm({ defaultValues: { email: "" } });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword(data);
      toast.success("Password reset email sent");
      form.reset();
    } catch (e: any) {
      toast.error(e.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Email" autoComplete="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}
