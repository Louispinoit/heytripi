"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultiCityItinerary } from "../types";
import { TRANSPORT_EMOJIS } from "../data";

interface CitySliderProps {
  itinerary: MultiCityItinerary;
  activeCityId: string | null;
  onCitySelect: (cityId: string) => void;
}

export function CitySlider({
  itinerary,
  activeCityId,
  onCitySelect,
}: CitySliderProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b bg-muted/30 px-4 py-2 scrollbar-hide">
      {/* Origin city */}
      <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <MapPin className="size-3" />
        <span>{itinerary.originCity}</span>
      </div>

      {/* Cities with transport connectors */}
      {itinerary.cities.map((city, index) => {
        const transport = itinerary.transports[index];
        return (
          <div key={city.id} className="flex shrink-0 items-center gap-1">
            {/* Transport connector */}
            <div className="flex items-center gap-0.5 px-1 text-muted-foreground/50">
              <div className="h-px w-3 bg-border" />
              <span className="text-xs">
                {transport ? TRANSPORT_EMOJIS[transport.mode] : "→"}
              </span>
              <div className="h-px w-3 bg-border" />
            </div>

            {/* City pill */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCitySelect(city.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeCityId === city.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border hover:bg-muted"
              )}
            >
              <span>{city.cityName}</span>
              {city.startDate && city.endDate && (
                <span className="text-[10px] opacity-70">
                  {formatDateRange(city.startDate, city.endDate)}
                </span>
              )}
            </motion.button>
          </div>
        );
      })}

      {/* Return to origin */}
      {itinerary.originCity && itinerary.cities.length > 0 && (
        <>
          <div className="flex items-center gap-0.5 px-1 text-muted-foreground/50">
            <div className="h-px w-3 bg-border" />
            <span className="text-xs">
              {itinerary.transports[itinerary.transports.length - 1]
                ? TRANSPORT_EMOJIS[
                    itinerary.transports[itinerary.transports.length - 1]!.mode
                  ]
                : "→"}
            </span>
            <div className="h-px w-3 bg-border" />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3" />
            <span>{itinerary.originCity}</span>
          </div>
        </>
      )}
    </div>
  );
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${s.toLocaleDateString("fr-FR", opts)} - ${e.toLocaleDateString("fr-FR", opts)}`;
}
