'use client';

import { EPaperViewer } from "@/components/epaper/EPaperViewer";
import { Button } from "@/components/ui/button";
import { useEPaper } from "@/hooks/useEPaper";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ViewEPaperPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { ePaper, isLoading, error } = useEPaper(id as string);

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (error || !ePaper) return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold text-destructive">Error</h1>
      <p className="text-muted-foreground">{error?.message || "E-Paper not found"}</p>
      <Link href="/epaper">
        <Button variant="link" className="mt-4">Back to Archive</Button>
      </Link>
    </div>
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/epaper">
          <Button variant="ghost" className="gap-2 -ml-3 text-muted-foreground hover:text-primary">
            <ChevronLeft size={18} />
            Back to Archive
          </Button>
        </Link>
      </div>

      <EPaperViewer ePaper={ePaper} />
    </main>
  );
}
