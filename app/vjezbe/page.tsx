"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Vjezba {
  id: string;
  naziv: string;
  misicneSkupine: string[];
  slika: string;
  youtubeLink: string;
  tip: string;
}

export default function ExercisesPage() {
  const [vjezbe, setVjezbe] = useState<Vjezba[]>([]);
  const [filterSkupina, setFilterSkupina] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selektiranaVjezba, setSelektiranaVjezba] = useState<Vjezba | null>(
    null
  );
  const [pustiVideo, setPustiVideo] = useState(false);
  const [filterTip, setFilterTip] = useState<string>("Sve");

  useEffect(() => {
    const fetchVjezbe = async () => {
      const res = await fetch("/data/vjezbe.json", { cache: "no-store" });
      const data = await res.json();
      setVjezbe(data);
    };
    fetchVjezbe();
  }, []);

  const sveSkupine = useMemo(() => {
    const skup = new Set<string>();
    vjezbe.forEach((v) => v.misicneSkupine.forEach((s) => skup.add(s)));
    return ["Sve", ...Array.from(skup).sort()];
  }, [vjezbe]);

  const prikazaneVjezbe = useMemo(() => {
    const filtrirane =
      !filterSkupina || filterSkupina === "Sve"
        ? vjezbe
        : vjezbe.filter((v) => v.misicneSkupine.includes(filterSkupina));

    const filtriraneTip =
      filterTip === "Sve"
        ? filtrirane
        : filtrirane.filter((v) => v.tip === filterTip);

    const pretrazene = filtriraneTip.filter((v) =>
      v.naziv.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return pretrazene.sort((a, b) =>
      sortOrder === "asc"
        ? a.naziv.localeCompare(b.naziv)
        : b.naziv.localeCompare(a.naziv)
    );
  }, [vjezbe, filterSkupina, filterTip, searchQuery, sortOrder]);

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  };

  const onDialogOpen = (vjezba: Vjezba) => {
    setSelektiranaVjezba(vjezba);
    setPustiVideo(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filteri i search */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={filterSkupina} onValueChange={setFilterSkupina}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Odaberi mišićnu skupinu" />
          </SelectTrigger>
          <SelectContent>
            {sveSkupine
              .filter((skupina) => skupina !== "Sve")
              .map((skupina) => (
                <SelectItem key={skupina} value={skupina}>
                  {skupina}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Pretraži vježbe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />

        <ToggleGroup
          type="single"
          value={sortOrder}
          onValueChange={(val) => val && setSortOrder(val as "asc" | "desc")}
          className="flex"
        >
          <ToggleGroupItem value="asc">A–Ž</ToggleGroupItem>
          <ToggleGroupItem value="desc">Ž–A</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          value={filterTip}
          onValueChange={(val) => val && setFilterTip(val)}
          className="flex"
        >
          <ToggleGroupItem value="Sve">Sve vrste</ToggleGroupItem>
          <ToggleGroupItem value="složena">Složena</ToggleGroupItem>
          <ToggleGroupItem value="izolacija">Izolacija</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Prikaz vježbi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prikazaneVjezbe.map((vjezba) => (
          <Dialog
            key={vjezba.id}
            onOpenChange={(open) => !open && setPustiVideo(false)}
          >
            <DialogTrigger asChild>
              <Card
                onClick={() => onDialogOpen(vjezba)}
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
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
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
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              {selektiranaVjezba && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
                      {selektiranaVjezba.naziv}
                    </DialogTitle>
                  </DialogHeader>

                  <div
                    className="relative rounded-xl mt-4 w-full h-64 overflow-hidden cursor-pointer"
                    onClick={() => setPustiVideo(!pustiVideo)}
                    title={pustiVideo ? "Zaustavi video" : "Pusti video"}
                  >
                    {!pustiVideo ? (
                      <>
                        <Image
                          src={selektiranaVjezba.slika}
                          alt={selektiranaVjezba.naziv}
                          width={500}
                          height={300}
                          className="rounded-xl object-cover w-full h-64"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <FaPlay className="text-white w-8 h-8 ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(
                          selektiranaVjezba.youtubeLink
                        )}?autoplay=1&rel=0`}
                        title={selektiranaVjezba.naziv}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <p className="text-sm mt-4">
                    Mišićne skupine:{" "}
                    <strong>
                      {selektiranaVjezba.misicneSkupine.join(", ")}
                    </strong>
                  </p>
                </>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
