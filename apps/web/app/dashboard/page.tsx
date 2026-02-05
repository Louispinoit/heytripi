import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Plane,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Luggage,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "./components/header";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Voyageur";
  const firstName = userName.split(" ")[0];
  const avatarUrl = user.user_metadata?.avatar_url;

  // Mock data for now - will be replaced with real data from Supabase
  const stats = {
    totalTrips: 0,
    upcomingTrips: 0,
    countriesVisited: 0,
  };

  const recentTrips: any[] = []; // Empty for now

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-2 border-secondary">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-secondary text-lg text-secondary-foreground">
                  {firstName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Salut, {firstName} ! 👋
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Prêt pour ta prochaine aventure ?
                </p>
              </div>
            </div>

            <Button size="lg" className="gap-2" asChild>
              <Link href="/trip/new">
                <Plus className="size-5" />
                Nouveau voyage
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              icon={Plane}
              label="Voyages planifiés"
              value={stats.totalTrips}
              color="secondary"
            />
            <StatsCard
              icon={Calendar}
              label="À venir"
              value={stats.upcomingTrips}
              color="primary"
            />
            <StatsCard
              icon={MapPin}
              label="Pays visités"
              value={stats.countriesVisited}
              color="accent"
            />
          </div>
        </section>

        {/* Main Content */}
        {recentTrips.length > 0 ? (
          <TripsSection trips={recentTrips} />
        ) : (
          <EmptyState firstName={firstName} />
        )}
      </main>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: "primary" | "secondary" | "accent";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ firstName }: { firstName: string }) {
  return (
    <section>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
            <Plane className="size-48 rotate-12 text-secondary" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary">
              <Sparkles className="size-4" />
              Bienvenue sur HeyTripy !
            </div>

            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              Planifie ton premier voyage avec Tripy
            </h2>

            <p className="mb-8 text-muted-foreground">
              Dis simplement où tu veux aller, et Tripy s'occupe du reste.
              Vols, hôtels, activités — tout en une conversation.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 gap-2 px-8" asChild>
                <Link href="/trip/new">
                  <Sparkles className="size-5" />
                  Parler à Tripy
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>

            {/* Example prompts */}
            <div className="mt-10">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Essaie de dire :
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <Badge
                    key={prompt}
                    variant="outline"
                    className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-secondary/10"
                  >
                    "{prompt}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function TripsSection({ trips }: { trips: any[] }) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Mes voyages</h2>
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/trips">
            Voir tout
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}

function TripCard({ trip }: { trip: any }) {
  return (
    <Card className="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2">
              <Luggage className="size-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">{trip.destination}</CardTitle>
              <p className="text-sm text-muted-foreground">{trip.country}</p>
            </div>
          </div>
          <Badge
            variant={trip.status === "PLANNING" ? "secondary" : "outline"}
            className="text-xs"
          >
            {trip.status === "PLANNING" ? "En cours" : trip.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{trip.dates}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{trip.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const EXAMPLE_PROMPTS = [
  "Je veux partir à Barcelone en mai",
  "Un week-end romantique à Paris",
  "Roadtrip en Italie pour 2 semaines",
];
