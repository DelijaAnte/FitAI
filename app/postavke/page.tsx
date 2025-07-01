import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function PostavkePage() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Postavke
          </CardTitle>

          <div className="text-center">
            <p className="text-muted-foreground">
              Ovdje možete prilagoditi postavke.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
