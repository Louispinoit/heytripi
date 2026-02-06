"use client";

import { Plane, Clock, ArrowRight } from "lucide-react";
import type { FlightSuggestion } from "../../types";

interface FlightCardProps {
  flight: FlightSuggestion;
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Plane className="size-3.5" />
        <span>Vol suggéré</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-lg font-bold">{flight.fromIATA}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <div className="h-px w-8 bg-border" />
              <ArrowRight className="size-3" />
              <div className="h-px w-8 bg-border" />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="size-2.5" />
              <span>{flight.duration}</span>
            </div>
            {flight.stops > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {flight.stops} escale{flight.stops > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{flight.toIATA}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{flight.price}€</p>
          {flight.airline && (
            <p className="text-[10px] text-muted-foreground">{flight.airline}</p>
          )}
        </div>
      </div>
    </div>
  );
}
