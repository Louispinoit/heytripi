import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  highlighted,
}: PricingCardProps) {
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
