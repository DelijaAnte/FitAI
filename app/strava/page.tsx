"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaStrava } from "react-icons/fa";

type StravaActivity = {
  id: number;
  name: string;
  distance: number; // u metrima
  moving_time: number; // u sekundama
  type: string;
  start_date?: string;
  average_speed?: number;
  max_speed?: number;
  description?: string;
};

// Mapa prijevoda tipova aktivnosti (bez emojija)
const typeLabels: Record<string, string> = {
  Run: "Trčanje",
  Ride: "Bicikl",
  Walk: "Hodanje",
  Workout: "Trening",
  Swim: "Plivanje",
  Hike: "Planinarenje",
  Elliptical: "Orbitrek",
  WeightTraining: "Teretana",
};

export default function StravaPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // Dohvati token iz URL-a nakon redirecta
  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
      // Očisti URL od tokena
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Ako postoji token, dohvatimo aktivnosti
  useEffect(() => {
    if (!token) return;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://www.strava.com/api/v3/athlete/activities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju aktivnosti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [token]);

  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!,
      redirect_uri: "http://localhost:3000/api/strava/callback",
      response_type: "code",
      scope: "read,activity:read_all",
      approval_prompt: "auto",
    });

    window.location.href = `https://www.strava.com/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          {!token ? (
            <div className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
                Strava integracija
              </CardTitle>

              <p className="text-gray-500">
                Povežite svoj Strava račun da vidite svoje aktivnosti i napredak
              </p>

              <Separator className="border-blue-300" />

              <div className="flex justify-center">
                <FaStrava className="text-6xl text-orange-500" />
              </div>
              <Button
                onClick={handleConnect}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                <FaStrava className="mr-2" />
                Poveži sa Stravom
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent mb-2">
                  Tvoje aktivnosti
                </h2>
                <p className="text-gray-500">
                  Prikazuju se zadnje aktivnosti s vašeg Strava računa
                </p>
              </div>

              <Separator className="border-blue-300" />

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Učitavanje aktivnosti...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nema aktivnosti za prikaz</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activities.slice(0, 10).map((activity) => (
                    <Card
                      key={activity.id}
                      className="border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3
                              className="font-semibold text-blue-500 mb-1 cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() =>
                                setExpandedActivity(
                                  expandedActivity === activity.id
                                    ? null
                                    : activity.id
                                )
                              }
                            >
                              {activity.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                {(activity.distance / 1000).toFixed(2)} km
                              </span>
                              <span>•</span>
                              <span>
                                {Math.round(activity.moving_time / 60)} min
                              </span>
                              <span>•</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {typeLabels[activity.type] ?? activity.type}
                              </span>
                            </div>

                            {expandedActivity === activity.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {activity.start_date && (
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Datum:
                                      </span>
                                      <span className="ml-2 text-gray-600">
                                        {new Date(
                                          activity.start_date
                                        ).toLocaleDateString("hr-HR")}
                                      </span>
                                    </div>
                                  )}

                                  {activity.average_speed && (
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Prosječna brzina:
                                      </span>
                                      <span className="ml-2 text-gray-600">
                                        {(activity.average_speed * 3.6).toFixed(
                                          1
                                        )}{" "}
                                        km/h
                                      </span>
                                    </div>
                                  )}
                                  {activity.max_speed && (
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Maksimalna brzina:
                                      </span>
                                      <span className="ml-2 text-gray-600">
                                        {(activity.max_speed * 3.6).toFixed(1)}{" "}
                                        km/h
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {activity.description && (
                                  <div className="mt-3">
                                    <span className="font-medium text-gray-700">
                                      Opis:
                                    </span>
                                    <p className="mt-1 text-gray-600 text-sm">
                                      {activity.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
