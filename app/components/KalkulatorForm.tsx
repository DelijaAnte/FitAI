import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface KalkulatorFormProps {
  spol: string;
  setSpol: (v: string) => void;
  dob: string;
  setDob: (v: string) => void;
  tezina: string;
  setTezina: (v: string) => void;
  visina: string;
  setVisina: (v: string) => void;
  aktivnost: string;
  setAktivnost: (v: string) => void;
  cilj: string;
  setCilj: (v: string) => void;
  stres: string;
  setStres: (v: string) => void;
  posao: string;
  setPosao: (v: string) => void;
}

export default function KalkulatorForm({
  spol,
  setSpol,
  dob,
  setDob,
  tezina,
  setTezina,
  visina,
  setVisina,
  aktivnost,
  setAktivnost,
  cilj,
  setCilj,
  stres,
  setStres,
  posao,
  setPosao,
}: KalkulatorFormProps) {
  const [dobError, setDobError] = useState("");
  const [tezinaError, setTezinaError] = useState("");
  const [visinaError, setVisinaError] = useState("");

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDob(value);
    const num = Number(value);
    if (value && (num < 10 || num > 100)) {
      setDobError("Dob mora biti između 10 i 100 godina.");
    } else {
      setDobError("");
    }
  };
  const handleTezinaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTezina(value);
    const num = Number(value);
    if (value && (num < 30 || num > 250)) {
      setTezinaError("Težina mora biti između 30 i 250 kg.");
    } else {
      setTezinaError("");
    }
  };
  const handleVisinaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVisina(value);
    const num = Number(value);
    if (value && (num < 120 || num > 250)) {
      setVisinaError("Visina mora biti između 120 i 250 cm.");
    } else {
      setVisinaError("");
    }
  };

  return (
    <>
      <div className="space-y-3">
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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3 max-w-xs w-full">
          <Label className="mb-1">Dob</Label>
          <Input
            type="number"
            value={dob}
            onChange={handleDobChange}
            min={10}
            max={100}
            className="border border-blue-300"
          />
          {dobError && <span className="text-xs text-red-500">{dobError}</span>}
        </div>
        <div className="space-y-3 max-w-xs w-full">
          <Label className="mb-1">Težina (kg)</Label>
          <Input
            type="number"
            value={tezina}
            onChange={handleTezinaChange}
            min={30}
            max={250}
            className="border border-blue-300"
          />
          {tezinaError && (
            <span className="text-xs text-red-500">{tezinaError}</span>
          )}
        </div>
        <div className="space-y-3 max-w-xs w-full">
          <Label className="mb-1">Visina (cm)</Label>
          <Input
            type="number"
            value={visina}
            onChange={handleVisinaChange}
            min={120}
            max={250}
            className="border border-blue-300"
          />
          {visinaError && (
            <span className="text-xs text-red-500">{visinaError}</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
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

      <div className="space-y-3">
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

      <div className="space-y-3">
        <Label className="mb-1">Razina stresa</Label>
        <Select value={stres} onValueChange={setStres}>
          <SelectTrigger className="border border-blue-300">
            <SelectValue placeholder="Razina stresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nizak">Nizak</SelectItem>
            <SelectItem value="umjeren">Umjeren</SelectItem>
            <SelectItem value="visok">Visok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="mb-1">Vrsta posla</Label>
        <Select value={posao} onValueChange={setPosao}>
          <SelectTrigger className="border border-blue-300">
            <SelectValue placeholder="Vrsta posla" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sjedilački">Sjedilački</SelectItem>
            <SelectItem value="srednje aktivan">Srednje aktivan</SelectItem>
            <SelectItem value="vrlo aktivan">Vrlo aktivan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
