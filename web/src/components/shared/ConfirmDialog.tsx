'use client';

import { AlertDialog, AlertDialogContent, AlertDialogOverlay } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <div className="mb-4">{message}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
