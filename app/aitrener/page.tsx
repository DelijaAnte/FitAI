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
import { useAuth } from "../context/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

import PlanOptions from "../components/PlanOptions";
import VjezbeSelector from "../components/VjezbeSelector";
import PlanOutput from "../components/PlanOutput";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const [iskustvo, setIskustvo] = useState("početnik");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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

    const prompt = `Generiraj tjedni trening plan za ${dani} dana s ciljem "${cilj}" za osobu s razinom iskustva "${iskustvo}". Koristi samo sljedeće vježbe: ${odabraneVjezbe.join(
      ", "
    )}. Svaki dan neka bude različit i neka ne ponavlja potpuno iste vježbe.

Prilagodi plan prema razini iskustva:
- Početnik: manje serija, više ponavljanja, niži intenzitet
- Srednje napredni: umjeren broj serija i ponavljanja
- Napredni: više serija, manje ponavljanja, viši intenzitet

Za svaku vježbu dodaj preporučeni broj serija i ponavljanja, kao i procijenjeni intenzitet u obliku RPE skale (npr. RPE 7 ili RPE 8-9). Format prikaza neka bude:

Dan 1  
- Bench press — 4 x 6 (RPE 8)  
- Čučanj — 4 x 8 (RPE 7-8)  
- Trbušnjaci — 3 x 12 (RPE 6)  

Dan 2  
- Mrtvo dizanje — 4 x 6 (RPE 9)  
- ...

Nemoj dodavati ništa osim ovakvog rasporeda.`;

    const res = await fetch("/api/generiraj-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setPlan(data.odgovor || "Greška pri generiranju.");
    setLoading(false);
  };

  const handleSavePlan = async () => {
    if (!user || !plan) return;
    try {
      await setDoc(doc(db, "plans", user.uid), {
        plan,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      toast.success("Plan je spremljen na profilu!");
    } catch {
      toast.error("Greška pri spremanju plana.");
    }
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
          {/* Odabir dana, cilja i iskustva */}
          <PlanOptions
            dani={dani}
            setDani={setDani}
            cilj={cilj}
            setCilj={setCilj}
            ciljevi={ciljevi}
            iskustvo={iskustvo}
            setIskustvo={setIskustvo}
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
                {loading ? <LoadingSpinner /> : "Generiraj trening plan"}
              </Button>
            </TooltipTrigger>
            {odabraneVjezbe.length < 1 && (
              <TooltipContent>
                <p>Odaberite barem jednu vježbu za generiranje plana</p>
              </TooltipContent>
            )}
          </Tooltip>

          {/* Prikaz plana */}
          <PlanOutput
            plan={plan}
            onChange={setPlan}
            onSavePlan={plan && user ? handleSavePlan : undefined}
            showSaveButton={!!plan && !!user}
            saveButtonClassName="bg-blue-500 hover:bg-blue-700 text-white"
          />
        </CardContent>
      </Card>
    </div>
  );
}
