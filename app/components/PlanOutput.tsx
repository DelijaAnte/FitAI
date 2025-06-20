"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Pencil, X } from "lucide-react";

interface Props {
  plan: string;
  onChange: (noviPlan: string) => void;
}

export default function PlanOutput({ plan, onChange }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(plan);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!plan) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <CardTitle className="text-lg">Tvoj plan treninga</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!plan || isCopied}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Kopirano!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Kopiraj
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Zatvori uređivanje
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-1" />
                  Uredi
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={plan}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[300px] p-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded resize-y"
          />
        ) : (
          <div className="whitespace-pre-wrap font-mono p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            {plan}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
