"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PlanOptionsProps {
  dani: number;
  setDani: (d: number) => void;
  cilj: string;
  setCilj: (c: string) => void;
  ciljevi: string[];
  iskustvo: string;
  setIskustvo: (i: string) => void;
}

export default function PlanOptions({
  dani,
  setDani,
  cilj,
  setCilj,
  ciljevi,
  iskustvo,
  setIskustvo,
}: PlanOptionsProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-evenly items-center gap-6 px-4 md:px-8 w-full">
      <div className="space-y-3 flex flex-col items-center text-center max-w-xs w-full">
        <Label className="text-sm font-medium">Broj treninga u tjednu</Label>
        <Select
          value={dani.toString()}
          onValueChange={(value) => setDani(Number(value))}
        >
          <SelectTrigger className="border-blue-400 focus:border-blue-600 hover:border-blue-500 h-12 w-full max-w-xs">
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

      <div className="space-y-3 flex flex-col items-center text-center max-w-xs w-full">
        <Label className="text-sm font-medium">Cilj trening plana</Label>
        <Select value={cilj} onValueChange={setCilj}>
          <SelectTrigger className="border-blue-400 focus:border-blue-600 hover:border-blue-500 h-12 w-full max-w-xs">
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

      <div className="space-y-3 flex flex-col items-center text-center max-w-xs w-full">
        <Label className="text-sm font-medium">Razina iskustva</Label>
        <Select value={iskustvo} onValueChange={setIskustvo}>
          <SelectTrigger className="border-blue-400 focus:border-blue-600 hover:border-blue-500 h-12 w-full max-w-xs">
            <SelectValue placeholder="Odaberi razinu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="početnik">Početnik</SelectItem>
            <SelectItem value="srednje napredni">Srednje napredni</SelectItem>
            <SelectItem value="napredni">Napredni</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
