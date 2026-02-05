"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DayNavigatorProps {
  totalDays: number;
  currentDay: number;
  onDayChange: (day: number) => void;
  onAddDay?: () => void;
  className?: string;
}

export function DayNavigator({
  totalDays,
  currentDay,
  onDayChange,
  onAddDay,
  className,
}: DayNavigatorProps) {
  if (totalDays === 0) return null;

  return (
    <div className={cn("flex items-center gap-1.5 px-4 py-2 border-b bg-muted/30 overflow-x-auto", className)}>
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
        <Button
          key={day}
          variant={currentDay === day ? "default" : "outline"}
          size="sm"
          onClick={() => onDayChange(day)}
          className={cn(
            "h-8 px-3 text-xs font-medium shrink-0 transition-all",
            currentDay === day
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-background hover:bg-muted"
          )}
        >
          Jour {day}
        </Button>
      ))}
      {onAddDay && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddDay}
          className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4" />
          <span className="sr-only">Ajouter un jour</span>
        </Button>
      )}
    </div>
  );
}
