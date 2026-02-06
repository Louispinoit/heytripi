"use client";

import { Info, Clock, Euro } from "lucide-react";
import type { LogisticsSuggestion } from "../../types";

interface LogisticsCardProps {
  items: LogisticsSuggestion[];
}

export function LogisticsCard({ items }: LogisticsCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Info className="size-3.5" />
        <span>Logistique</span>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg bg-muted/50 p-2.5"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-xs font-medium">
              {item.type.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium">{item.type}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-1 flex items-center gap-3">
                {item.duration && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-2.5" />
                    <span>{item.duration}</span>
                  </div>
                )}
                {item.price !== undefined && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Euro className="size-2.5" />
                    <span>{item.price}€</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
