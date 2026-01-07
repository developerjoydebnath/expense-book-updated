'use client';

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { useDeleteEPaper, useEPapers } from "@/hooks/useEPaper";
import { EPaper } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, Eye, Loader2, Newspaper, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function EPaperGalleryPage() {
  const { ePapers, isLoading, mutate } = useEPapers();
  const { executeMutation: deleteEPaper, fetching: deleting } = useDeleteEPaper();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEPaper({ id: deleteId });
      toast.success("E-Paper deleted");
      mutate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading e-papers...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center bg-linear-to-r from-blue-500/10 to-transparent p-6 rounded-2xl border border-blue-500/20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">E-Paper Archive</h1>
          <p className="text-muted-foreground">Manage and view your interactive newspaper pages.</p>
        </div>
        <Link href="/epaper/create">
          <Button className="gap-2 shadow-lg">
            <Plus size={18} />
            Create New E-Paper
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ePapers.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-muted/30 rounded-3xl border-2 border-dashed">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No E-Papers found</h3>
              <p className="text-muted-foreground">Start by creating your first interactive newspaper page.</p>
            </div>
            <Link href="/epaper/create">
              <Button variant="outline">Create First Paper</Button>
            </Link>
          </div>
        )}
        
        {ePapers.map((paper: EPaper) => (
          <Card key={paper.id} className="group overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm hover:translate-y-[-4px] transition-all duration-300">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={paper.imageUrl} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                alt={paper.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium opacity-80 flex items-center gap-1">
                  <Calendar size={12} />
                  {format(new Date(paper.createdAt), "MMM dd, yyyy")}
                </p>
                <h3 className="text-lg font-bold leading-tight line-clamp-2">{paper.title}</h3>
              </div>
            </div>
            <CardFooter className="p-3 bg-muted/30 flex justify-between gap-2 border-t">
              <Link href={`/epaper/${paper.id}`} className="flex-1">
                <Button className="w-full gap-2 h-9" variant="outline">
                  <Eye size={14} />
                  View
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive" 
                onClick={() => setDeleteId(paper.id)}
              >
                <Trash2 size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete E-Paper"
        message="Are you sure you want to delete this e-paper and all its hotspots? This action is permanent."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </main>
  );
}
