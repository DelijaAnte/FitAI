"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/auth-context";
import { LogOut } from "lucide-react";

export default function PostavkePage() {
  const { logout, user } = useAuth();
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Postavke
          </CardTitle>

          <Separator className="border-gray-300" />

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Račun
              </h3>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">Email:</span>
                <span className="text-white">{user?.email || "Nepoznato"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">Ime:</span>
                <span className="text-white">
                  {user?.displayName || "Nepoznato"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">
                  Datum registracije:
                </span>
                <span className="text-white">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString(
                        "hr-HR"
                      )
                    : "Nepoznato"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">
                  Zadnja prijava:
                </span>
                <span className="text-white">
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                        "hr-HR"
                      )
                    : "Nepoznato"}
                </span>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Odjavi se
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
