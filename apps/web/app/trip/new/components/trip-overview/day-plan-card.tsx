"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripDayEnhanced } from "../../types";
import { ActivityRow } from "./activity-row";

interface DayPlanCardProps {
  day: TripDayEnhanced;
  onActivityClick?: (activityId: string) => void;
  defaultExpanded?: boolean;
}

export function DayPlanCard({
  day,
  onActivityClick,
  defaultExpanded = false,
}: DayPlanCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {day.dayNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold">
              {day.title || `Jour ${day.dayNumber}`}
            </h4>
            {day.weatherEmoji && (
              <span className="text-sm">{day.weatherEmoji}</span>
            )}
            {day.temperatureHigh !== undefined && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Sun className="size-2.5" />
                {day.temperatureHigh}°C
              </span>
            )}
          </div>
          {!expanded && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {day.activities.length} activité{day.activities.length > 1 ? "s" : ""} —{" "}
              {day.activities
                .slice(0, 3)
                .map((a) => a.name)
                .join(", ")}
              {day.activities.length > 3 ? "..." : ""}
            </p>
          )}
        </div>

        {/* Activity thumbnails (collapsed) */}
        {!expanded && day.activities.some((a) => a.imageUrl) && (
          <div className="flex -space-x-2">
            {day.activities
              .filter((a) => a.imageUrl)
              .slice(0, 3)
              .map((a) => (
                <div
                  key={a.id}
                  className="size-7 overflow-hidden rounded-full border-2 border-card bg-muted"
                >
                  <img
                    src={a.imageUrl}
                    alt={a.name}
                    className="size-full object-cover"
                  />
                </div>
              ))}
          </div>
        )}

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t px-2 py-2">
              {day.activities.map((activity, i) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  index={i}
                  onClick={() => onActivityClick?.(activity.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
