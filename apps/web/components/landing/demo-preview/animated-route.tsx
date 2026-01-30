"use client";

import { useState, useEffect } from "react";
import { MapRoute } from "@/components/ui/map";
import { ANIMATION_TIMING } from "./data";

interface AnimatedRouteProps {
  coordinates: [number, number][];
  delay?: number;
}

export function AnimatedRoute({ coordinates, delay = 0 }: AnimatedRouteProps) {
  const [visibleCoords, setVisibleCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (coordinates.length === 0) return;

    const totalPoints = coordinates.length;
    const chunkSize = Math.ceil(totalPoints / 20);
    const intervalTime = (ANIMATION_TIMING.routeDrawDuration / totalPoints) * chunkSize;

    let currentIndex = 0;

    const timer = setTimeout(() => {
      const drawInterval = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= totalPoints) {
          currentIndex = totalPoints;
          clearInterval(drawInterval);
        }
        setVisibleCoords(coordinates.slice(0, currentIndex));
      }, intervalTime);

      return () => clearInterval(drawInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [coordinates, delay]);

  if (visibleCoords.length < 2) return null;

  return (
    <MapRoute
      coordinates={visibleCoords}
      color="#F97316"
      width={4}
      opacity={0.9}
      interactive={false}
    />
  );
}
