'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function LoginForm() {
  const form = useForm({ defaultValues: { email: "", password: "" } });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Login successful");
      router.replace("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Welcome Back</h2>
        <p className="text-muted-foreground mt-2">Enter your credentials to access your dashboard</p>
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
              <div className="flex justify-between items-center mb-1">
                <FormLabel className="text-sm font-semibold uppercase tracking-wider">Password</FormLabel>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <FormControl>
                <Input {...field} type="password" placeholder="••••••••" className="bg-background/50" autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/auth/register" className="text-primary font-bold hover:underline">
          Register now
        </Link>
      </div>
    </div>
  );
}
