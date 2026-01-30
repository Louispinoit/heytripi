"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";

      if (!code) {
        setError("Code d'authentification manquant");
        return;
      }

      try {
        // Exchange the code for a session on the client side
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("[Auth Callback] Error:", error);
          setError(error.message);
          return;
        }

        // Session is now stored in cookies by the browser client
        console.log("[Auth Callback] Success! Redirecting to:", next);
        router.push(next);
      } catch (err) {
        console.error("[Auth Callback] Exception:", err);
        setError("Une erreur inattendue s'est produite");
      }
    };

    handleCallback();
  }, [searchParams, supabase.auth, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="rounded-lg bg-destructive/10 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-destructive">
            Erreur d'authentification
          </h2>
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Connexion en cours...</p>
    </div>
  );
}
