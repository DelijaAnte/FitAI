"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../components/LoadingSpinner";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/auth-context";
import { toast } from "sonner";
import KalkulatorForm from "../components/KalkulatorForm";

export default function KalorijskiKalkulator() {
  const [spol, setSpol] = useState("muško");
  const [dob, setDob] = useState("");
  const [tezina, setTezina] = useState("");
  const [visina, setVisina] = useState("");
  const [aktivnost, setAktivnost] = useState("1.2");
  const [cilj, setCilj] = useState("održavanje");
  const [aiOdgovor, setAiOdgovor] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [stres, setStres] = useState("umjeren");
  const [posao, setPosao] = useState("sjedilački");

  const handleIzracun = async () => {
    setLoading(true);
    setAiOdgovor("");

    const prompt = `Na temelju ovih podataka izračunaj samo procijenjeni dnevni kalorijski unos (u kcal). Zatim ispod napiši tri kratke rečenice s praktičnim savjetima kako se osoba treba hraniti s obzirom na svoj cilj (mršavljenje, održavanje ili masa). Sva tri savjeta moraju biti različita i ne smiju se preklapati. Format odgovora neka bude ovakav:

[broj] kcal  
Savjet 1.

Savjet 2.

Savjet 3.

Podaci:  
- Spol: ${spol}  
- Dob: ${dob} godina  
- Težina: ${tezina} kg  
- Visina: ${visina} cm  
- Razina aktivnosti: ${aktivnost}  
- Cilj: ${cilj}  
- Razina stresa: ${stres}  
- Vrsta posla: ${posao}`;

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

  const handleSaveCalories = async () => {
    if (!user || !aiOdgovor) return;
    // Extract the first number before 'kcal'
    const match = aiOdgovor.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
    const calories = match ? parseFloat(match[1].replace(",", ".")) : null;
    if (!calories) {
      toast.error("Nije moguće prepoznati kalorijski unos.");
      return;
    }
    try {
      await setDoc(doc(db, "calories", user.uid), {
        calories,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      toast.success("Kalorijski unos je spremljen na profilu!");
    } catch {
      toast.error("Greška pri spremanju kalorijskog unosa.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Kalorijski kalkulator (AI)
          </CardTitle>

          <KalkulatorForm
            spol={spol}
            setSpol={setSpol}
            dob={dob}
            setDob={setDob}
            tezina={tezina}
            setTezina={setTezina}
            visina={visina}
            setVisina={setVisina}
            aktivnost={aktivnost}
            setAktivnost={setAktivnost}
            cilj={cilj}
            setCilj={setCilj}
            stres={stres}
            setStres={setStres}
            posao={posao}
            setPosao={setPosao}
          />

          <Button
            onClick={handleIzracun}
            disabled={
              loading ||
              !dob ||
              !tezina ||
              !visina ||
              !spol ||
              !aktivnost ||
              !cilj ||
              !stres ||
              !posao
            }
            className="w-full bg-blue-500 hover:bg-blue-700 text-white"
          >
            {loading ? <LoadingSpinner /> : "Izračunaj s AI-em"}
          </Button>

          {aiOdgovor && (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded whitespace-pre-wrap mt-4 font-mono text-sm">
                {aiOdgovor}
              </div>
              {user && (
                <Button
                  onClick={handleSaveCalories}
                  className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white"
                >
                  Spremi kalorijski unos
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
