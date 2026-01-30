"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Luggage, Mail, Lock, User, Loader2, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import { signUpWithEmail } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [supabase.auth, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const result = await signUpWithEmail(email, password, name);

    if (result.error) {
      setError(getErrorMessage(result.error));
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogleLogin = async () => {
    startTransition(async () => {
      await signInWithGoogle("/dashboard");
    });
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-lg">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-8 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Vérifie ta boîte mail !
              </h2>
              <p className="mb-6 max-w-sm text-muted-foreground">
                On t'a envoyé un email à <strong>{email}</strong>. Clique sur le
                lien pour activer ton compte.
              </p>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Retour à la connexion</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute left-4 top-4 sm:left-8 sm:top-8"
      >
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Retour
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Luggage className="size-5" />
          </div>
          <span className="text-2xl font-bold text-foreground">HeyTripy</span>
        </Link>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4 pt-6 text-center">
            <CardTitle className="text-2xl font-bold">Crée ton compte</CardTitle>
            <CardDescription>
              Rejoins des milliers de voyageurs
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Google OAuth - Using Server Action */}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-3 text-base"
              disabled={isPending || loading}
              onClick={handleGoogleLogin}
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continuer avec Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ou par email
                </span>
              </div>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ton prénom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="6 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full text-base"
                disabled={loading || isPending}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          En créant un compte, tu acceptes nos{" "}
          <Link href="/legal/terms" className="underline hover:text-foreground">
            CGU
          </Link>{" "}
          et notre{" "}
          <Link
            href="/legal/privacy"
            className="underline hover:text-foreground"
          >
            Politique de confidentialité
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function getErrorMessage(message: string): string {
  if (message.includes("User already registered")) {
    return "Cet email est déjà utilisé. Connecte-toi ou réinitialise ton mot de passe.";
  }
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères";
  }
  if (message.includes("Unable to validate email")) {
    return "Cette adresse email n'est pas valide";
  }
  if (message.includes("Too many requests")) {
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  }
  return "Une erreur s'est produite. Réessaie.";
}
