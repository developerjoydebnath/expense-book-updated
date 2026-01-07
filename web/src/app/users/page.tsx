'use client';

import { UsersTable } from "@/components/dashboard/UsersTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { isAdmin, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have the required permissions to view this page. This area is reserved for system administrators only.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="bg-linear-to-r from-blue-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20 shadow-sm">
        <h1 className="text-3xl font-bold text-blue-600">User Management</h1>
        <p className="text-muted-foreground">View all registered users in the system.</p>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <UsersTable />
        </CardContent>
      </Card>
    </main>
  );
}
