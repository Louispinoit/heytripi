"use client";

import { MapPin, Calendar } from "lucide-react";

interface CityHeaderProps {
  cityName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dayCount: number;
}

export function CityHeader({
  cityName,
  description,
  startDate,
  endDate,
  dayCount,
}: CityHeaderProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-primary" />
        <h2 className="text-lg font-bold">{cityName}</h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {dayCount} jour{dayCount > 1 ? "s" : ""}
        </span>
      </div>
      {startDate && endDate && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          <span>
            {formatDate(startDate)} — {formatDate(endDate)}
          </span>
        </div>
      )}
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}
