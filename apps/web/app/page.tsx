import Link from "next/link";
import {
  Plane,
  Hotel,
  MapPin,
  MessageCircle,
  Sparkles,
  Globe,
  CreditCard,
  ChevronRight,
  Check,
  ArrowRight,
  Luggage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatPreview } from "@/components/landing/chat-preview";
import { MapPreview } from "@/components/landing/map-preview";
import {
  AnimatedSection,
  AnimatedText,
  StaggerContainer,
  StaggerItem,
} from "@/components/landing/animated-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Luggage className="size-5" />
            </div>
            <span className="text-xl font-bold text-foreground">HeyTripy</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Comment ça marche
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tarifs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">
                Commencer
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedText>
              <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm">
                <Sparkles className="mr-2 size-4" />
                Assistant IA nouvelle génération
              </Badge>
            </AnimatedText>

            <AnimatedText delay={0.1}>
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Planifie ton voyage{" "}
                <span className="text-primary">
                  en discutant
                </span>
              </h1>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Dis bonjour à Tripy, ton assistant voyage IA. Vols, hôtels,
                activités — il trouve tout pour toi en une simple conversation.
              </p>
            </AnimatedText>

            <AnimatedText delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/auth/login">
                    Planifier mon voyage
                    <ChevronRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="#how-it-works">Voir comment ça marche</Link>
                </Button>
              </div>
            </AnimatedText>

            <AnimatedText delay={0.4}>
              <p className="mt-6 text-sm text-muted-foreground">
                Gratuit pour commencer • Pas de carte bancaire requise
              </p>
            </AnimatedText>
          </div>

          {/* Demo: Chat + Map side by side */}
          <div className="mx-auto mt-20 grid max-w-6xl gap-6 lg:grid-cols-2">
            <ChatPreview />
            <MapPreview />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Tout ce dont tu as besoin
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Tripy s&apos;occupe de tout. Recherche, compare, organise — le tout
              en une seule conversation.
            </p>
          </AnimatedSection>

          <StaggerContainer className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <FeatureCard
                icon={<Plane className="size-6" />}
                title="Recherche de vols"
                description="Compare les meilleurs vols en temps réel. Tripy trouve les meilleures offres pour toi."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Hotel className="size-6" />}
                title="Suggestions d'hôtels"
                description="Des hôtels adaptés à ton budget et tes préférences. Réserve directement sur les sites partenaires."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<MapPin className="size-6" />}
                title="Activités locales"
                description="Découvre les meilleures activités, restaurants et spots secrets de chaque destination."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<MessageCircle className="size-6" />}
                title="Conversation naturelle"
                description="Parle à Tripy comme à un ami. Il comprend tes envies et s'adapte à toi."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Globe className="size-6" />}
                title="Carte interactive"
                description="Visualise ton itinéraire sur une carte. Optimise tes déplacements facilement."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<CreditCard className="size-6" />}
                title="Gestion du budget"
                description="Suis tes dépenses en temps réel. Tripy t'alerte si tu dépasses ton budget."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Simple comme bonjour
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Trois étapes pour planifier le voyage de tes rêves.
            </p>
          </AnimatedSection>

          <StaggerContainer className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-3">
            <StaggerItem>
              <StepCard
                number="1"
                title="Dis où tu veux aller"
                description="Parle à Tripy de ta destination idéale, tes dates et ton budget."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                number="2"
                title="Tripy te propose"
                description="Il recherche les meilleurs vols, hôtels et activités pour toi."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                number="3"
                title="Organise et réserve"
                description="Valide tes choix et réserve via nos partenaires en un clic."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Tarifs simples
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Commence gratuitement. Passe à la version pro quand tu veux plus.
            </p>
          </AnimatedSection>

          <StaggerContainer className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
            <StaggerItem>
              <PricingCard
                title="Gratuit"
                price="0€"
                description="Tripy Découverte"
                features={[
                  "2 voyages par mois",
                  "Chat IA (20 msg/voyage)",
                  "Carte interactive basique",
                  "1 collaborateur",
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <PricingCard
                title="Tripy+"
                price="5.99€"
                period="/mois"
                description="L'essentiel du voyage"
                features={[
                  "Voyages illimités",
                  "Chat IA illimité",
                  "Prix temps réel",
                  "5 collaborateurs",
                  "Mode offline + Sync calendrier",
                ]}
                highlighted
              />
            </StaggerItem>
            <StaggerItem>
              <PricingCard
                title="Tripy Pro"
                price="9.99€"
                period="/mois"
                description="Le compagnon ultime"
                features={[
                  "Tout Tripy+",
                  "10 collaborateurs",
                  "Alertes prix illimitées",
                  "Compagnon de voyage",
                  "Journal auto + Score éco",
                ]}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 sm:py-24">
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Prêt à planifier ton prochain voyage ?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
                  Rejoins des milliers de voyageurs qui planifient avec Tripy.
                  C&apos;est gratuit pour commencer.
                </p>
                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base font-semibold shadow-lg"
                    asChild
                  >
                    <Link href="/auth/login">
                      Commencer maintenant
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Luggage className="size-5" />
              </div>
              <span className="text-xl font-bold">HeyTripy</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                À propos
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Confidentialité
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                CGU
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2026 HeyTripy. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-background p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-110">
        {number}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  highlighted,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`relative h-full p-8 transition-all duration-300 hover:-translate-y-2 ${
        highlighted
          ? "border-2 border-primary bg-background shadow-2xl shadow-primary/20 lg:scale-105"
          : "border bg-background shadow-lg hover:shadow-xl"
      }`}
    >
      {highlighted && (
        <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-4 py-1">
          Populaire
        </Badge>
      )}
      <CardContent className="flex h-full flex-col p-0">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex items-baseline">
          <span className="text-5xl font-bold tracking-tight">{price}</span>
          {period && (
            <span className="ml-1 text-muted-foreground">{period}</span>
          )}
        </div>
        <ul className="mt-8 flex-1 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="mt-8 w-full"
          variant={highlighted ? "default" : "outline"}
          size="lg"
          asChild
        >
          <Link href="/auth/login">
            {price === "0€" ? "Commencer gratuitement" : "Choisir ce plan"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
