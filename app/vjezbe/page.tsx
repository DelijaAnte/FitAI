"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Vjezba {
  id: string;
  naziv: string;
  misicneSkupine: string[];
  slika: string;
  youtubeLink: string;
}

export default function ExercisesPage() {
  const [vjezbe, setVjezbe] = useState<Vjezba[]>([]);
  const [filterSkupina, setFilterSkupina] = useState<string>("Sve");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchVjezbe = async () => {
      const res = await fetch("/data/vjezbe.json");
      const data = await res.json();
      setVjezbe(data);
    };
    fetchVjezbe();
  }, []);

  // Dohvati sve jedinstvene mišićne skupine
  const sveSkupine = useMemo(() => {
    const skup = new Set<string>();
    vjezbe.forEach((v) => v.misicneSkupine.forEach((s) => skup.add(s)));
    return ["Sve", ...Array.from(skup).sort()];
  }, [vjezbe]);

  // Filtriraj i sortiraj vježbe
  const prikazaneVjezbe = useMemo(() => {
    const filtrirane =
      filterSkupina === "Sve"
        ? vjezbe
        : vjezbe.filter((v) => v.misicneSkupine.includes(filterSkupina));
    return filtrirane.sort((a, b) => {
      if (sortOrder === "asc") return a.naziv.localeCompare(b.naziv);
      else return b.naziv.localeCompare(a.naziv);
    });
  }, [vjezbe, filterSkupina, sortOrder]);

  return (
    <div className="p-6 space-y-6">
      {/* Filter i sortiranje */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={filterSkupina} onValueChange={setFilterSkupina}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Odaberi mišićnu skupinu" />
          </SelectTrigger>
          <SelectContent>
            {sveSkupine.map((skupina) => (
              <SelectItem key={skupina} value={skupina}>
                {skupina}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup
          type="single"
          value={sortOrder}
          onValueChange={(val) => val && setSortOrder(val as "asc" | "desc")}
          className="flex"
        >
          <ToggleGroupItem value="asc">A–Ž</ToggleGroupItem>
          <ToggleGroupItem value="desc">Ž–A</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Kartice vježbi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prikazaneVjezbe.map((vjezba) => (
          <Card
            key={vjezba.id}
            className="hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer 
                    border border-transparent hover:border-blue-700/20 hover:bg-blue-50/50
                    transform hover:-translate-y-1"
          >
            <Image
              src={vjezba.slika}
              alt={vjezba.naziv}
              width={400}
              height={300}
              className="rounded-t-2xl object-cover w-full h-48 hover:brightness-95 transition"
            />
            <CardContent className="space-y-3 p-4">
              <CardTitle className="text-xl hover:text-blue-700 transition-colors">
                {vjezba.naziv}
              </CardTitle>
              <div className="flex flex-wrap gap-1">
                {vjezba.misicneSkupine.map((skupina) => (
                  <span
                    key={skupina}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    {skupina}
                  </span>
                ))}
              </div>
              <a
                href={vjezba.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:text-blue-800 text-sm transition-colors"
              >
                <FaYoutube className="w-4 h-4 mr-1" />
                Pogledaj video
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
