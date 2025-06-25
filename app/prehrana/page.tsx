"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KalorijskiKalkulator() {
  const [spol, setSpol] = useState("muško");
  const [dob, setDob] = useState("");
  const [tezina, setTezina] = useState("");
  const [visina, setVisina] = useState("");
  const [aktivnost, setAktivnost] = useState("1.2");
  const [cilj, setCilj] = useState("održavanje");
  const [aiOdgovor, setAiOdgovor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIzracun = async () => {
    setLoading(true);
    setAiOdgovor("");

    const prompt = `Na temelju ovih podataka izračunaj samo procijenjeni dnevni kalorijski unos (u kcal). Zatim ispod napiši dvije kratke rečenice s praktičnim savjetima kako se osoba treba hraniti s obzirom na svoj cilj (mršavljenje, održavanje ili masa). Format odgovora neka bude ovakav:

[broj] kcal  
Savjet 1.  
Savjet 2.

Podaci:  
- Spol: ${spol}  
- Dob: ${dob} godina  
- Težina: ${tezina} kg  
- Visina: ${visina} cm  
- Razina aktivnosti: ${aktivnost}  
- Cilj: ${cilj}`;

    try {
      const res = await fetch("/api/ai-kalorije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiOdgovor(data.odgovor || "Došlo je do greške.");
    } catch {
      setAiOdgovor("Došlo je do greške pri komunikaciji s AI servisom.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Kalorijski kalkulator (AI)
          </CardTitle>

          <div>
            <Label className="mb-1">Spol</Label>
            <Select value={spol} onValueChange={setSpol}>
              <SelectTrigger className="border border-blue-300">
                <SelectValue placeholder="Odaberi spol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muško">Muško</SelectItem>
                <SelectItem value="žensko">Žensko</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1">Dob</Label>
              <Input
                type="number"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="border border-blue-300"
              />
            </div>
            <div>
              <Label className="mb-1">Težina (kg)</Label>
              <Input
                type="number"
                value={tezina}
                onChange={(e) => setTezina(e.target.value)}
                className="border border-blue-300"
              />
            </div>
            <div>
              <Label className="mb-1">Visina (cm)</Label>
              <Input
                type="number"
                value={visina}
                onChange={(e) => setVisina(e.target.value)}
                className="border border-blue-300"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1">Razina aktivnosti</Label>
            <Select value={aktivnost} onValueChange={setAktivnost}>
              <SelectTrigger className="border border-blue-300">
                <SelectValue placeholder="Aktivnost" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.2">Sedentarno</SelectItem>
                <SelectItem value="1.375">
                  Lagano aktivan (1–3 dana/tjedno)
                </SelectItem>
                <SelectItem value="1.55">
                  Umjereno aktivan (3–5 dana/tjedno)
                </SelectItem>
                <SelectItem value="1.725">
                  Vrlo aktivan (6–7 dana/tjedno)
                </SelectItem>
                <SelectItem value="1.9">Ekstremno aktivan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1">Cilj</Label>
            <Select value={cilj} onValueChange={setCilj}>
              <SelectTrigger className="border border-blue-300">
                <SelectValue placeholder="Cilj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mršavljenje">Mršavljenje</SelectItem>
                <SelectItem value="održavanje">Održavanje</SelectItem>
                <SelectItem value="masa">Dobivanje mase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleIzracun}
            disabled={
              loading ||
              !dob ||
              !tezina ||
              !visina ||
              !spol ||
              !aktivnost ||
              !cilj
            }
            className="w-full bg-blue-500 hover:bg-blue-700 text-white"
          >
            {loading ? "Računam..." : "Izračunaj s AI-em"}
          </Button>

          {aiOdgovor && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded whitespace-pre-wrap mt-4 font-mono text-sm">
              {aiOdgovor}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
