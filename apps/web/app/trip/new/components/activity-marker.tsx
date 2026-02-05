"use client";

import { motion } from "framer-motion";
import { MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import type { DayActivity } from "../types";
import { TYPE_ICONS, CATEGORY_ICONS, MARKER_COLORS } from "../data";

interface ActivityMarkerProps {
  activity: DayActivity;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ActivityMarker({
  activity,
  index,
  isSelected,
  onClick,
}: ActivityMarkerProps) {
  const CategoryIcon = activity.category ? CATEGORY_ICONS[activity.category] : null;
  const TypeIcon = TYPE_ICONS[activity.type];
  const Icon = CategoryIcon || TypeIcon;

  return (
    <MapMarker
      longitude={activity.longitude}
      latitude={activity.latitude}
      onClick={onClick}
    >
      <MarkerContent>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isSelected ? 1.15 : 1,
            opacity: 1
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className="relative cursor-pointer"
        >
          {/* Main marker */}
          <div
            className={`flex size-10 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground scale-110"
                : `border-white bg-card ${MARKER_COLORS[activity.type]}`
            }`}
          >
            <Icon
              className={`size-5 ${
                isSelected ? "text-primary-foreground" : activity.type === "destination" ? "text-primary-foreground" : "text-secondary"
              }`}
            />
          </div>

          {/* Index badge */}
          <div
            className={`absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${
              isSelected
                ? "bg-orange-500 text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {index + 1}
          </div>

          {/* Selection ring */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 -m-1 rounded-full border-2 border-primary/30"
            />
          )}
        </motion.div>
      </MarkerContent>
      <MarkerTooltip>
        <div className="text-center">
          <span className="font-medium">{activity.name}</span>
          {activity.startTime && (
            <p className="text-[10px] opacity-80">{activity.startTime}</p>
          )}
        </div>
      </MarkerTooltip>
    </MapMarker>
  );
}
