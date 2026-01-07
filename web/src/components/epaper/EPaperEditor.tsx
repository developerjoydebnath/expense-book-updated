'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hotspot } from "@/lib/types";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";

interface EPaperEditorProps {
  onSave: (title: string, imageUrl: string, hotspots: Omit<Hotspot, 'id' | 'ePaperId'>[]) => void;
  isLoading?: boolean;
}

export function EPaperEditor({ onSave, isLoading }: EPaperEditorProps) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hotspots, setHotspots] = useState<Omit<Hotspot, 'id' | 'ePaperId'>[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRelativeCoords = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageUrl) return;
    setIsDrawing(true);
    const coords = getRelativeCoords(e);
    setStartPos(coords);
    setCurrentRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentRect) return;
    const coords = getRelativeCoords(e);
    setCurrentRect({
      x: Math.min(startPos.x, coords.x),
      y: Math.min(startPos.y, coords.y),
      w: Math.abs(coords.x - startPos.x),
      h: Math.abs(coords.y - startPos.y)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect || currentRect.w < 2 || currentRect.h < 2) {
      setIsDrawing(false);
      setCurrentRect(null);
      return;
    }
    
    const newHotspot: Omit<Hotspot, 'id' | 'ePaperId'> = {
      x: currentRect.x,
      y: currentRect.y,
      width: currentRect.w,
      height: currentRect.h,
      title: "New Article",
      content: ""
    };
    
    setHotspots([...hotspots, newHotspot]);
    setEditingHotspot(hotspots.length);
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const updateHotspot = (index: number, data: Partial<Hotspot>) => {
    const updated = [...hotspots];
    updated[index] = { ...updated[index], ...data };
    setHotspots(updated);
  };

  const removeHotspot = (index: number) => {
    setHotspots(hotspots.filter((_, i) => i !== index));
    setEditingHotspot(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paper Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Paper Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Daily News - Jan 6, 2026" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Page Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3">
              <CardTitle className="text-sm font-medium">Editor Canvas (Drag to draw areas)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative bg-slate-900 min-h-[400px] flex items-center justify-center cursor-crosshair">
              {!imageUrl ? (
                <div className="text-muted-foreground text-center p-12">
                  <Plus className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Upload an image to start mapping areas</p>
                </div>
              ) : (
                <div 
                  ref={containerRef}
                  className="relative inline-block select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  <img 
                    ref={imgRef}
                    src={imageUrl} 
                    alt="Paper to map" 
                    className="max-w-full block"
                    draggable={false}
                  />
                  
                  {/* Existing Hotspots */}
                  {hotspots.map((h, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute border-2 border-primary bg-primary/20 cursor-pointer group hover:bg-primary/40 transition-colors",
                        editingHotspot === i && "ring-2 ring-white ring-offset-2 ring-offset-primary bg-primary/50"
                      )}
                      style={{
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        width: `${h.width}%`,
                        height: `${h.height}%`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingHotspot(i);
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h.title}
                      </div>
                    </div>
                  ))}

                  {/* Current Drawing Selection */}
                  {currentRect && (
                    <div
                      className="absolute border-2 border-dashed border-white bg-white/20 pointer-events-none"
                      style={{
                        left: `${currentRect.x}%`,
                        top: `${currentRect.y}%`,
                        width: `${currentRect.w}%`,
                        height: `${currentRect.h}%`
                      }}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hotspots ({hotspots.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-2">
                {hotspots.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No areas defined yet</p>
                )}
                {hotspots.map((h, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "p-2 rounded border text-sm flex justify-between items-center cursor-pointer hover:bg-muted transition-colors",
                      editingHotspot === i && "bg-primary/10 border-primary"
                    )}
                    onClick={() => setEditingHotspot(i)}
                  >
                    <span className="truncate flex-1 font-medium">{h.title}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHotspot(i);
                      }}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-12 gap-2 shadow-lg" 
            disabled={!title || !imageUrl || hotspots.length === 0 || isLoading}
            onClick={() => onSave(title, imageUrl, hotspots)}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            Save E-Paper
          </Button>
        </div>
      </div>

      {/* Edit Hotspot Modal */}
      <Dialog open={editingHotspot !== null} onOpenChange={() => setEditingHotspot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hotspot Content</DialogTitle>
          </DialogHeader>
          {editingHotspot !== null && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Article Headline</Label>
                <Input 
                  value={hotspots[editingHotspot].title}
                  onChange={(e) => updateHotspot(editingHotspot, { title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>News Content</Label>
                <Textarea 
                  className="min-h-[200px]"
                  value={hotspots[editingHotspot].content}
                  onChange={(e) => updateHotspot(editingHotspot, { content: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setEditingHotspot(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
