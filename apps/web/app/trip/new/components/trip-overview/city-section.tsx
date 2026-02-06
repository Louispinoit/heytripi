"use client";

import { Separator } from "@/components/ui/separator";
import type { CitySection as CitySectionType } from "../../types";
import { CityHeader } from "./city-header";
import { PhotoCarousel } from "./photo-carousel";
import { FlightCard } from "./flight-card";
import { HotelCard } from "./hotel-card";
import { LogisticsCard } from "./logistics-card";
import { DayPlanCard } from "./day-plan-card";

interface CitySectionProps {
  city: CitySectionType;
  onActivityClick?: (activityId: string) => void;
}

export function CitySection({ city, onActivityClick }: CitySectionProps) {
  const sortedDays = [...city.days].sort(
    (a, b) => a.dayNumber - b.dayNumber
  );

  return (
    <div className="space-y-3 py-4">
      <CityHeader
        cityName={city.cityName}
        description={city.description}
        startDate={city.startDate}
        endDate={city.endDate}
        dayCount={city.days.length}
      />

      <PhotoCarousel imageUrls={city.imageUrls} cityName={city.cityName} />

      <div className="space-y-3 px-4">
        {city.flight && <FlightCard flight={city.flight} />}
        {city.hotel && (
          <HotelCard hotel={city.hotel} nights={city.days.length} />
        )}
        {city.logistics.length > 0 && (
          <LogisticsCard items={city.logistics} />
        )}
      </div>

      {sortedDays.length > 0 && (
        <>
          <Separator className="mx-4" />
          <div className="space-y-2 px-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Programme jour par jour
            </h3>
            {sortedDays.map((day, i) => (
              <DayPlanCard
                key={day.dayNumber}
                day={day}
                onActivityClick={onActivityClick}
                defaultExpanded={i === 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
