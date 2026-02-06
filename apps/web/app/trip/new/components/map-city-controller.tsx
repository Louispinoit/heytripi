"use client";

import { useEffect } from "react";
import MapLibreGL from "maplibre-gl";
import { useMap } from "@/components/ui/map";
import type { MultiCityItinerary } from "../types";
import { MAP_CONFIG_COMPACT } from "../data";

interface MapCityControllerProps {
  itinerary: MultiCityItinerary | null;
  activeCityId: string | null;
  selectedActivityId?: string | null;
}

export function MapCityController({
  itinerary,
  activeCityId,
  selectedActivityId,
}: MapCityControllerProps) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !itinerary) return;

    // If a specific activity is selected, zoom to it
    if (selectedActivityId && activeCityId) {
      const city = itinerary.cities.find((c) => c.id === activeCityId);
      if (city) {
        for (const day of city.days) {
          const activity = day.activities.find(
            (a) => a.id === selectedActivityId
          );
          if (activity) {
            map.flyTo({
              center: [activity.longitude, activity.latitude],
              zoom: 15,
              duration: 800,
            });
            return;
          }
        }
      }
    }

    // If a city is active, zoom to it
    if (activeCityId) {
      const city = itinerary.cities.find((c) => c.id === activeCityId);
      if (city) {
        // If the city has day activities, fit bounds to them
        const allActivities = city.days.flatMap((d) => d.activities);
        if (allActivities.length > 1) {
          const bounds = new MapLibreGL.LngLatBounds();
          allActivities.forEach((a) =>
            bounds.extend([a.longitude, a.latitude])
          );
          map.fitBounds(bounds, {
            ...MAP_CONFIG_COMPACT.fitBoundsOptions,
            duration: 800,
          });
        } else if (allActivities.length === 1) {
          map.flyTo({
            center: [allActivities[0]!.longitude, allActivities[0]!.latitude],
            zoom: 14,
            duration: 800,
          });
        } else {
          map.flyTo({
            center: [city.longitude, city.latitude],
            zoom: 12,
            duration: 800,
          });
        }
        return;
      }
    }

    // Default: show all cities
    if (itinerary.cities.length > 1) {
      const bounds = new MapLibreGL.LngLatBounds();
      itinerary.cities.forEach((c) => bounds.extend([c.longitude, c.latitude]));
      map.fitBounds(bounds, {
        ...MAP_CONFIG_COMPACT.fitBoundsOptions,
        duration: 800,
      });
    } else if (itinerary.cities.length === 1) {
      const city = itinerary.cities[0]!;
      map.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 12,
        duration: 800,
      });
    }
  }, [map, isLoaded, itinerary, activeCityId, selectedActivityId]);

  return null;
}
