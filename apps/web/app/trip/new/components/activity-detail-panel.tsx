"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Euro, Footprints, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DayActivity, WalkingSegment } from "../types";
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS } from "../data";
import { formatDuration, formatDistance } from "../lib/walking-routes";

interface ActivityDetailPanelProps {
  activity: DayActivity | null;
  index: number;
  nextWalkingSegment?: WalkingSegment;
  nextActivity?: DayActivity;
  onClose: () => void;
  onNextActivity?: () => void;
}

export function ActivityDetailPanel({
  activity,
  index,
  nextWalkingSegment,
  nextActivity,
  onClose,
  onNextActivity,
}: ActivityDetailPanelProps) {
  return (
    <AnimatePresence>
      {activity && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 w-72 bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg overflow-hidden z-20"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-3 border-b">
            <div className="flex items-start gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                {index + 1}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm leading-tight truncate">
                  {activity.name}
                </h3>
                {activity.category && (
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-[10px] gap-1 ${CATEGORY_COLORS[activity.category]} text-white`}
                  >
                    {(() => {
                      const Icon = CATEGORY_ICONS[activity.category];
                      return Icon ? <Icon className="size-2.5" /> : null;
                    })()}
                    {CATEGORY_LABELS[activity.category]}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 -mr-2 -mt-1"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Description */}
            {activity.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {activity.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs">
              {activity.duration && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              )}
              {activity.price !== undefined && activity.price > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Euro className="size-3.5" />
                  <span>{activity.price}{activity.currency || "€"}</span>
                </div>
              )}
              {activity.startTime && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>{activity.startTime}</span>
                </div>
              )}
            </div>

            {/* Next walking segment */}
            {nextWalkingSegment && nextActivity && (
              <div className="pt-3 border-t">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                  Prochain trajet
                </p>
                <button
                  onClick={onNextActivity}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                      <Footprints className="size-3" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium">
                        {formatDuration(nextWalkingSegment.durationMinutes)} • {formatDistance(nextWalkingSegment.distanceMeters)}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                        vers {nextActivity.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
