"use client";

import { useAuth } from "../context/auth-context";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { FaStrava } from "react-icons/fa";
import Link from "next/link";

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface Day {
  name: string;
  exercises: Exercise[];
}

interface TrainingLog {
  id: string;
  days: Day[];
  createdAt: string;
}

export default function ProfilPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [calories, setCalories] = useState<number | null>(null);
  const [caloriesLoading, setCaloriesLoading] = useState(true);
  const [progress, setProgress] = useState<Day[] | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressLogs, setProgressLogs] = useState<TrainingLog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string>("");

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

  useEffect(() => {
    if (!user) return;
    const fetchProgressLogs = async () => {
      setProgressLoading(true);
      const q = query(
        collection(db, "training_logs"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          days: data.days || [],
          createdAt: data.createdAt || "",
        };
      });
      setProgressLogs(logs);
      if (logs.length > 0) {
        setSelectedLogId(logs[0].id);
        setProgress(logs[0].days || null);
      } else {
        setProgress(null);
      }
      setProgressLoading(false);
    };
    fetchProgressLogs();
  }, [user]);

  useEffect(() => {
    if (!selectedLogId) return;
    const log = progressLogs.find((l) => l.id === selectedLogId);
    setProgress(log ? log.days : null);
  }, [selectedLogId, progressLogs]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent mb-6">
            Profil korisnika
          </CardTitle>

          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
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
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Plan treninga
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
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Kalorijski unos
            </h2>
            {caloriesLoading ? (
              <p>Učitavanje kalorijskog unosa...</p>
            ) : calories !== null ? (
              <p className="font-mono text-lg text-white">{calories} kcal</p>
            ) : (
              <p>Nema spremljenog kalorijskog unosa.</p>
            )}
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Trening zapisi
            </h2>
            {progressLoading ? (
              <p>Učitavanje napretka...</p>
            ) : progressLogs.length > 0 ? (
              <>
                <label className="block mb-2 text-sm text-blue-200">
                  Odaberi datum treninga:
                </label>
                <select
                  className="mb-4 p-2 rounded bg-zinc-900 text-white border border-blue-400"
                  value={selectedLogId}
                  onChange={(e) => setSelectedLogId(e.target.value)}
                >
                  {progressLogs.map((log) => (
                    <option key={log.id} value={log.id}>
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : log.id}
                    </option>
                  ))}
                </select>
                {progress && progress.length > 0 ? (
                  <div className="space-y-8">
                    {progress.map((day) => (
                      <div key={day.name} className="space-y-2">
                        <h3 className="text-lg font-bold text-blue-300">
                          {day.name}
                        </h3>
                        {day.exercises.length === 0 && (
                          <div className="text-gray-400">
                            Nema vježbi za ovaj dan.
                          </div>
                        )}
                        <div className="space-y-4">
                          {day.exercises.map((ex, exIdx) => (
                            <div
                              key={`${ex.name}-${exIdx}`}
                              className="space-y-1"
                            >
                              <span className="font-semibold text-blue-200">
                                {ex.name}
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {ex.sets.map((set: Set, setIdx: number) => (
                                  <span
                                    key={setIdx}
                                    className="bg-gray-900 rounded px-2 py-1 text-xs text-white"
                                  >
                                    Serija {setIdx + 1}: {set.weight || "-"} kg
                                    / {set.reps || "-"} ponavljanja
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nema spremljenog napretka za odabrani datum.</p>
                )}
              </>
            ) : (
              <p>Nema spremljenog napretka.</p>
            )}
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-400">
              Strava integracija
            </h2>
            <p className="mb-4 text-gray-300">
              Povežite svoj Strava račun da vidite svoje aktivnosti i napredak
            </p>
            <Link href="/strava">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <FaStrava className="mr-2" />
                Poveži sa Stravom
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
