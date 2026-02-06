"use client";

import { Clock, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DayActivity } from "../../types";
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_LABELS } from "../../data";

interface ActivityRowProps {
  activity: DayActivity;
  index: number;
  onClick?: () => void;
}

export function ActivityRow({ activity, index, onClick }: ActivityRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted/50"
    >
      {/* Index badge */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {index + 1}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{activity.name}</p>
            {activity.description && (
              <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                {activity.description}
              </p>
            )}
          </div>
          {activity.imageUrl && (
            <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={activity.imageUrl}
                alt={activity.name}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {activity.startTime && (
            <span className="text-[10px] font-medium text-muted-foreground">
              {activity.startTime}
            </span>
          )}
          {activity.duration && (
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Clock className="size-2.5" />
              <span>{Math.round(activity.duration / 60)}h{activity.duration % 60 > 0 ? `${String(activity.duration % 60).padStart(2, "0")}` : ""}</span>
            </div>
          )}
          {activity.price !== undefined && activity.price > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Euro className="size-2.5" />
              <span>{activity.price}€</span>
            </div>
          )}
          {activity.category && (
            <Badge
              variant="secondary"
              className={`h-4 gap-0.5 px-1.5 text-[9px] ${CATEGORY_COLORS[activity.category]} text-white`}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[activity.category!];
                return Icon ? <Icon className="size-2" /> : null;
              })()}
              {CATEGORY_LABELS[activity.category]}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
