"use client";

import { useAuth } from "../context/auth-context";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfilPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [calories, setCalories] = useState<number | null>(null);
  const [caloriesLoading, setCaloriesLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPlan = async () => {
      setLoading(true);
      const docRef = doc(db, "plans", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data().plan || "");
      } else {
        setPlan("");
      }
      setLoading(false);
    };
    fetchPlan();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchCalories = async () => {
      setCaloriesLoading(true);
      const docRef = doc(db, "calories", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCalories(docSnap.data().calories || null);
      } else {
        setCalories(null);
      }
      setCaloriesLoading(false);
    };
    fetchCalories();
  }, [user]);

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
            {loading ? (
              <p>Učitavanje plana...</p>
            ) : plan ? (
              <pre className="whitespace-pre-wrap font-mono text-sm text-white">
                {plan}
              </pre>
            ) : (
              <p>Nema spremljenog plana.</p>
            )}
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Spremljeni kalorijski unos
            </h2>
            {caloriesLoading ? (
              <p>Učitavanje kalorijskog unosa...</p>
            ) : calories !== null ? (
              <p className="font-mono text-lg text-white">{calories} kcal</p>
            ) : (
              <p>Nema spremljenog kalorijskog unosa.</p>
            )}
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
