'use client'

import { EPaperEditor } from "@/components/epaper/EPaperEditor";
import { useAddEPaper, useAddHotspot } from "@/hooks/useEPaper";
import { Hotspot } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateEPaperPage() {
  const router = useRouter();
  const { executeMutation: addEPaper, fetching: addingPaper } = useAddEPaper();
  const { executeMutation: addHotspots, fetching: addingHotspots } = useAddHotspot();

  const handleSave = async (title: string, imageUrl: string, hotspots: Omit<Hotspot, 'id' | 'ePaperId'>[]) => {
    try {
      const paperRes = await addEPaper({ object: { title, imageUrl } });
      if (paperRes.error) throw paperRes.error;

      const paperId = paperRes.data.insertIntoEPaperCollection.records[0].id;

      if (hotspots.length > 0) {
        const hotspotObjects = hotspots.map(h => ({
          ...h,
          ePaperId: paperId
        }));
        const hotspotRes = await addHotspots({ objects: hotspotObjects });
        if (hotspotRes.error) throw hotspotRes.error;
      }

      toast.success("E-Paper created successfully!");
      router.push("/epaper");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create E-Paper");
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New E-Paper</h1>
        <p className="text-muted-foreground">Upload an image and define interactive areas.</p>
      </div>
      
      <EPaperEditor onSave={handleSave} isLoading={addingPaper || addingHotspots} />
    </main>
  );
}
