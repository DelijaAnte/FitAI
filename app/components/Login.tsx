"use client";

import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Greška prilikom prijave.");
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Greška prilikom prijave.");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-10 max-w-sm w-full flex flex-col gap-6 items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">
        Dobrodošao u FitAI
      </h2>

      <Button
        onClick={handleGoogleLogin}
        className="gap-2 text-lg w-full justify-center bg-stone-200 hover:bg-stone-300 border border-stone-200 text-gray-800"
      >
        <FcGoogle className="text-2xl" />
        Prijavi se putem Googlea
      </Button>

      <Button
        onClick={handleFacebookLogin}
        className="gap-2 text-lg w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FaFacebook className="text-2xl" />
        Prijavi se putem Facebooka
      </Button>

      {error && (
        <p className="text-red-500 text-sm text-center max-w-sm">{error}</p>
      )}
    </div>
  );
}
