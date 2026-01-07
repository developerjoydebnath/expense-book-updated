'use client';

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import { User } from "@/lib/types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UsersTable() {
  const { users, isLoading, mutate } = useUsers();
  const { executeMutation: deleteUser, fetching: deleting } = useDeleteUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser({ id: deleteId });
      mutate();
      toast.success("User deleted successfully");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-full animate-pulse bg-muted rounded" />)}</div>;
  if (!users || users.length === 0) return <div className="text-center py-10 text-muted-foreground">No users found</div>;

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Role</TableHead>
            <TableHead className="font-bold text-center">Created At</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="font-semibold">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground text-sm">
                {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                {user.role !== 'ADMIN' && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                    onClick={() => setDeleteId(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Delete"
      />
    </div>
  );
}
