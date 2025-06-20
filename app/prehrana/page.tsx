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

export default function KalorijskiKalkulator() {
  const [spol, setSpol] = useState("muško");
  const [dob, setDob] = useState("");
  const [tezina, setTezina] = useState("");
  const [visina, setVisina] = useState("");
  const [aktivnost, setAktivnost] = useState("1.2");
  const [cilj, setCilj] = useState("održavanje");

  const parseNum = (val: string) => parseFloat(val) || 0;

  const bmr =
    spol === "muško"
      ? 10 * parseNum(tezina) + 6.25 * parseNum(visina) - 5 * parseNum(dob) + 5
      : 10 * parseNum(tezina) +
        6.25 * parseNum(visina) -
        5 * parseNum(dob) -
        161;

  const tdee = bmr * parseFloat(aktivnost);

  const kalorije =
    cilj === "mršavljenje" ? tdee - 500 : cilj === "masa" ? tdee + 500 : tdee;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <CardTitle>Kalorijski kalkulator</CardTitle>

          <div>
            <Label>Spol</Label>
            <Select value={spol} onValueChange={setSpol}>
              <SelectTrigger>
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
              <Label>Dob</Label>
              <Input
                type="number"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <Label>Težina (kg)</Label>
              <Input
                type="number"
                value={tezina}
                onChange={(e) => setTezina(e.target.value)}
              />
            </div>
            <div>
              <Label>Visina (cm)</Label>
              <Input
                type="number"
                value={visina}
                onChange={(e) => setVisina(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Razina aktivnosti</Label>
            <Select value={aktivnost} onValueChange={setAktivnost}>
              <SelectTrigger>
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
            <Label>Cilj</Label>
            <Select value={cilj} onValueChange={setCilj}>
              <SelectTrigger>
                <SelectValue placeholder="Cilj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mršavljenje">Mršavljenje</SelectItem>
                <SelectItem value="održavanje">Održavanje</SelectItem>
                <SelectItem value="masa">Dobivanje mase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold">Rezultat</h3>
            <p>BMR: {bmr.toFixed(0)} kcal</p>
            <p>TDEE: {tdee.toFixed(0)} kcal</p>
            <p>Ciljane kalorije: {kalorije.toFixed(0)} kcal/dan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
