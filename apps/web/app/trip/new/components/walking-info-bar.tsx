"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { DayActivity, WalkingSegment } from "../types";
import { formatDuration } from "../lib/walking-routes";

interface WalkingInfoBarProps {
  activities: DayActivity[];
  walkingSegments: Map<string, WalkingSegment>;
  onActivityClick?: (activityId: string) => void;
}

export function WalkingInfoBar({
  activities,
  walkingSegments,
  onActivityClick,
}: WalkingInfoBarProps) {
  if (activities.length < 2) return null;

  return (
    <div className="flex shrink-0 items-center gap-1 border-b bg-muted/30 px-4 py-2 overflow-x-auto">
      {activities.map((activity, index) => {
        const nextActivity = activities[index + 1];
        const segmentKey = nextActivity ? `${activity.id}-${nextActivity.id}` : null;
        const segment = segmentKey ? walkingSegments.get(segmentKey) : null;

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-1 text-xs whitespace-nowrap"
          >
            {index > 0 && (
              <ArrowRight className="size-3 text-muted-foreground/50 mx-0.5" />
            )}
            <button
              onClick={() => onActivityClick?.(activity.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              {segment && (
                <>
                  <Clock className="size-3 text-orange-500" />
                  <span className="font-medium text-orange-600">
                    {formatDuration(segment.durationMinutes)}
                  </span>
                </>
              )}
              <span className="text-muted-foreground truncate max-w-[100px]">
                {activity.name}
              </span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
