"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: Array<{
    weight: string;
    reps: string;
  }>;
  rpe?: string;
}

interface SavedPlan {
  plan: string;
  createdAt: string;
  userId: string;
}

interface Day {
  name: string;
  exercises: Exercise[];
}

export default function TrainingLogPage() {
  const [days, setDays] = useState<Day[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState(false);
  const { user } = useAuth();

  const parsePlanToDays = (planText: string): Day[] => {
    const days: Day[] = [];
    const dayRegex = /\*\*Dan (\d+)\*\*/g;
    const matches = [...planText.matchAll(dayRegex)];

    for (let i = 0; i < matches.length; i++) {
      const name = `Dan ${matches[i][1]}`;
      const start = matches[i].index!;
      const end =
        i < matches.length - 1 ? matches[i + 1].index! : planText.length;
      const dayText = planText.slice(start, end);

      const exerciseRegex = /-\s*(.+?)\s*—\s*(\d+)\s*x\s*(\d+)\s*\(([^)]+)\)/g;
      const exercises: Exercise[] = [];
      let exMatch;
      while ((exMatch = exerciseRegex.exec(dayText)) !== null) {
        const exerciseName = exMatch[1].trim();
        const numSets = parseInt(exMatch[2]);
        const rpe = exMatch[4].trim();
        const sets = Array.from({ length: numSets }, () => ({
          weight: "",
          reps: "",
        }));
        exercises.push({ name: exerciseName, sets, rpe });
      }
      days.push({ name, exercises });
    }
    return days;
  };

  // Dohvaćanje spremljenog plana
  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const planDoc = await getDoc(doc(db, "plans", user.uid));
        if (planDoc.exists()) {
          const planData = planDoc.data() as SavedPlan;
          const parsedDays = parsePlanToDays(planData.plan);
          setDays(parsedDays);
          setHasPlan(true);
        } else {
          setHasPlan(false);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju plana:", error);
        toast.error("Greška pri dohvaćanju plana");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user]);

  const handleInputChange = (
    dayIdx: number,
    exIdx: number,
    setIdx: number,
    field: "weight" | "reps",
    value: string
  ) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[dayIdx] = {
        ...updated[dayIdx],
        exercises: updated[dayIdx].exercises.map((ex, i) =>
          i === exIdx
            ? {
                ...ex,
                sets: ex.sets.map((set, j) =>
                  j === setIdx ? { ...set, [field]: value } : set
                ),
              }
            : ex
        ),
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni");
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, "training_logs", user.uid), {
        days,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        lastUpdated: new Date().toISOString(),
      });

      toast.success("Napredak je vidljiv na profilu!");
    } catch (error) {
      console.error("Greška pri spremanju:", error);
      toast.error("Greška pri spremanju napretka");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">Učitavanje...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
              Praćenje napretka
            </CardTitle>
            <div className="text-center text-gray-500">
              Nemate spremljen trening plan. Prvo generirajte plan na stranici
              AI Trener.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Praćenje napretka
          </CardTitle>
          <p className="text-center text-gray-500 mb-4">
            Unesi radne kilaže i ponavljanja za svaku seriju vježbe
          </p>
          <Separator className="border-blue-300" />

          <div className="space-y-10">
            {days.map((day, dayIdx) => (
              <div key={day.name} className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  {day.name}
                </h2>
                {day.exercises.length === 0 && (
                  <div className="text-gray-400">Nema vježbi za ovaj dan.</div>
                )}
                <div className="space-y-6">
                  {day.exercises.map((ex, exIdx) => (
                    <div key={`${ex.name}-${exIdx}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-blue-700">
                          {ex.name}
                        </h3>
                        {ex.rpe && (
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {ex.rpe}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ex.sets.map((set, setIdx) => (
                          <div
                            key={setIdx}
                            className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
                          >
                            <span className="font-medium mb-2">
                              Serija {setIdx + 1}
                            </span>
                            <Input
                              type="number"
                              placeholder="Kilaža (kg)"
                              value={set.weight}
                              onChange={(e) =>
                                handleInputChange(
                                  dayIdx,
                                  exIdx,
                                  setIdx,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className="mb-2 border-blue-300"
                              min={0}
                            />
                            <Input
                              type="number"
                              placeholder="Ponavljanja"
                              value={set.reps}
                              onChange={(e) =>
                                handleInputChange(
                                  dayIdx,
                                  exIdx,
                                  setIdx,
                                  "reps",
                                  e.target.value
                                )
                              }
                              className="border-blue-300"
                              min={0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-6"
            size="lg"
          >
            {saving ? "Spremanje..." : "Spremi napredak"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
