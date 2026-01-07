'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function RegisterForm() {
  const form = useForm({ defaultValues: { email: "", password: "" } });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success("Registration successful");
      router.replace("/auth/login");
    } catch (e: any) {
      toast.error(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Create Account</h2>
        <p className="text-muted-foreground mt-2">Start managing your daily expenses efficiently</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wider">Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="name@example.com" className="bg-background/50" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold uppercase tracking-wider">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="••••••••" className="bg-background/50" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            {loading ? "Registering..." : "Create Account"}
          </Button>
        </form>
      </Form>
      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/auth/login" className="text-primary font-bold hover:underline">
          Login now
        </Link>
      </div>
    </div>
  );
}
