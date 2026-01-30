import Link from "next/link";
import { ArrowRight, ChevronRight, Luggage, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  AnimatedText,
  DemoPreview,
  FeatureCard,
  FEATURES,
  FOOTER_LINKS,
  Header,
  PricingCard,
  PRICING_PLANS,
  StaggerContainer,
  StaggerItem,
  StepCard,
  STEPS,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
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
              Planifie ton voyage <span className="text-primary">en discutant</span>
            </h1>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Dis bonjour à Tripy, ton assistant voyage IA. Vols, hôtels, activités — il trouve tout pour toi en une simple conversation.
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
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
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

        <div className="mx-auto mt-20 max-w-6xl">
          <DemoPreview />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tout ce dont tu as besoin
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Tripy s&apos;occupe de tout. Recherche, compare, organise — le tout en une seule conversation.
          </p>
        </AnimatedSection>

        <StaggerContainer className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <FeatureCard {...feature} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
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
          {STEPS.map((step) => (
            <StaggerItem key={step.number}>
              <StepCard {...step} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
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
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.title}>
              <PricingCard {...plan} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Prêt à planifier ton prochain voyage ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
              Rejoins des milliers de voyageurs qui planifient avec Tripy. C&apos;est gratuit pour commencer.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold shadow-lg" asChild>
                <Link href="/auth/login">
                  Commencer maintenant
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Footer() {
  return (
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
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">© 2026 HeyTripy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
