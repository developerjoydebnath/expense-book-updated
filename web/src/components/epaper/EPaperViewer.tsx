'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EPaper, Hotspot } from "@/lib/types";
import { Newspaper } from "lucide-react";
import { useState } from "react";

interface EPaperViewerProps {
  ePaper: EPaper;
}

export function EPaperViewer({ ePaper }: EPaperViewerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{ePaper.title}</h1>
            <p className="text-sm text-muted-foreground">Click on any highlighted area to read the full article</p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl bg-slate-950">
        <CardContent className="p-0 relative flex justify-center">
          <div className="relative inline-block overflow-hidden">
            <img 
              src={ePaper.imageUrl} 
              alt={ePaper.title} 
              className="max-w-full h-auto block"
              draggable={false}
            />
            
            {/* Hotspots */}
            {ePaper.hotspots?.map((h) => (
              <div
                key={h.id}
                className="absolute border border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/20 hover:border-primary transition-all duration-300 group"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${h.width}%`,
                  height: `${h.height}%`
                }}
                onClick={() => setSelectedHotspot(h)}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded shadow-lg">
                    Read Story
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedHotspot} onOpenChange={() => setSelectedHotspot(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-2xl font-bold leading-tight">{selectedHotspot?.title}</DialogTitle>
            <DialogDescription>
              Article from {ePaper.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {selectedHotspot?.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
