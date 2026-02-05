"use client";

import { MapIcon, Footprints } from "lucide-react";
import { formatDuration } from "../lib/walking-routes";

interface TripMapHeaderProps {
  destination: string;
  currentDay: number;
  activityCount: number;
  totalWalkingMinutes?: number;
}

export function TripMapHeader({
  destination,
  currentDay,
  activityCount,
  totalWalkingMinutes,
}: TripMapHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b bg-muted/50 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <MapIcon className="size-4" />
        </div>
        <div>
          <span className="text-sm font-semibold">
            {destination || "Nouvelle destination"} - Jour {currentDay}
          </span>
          <p className="text-xs text-muted-foreground">
            {activityCount === 0
              ? "En attente des activités..."
              : `${activityCount} activité${activityCount > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      {totalWalkingMinutes !== undefined && totalWalkingMinutes > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full">
          <Footprints className="size-3.5" />
          <span className="font-medium">{formatDuration(totalWalkingMinutes)} de marche</span>
        </div>
      )}
    </div>
  );
}
