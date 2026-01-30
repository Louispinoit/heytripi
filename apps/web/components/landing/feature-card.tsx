import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-background p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </div>
        <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
