"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Vjezba {
  id: string;
  naziv: string;
  misicneSkupine: string[];
  slika: string;
  youtubeLink: string;
}

export default function TreningGeneratorPage() {
  const [vjezbe, setVjezbe] = useState<Vjezba[]>([]);
  const [odabraneVjezbe, setOdabraneVjezbe] = useState<string[]>([]);
  const [dani, setDani] = useState(3);
  const [cilj, setCilj] = useState("Snaga");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetch("data/vjezbe.json")
      .then((res) => res.json())
      .then((data) => setVjezbe(data));
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(plan);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSubmit = async () => {
    if (odabraneVjezbe.length === 0) return;

    setLoading(true);
    setPlan("");
    const prompt = `Generiraj tjedni trening plan za ${dani} dana s ciljem "${cilj}". Koristi samo sljedeće vježbe: ${odabraneVjezbe.join(
      ", "
    )}. Svaki dan neka bude različit i neka ne ponavlja potpuno iste vježbe. 

Za svaki dan prikaži samo ime vježbe i broj serija i ponavljanja, bez dodatnih objašnjenja, bez naslova "Serije x Ponavljanja", i bez ponavljanja zaglavlja tablice. 

Format odgovora neka bude u obliku:

Dan 1  
- Bench press — 4 x 6  
- Čučanj — 4 x 8  
- Trbušnjaci — 3 x 12  

Dan 2  
- Mrtvo dizanje — 4 x 6  
- ...  

Samo ovakav raspored, bez ikakvog dodatnog teksta.`;

    const res = await fetch("/api/generiraj-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setPlan(data.odgovor || "Greška pri generiranju.");
    setLoading(false);
  };

  const toggleVjezba = (naziv: string) => {
    setOdabraneVjezbe((prev) =>
      prev.includes(naziv) ? prev.filter((v) => v !== naziv) : [...prev, naziv]
    );
  };

  const ciljevi = [
    "Snaga",
    "Hipertrofija",
    "Izdržljivost",
    "Gubitak masti",
    "Opća kondicija",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            AI Trening Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Broj trening dana u tjednu</Label>
              <Select
                value={dani.toString()}
                onValueChange={(value) => setDani(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Odaberi broj dana" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} {day === 1 ? "dan" : "dana"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Treninski cilj</Label>
              <Select value={cilj} onValueChange={setCilj}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberi cilj" />
                </SelectTrigger>
                <SelectContent>
                  {ciljevi.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-lg font-semibold mb-4 block">
              Odaberi vježbe:
            </Label>

            {odabraneVjezbe.length < 3 && odabraneVjezbe.length > 0 && (
              <Alert variant="default" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Preporučamo odabir minimalno 3 vježbe za kvalitetniji trening
                  plan.
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
                        odabraneVjezbe.includes(vjezba.naziv)
                          ? "default"
                          : "outline"
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
                    <Badge
                      key={vjezba}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {vjezba}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSubmit}
                disabled={loading || odabraneVjezbe.length < 1}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generiram...
                  </>
                ) : (
                  "Generiraj trening plan"
                )}
              </Button>
            </TooltipTrigger>
            {odabraneVjezbe.length < 1 && (
              <TooltipContent>
                <p>Odaberite barem jednu vježbu za generiranje plana</p>
              </TooltipContent>
            )}
          </Tooltip>

          {plan && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Tvoj plan treninga</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!plan || isCopied}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Kopirano!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Kopiraj
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="whitespace-pre-wrap font-mono p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    {plan}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
