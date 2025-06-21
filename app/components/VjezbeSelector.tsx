// components/VjezbeSelector.tsx
"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Vjezba {
  id: string;
  naziv: string;
  misicneSkupine: string[];
  slika: string;
  youtubeLink: string;
}

interface VjezbeSelectorProps {
  vjezbe: Vjezba[];
  odabraneVjezbe: string[];
  toggleVjezba: (naziv: string) => void;
}

export default function VjezbeSelector({
  vjezbe,
  odabraneVjezbe,
  toggleVjezba,
}: VjezbeSelectorProps) {
  return (
    <div>
      <Label className="text-lg font-semibold mb-4 block">
        Odaberi vježbe:
      </Label>

      {odabraneVjezbe.length < 3 && odabraneVjezbe.length > 0 && (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Preporučamo odabir minimalno 3 vježbe za kvalitetniji trening plan.
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {vjezbe.length > 0 ? (
            vjezbe.map((vjezba) => (
              <Button
                key={vjezba.id}
                variant={
                  odabraneVjezbe.includes(vjezba.naziv) ? "default" : "outline"
                }
                onClick={() => toggleVjezba(vjezba.naziv)}
                className="justify-start truncate"
              >
                {vjezba.naziv}
              </Button>
            ))
          ) : (
            <div className="space-y-2 col-span-3">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {odabraneVjezbe.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium">
            Odabrane vježbe ({odabraneVjezbe.length}):
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {odabraneVjezbe.map((vjezba) => (
              <Badge key={vjezba} variant="secondary" className="px-3 py-1">
                {vjezba}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
