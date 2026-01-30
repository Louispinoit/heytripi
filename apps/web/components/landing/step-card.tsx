interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
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
