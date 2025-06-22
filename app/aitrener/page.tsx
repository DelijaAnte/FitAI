"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PlanOptions from "../components/PlanOptions";
import VjezbeSelector from "../components/VjezbeSelector";
import PlanOutput from "../components/PlanOutput";

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

  const ciljevi = [
    "Snaga",
    "Hipertrofija (mišićna masa)",
    "Izdržljivost",
    "Gubitak masti",
    "Opća kondicija",
  ];

  useEffect(() => {
    fetch("data/vjezbe.json")
      .then((res) => res.json())
      .then((data) => setVjezbe(data));
  }, []);

  const toggleVjezba = (naziv: string) => {
    setOdabraneVjezbe((prev) =>
      prev.includes(naziv) ? prev.filter((v) => v !== naziv) : [...prev, naziv]
    );
  };

  const handleSubmit = async () => {
    if (odabraneVjezbe.length === 0) return;

    setLoading(true);
    setPlan("");

    const prompt = `Generiraj tjedni trening plan za ${dani} dana s ciljem "${cilj}". Koristi samo sljedeće vježbe: ${odabraneVjezbe.join(
      ", "
    )}. Svaki dan neka bude različit i neka ne ponavlja potpuno iste vježbe.

Za svaku vježbu dodaj preporučeni broj serija i ponavljanja, kao i procijenjeni intenzitet u obliku RPE skale (npr. RPE 7 ili RPE 8-9). Format prikaza neka bude:

Dan 1  
- Bench press — 4 x 6 (RPE 8)  
- Čučanj — 4 x 8 (RPE 7-8)  
- Trbušnjaci — 3 x 12 (RPE 6)  

Dan 2  
- Mrtvo dizanje — 4 x 6 (RPE 9)  
- ...

Na kraju, ispod plana dodaj rečenicu:  
"RPE (Rate of Perceived Exertion) označava subjektivni osjećaj napora tijekom vježbe. Detaljnije: https://my.clevelandclinic.org/health/articles/17450-rated-perceived-exertion-rpe-scale"  

Nemoj dodavati ništa osim ovakvog rasporeda i tog jednog rečenog objašnjenja.`;

    const res = await fetch("/api/generiraj-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setPlan(data.odgovor || "Greška pri generiranju.");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            AI Trening Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Odabir dana i cilja */}
          <PlanOptions
            dani={dani}
            setDani={setDani}
            cilj={cilj}
            setCilj={setCilj}
            ciljevi={ciljevi}
          />

          <Separator className="border-blue-300" />

          {/* Odabir vježbi */}
          <VjezbeSelector
            vjezbe={vjezbe}
            odabraneVjezbe={odabraneVjezbe}
            toggleVjezba={toggleVjezba}
          />

          <Separator className="border-blue-300" />

          {/* Generiranje plana */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSubmit}
                disabled={loading || odabraneVjezbe.length < 1}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white"
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

          {/* Prikaz plana */}
          <PlanOutput plan={plan} onChange={setPlan} />
        </CardContent>
      </Card>
    </div>
  );
}
