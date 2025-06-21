// components/PlanOptions.tsx
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
}

export default function PlanOptions({
  dani,
  setDani,
  cilj,
  setCilj,
  ciljevi,
}: PlanOptionsProps) {
  return (
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
  );
}
