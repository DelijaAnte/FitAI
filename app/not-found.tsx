import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent mb-2">
        404 - Stranica nije pronađena
      </h1>
      <p className="mb-6">Žao nam je, tražena stranica ne postoji.</p>
      <Link href="/" className="text-blue-700 underline">
        Povratak na početnu
      </Link>
    </div>
  );
}
