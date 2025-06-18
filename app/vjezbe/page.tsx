"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Vjezba {
  id: string;
  naziv: string;
  misicneSkupine: string[];
  slika: string;
  youtubeLink: string;
}

export default function ExercisesPage() {
  const [vjezbe, setVjezbe] = useState<Vjezba[]>([]);

  useEffect(() => {
    const fetchVjezbe = async () => {
      const res = await fetch("/data/vjezbe.json");
      const data = await res.json();
      setVjezbe(data);
    };
    fetchVjezbe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {vjezbe.map((vjezba) => (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              Pogledaj video
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
