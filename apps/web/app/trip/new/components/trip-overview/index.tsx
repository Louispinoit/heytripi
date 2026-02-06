"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { MultiCityItinerary } from "../../types";
import { CitySection } from "./city-section";

interface TripOverviewProps {
  itinerary: MultiCityItinerary;
  activeCityId: string | null;
  onActivityClick?: (activityId: string) => void;
}

export function TripOverview({
  itinerary,
  activeCityId,
  onActivityClick,
}: TripOverviewProps) {
  const cityRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to active city when it changes
  useEffect(() => {
    if (activeCityId) {
      const el = cityRefs.current.get(activeCityId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeCityId]);

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Trip header */}
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-bold">{itinerary.tripName}</h2>
          <p className="text-xs text-muted-foreground">
            {itinerary.cities.length} ville{itinerary.cities.length > 1 ? "s" : ""} au programme
            {itinerary.totalBudget && ` · Budget estimé ${itinerary.totalBudget}€`}
          </p>
        </div>

        {/* City sections */}
        {itinerary.cities.map((city, i) => (
          <div
            key={city.id}
            ref={(el) => {
              if (el) cityRefs.current.set(city.id, el);
            }}
          >
            <CitySection
              city={city}
              onActivityClick={onActivityClick}
            />
            {i < itinerary.cities.length - 1 && (
              <Separator className="mx-4" />
            )}
          </div>
        ))}
      </motion.div>
    </ScrollArea>
  );
}
