"use client";

import { useAuth } from "../context/auth-context";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ProfilPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent mb-6">
            Profil korisnika
          </CardTitle>

          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Osnovni podaci
            </h2>
            <p>
              <span className="font-semibold">Ime:</span>{" "}
              {user!.displayName || "Nepoznato"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user!.email}
            </p>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Trenutni plan treninga
            </h2>
            <p>Ovdje će biti prikazan trenutni plan treninga korisnika.</p>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">Napredak</h2>
            <p>
              Ovdje će biti prikazani grafovi napretka za cijeli program i svaku
              vježbu posebno.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
