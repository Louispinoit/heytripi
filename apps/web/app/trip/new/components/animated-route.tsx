"use client";

import { useState, useEffect } from "react";
import { MapRoute } from "@/components/ui/map";
import { ROUTE_COLOR, ROUTE_WIDTH, ROUTE_OPACITY, ANIMATION_TIMING } from "../data";

interface AnimatedRouteProps {
  coordinates: [number, number][];
  delay?: number;
  color?: string;
}

export function AnimatedRoute({
  coordinates,
  delay = 0,
  color = ROUTE_COLOR,
}: AnimatedRouteProps) {
  const [visibleCoords, setVisibleCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (coordinates.length === 0) return;

    const totalPoints = coordinates.length;
    const chunkSize = Math.ceil(totalPoints / 20);
    const intervalTime = (ANIMATION_TIMING.routeDrawDuration / totalPoints) * chunkSize;

    let currentIndex = 0;
    let drawInterval: ReturnType<typeof setInterval> | null = null;

    const timer = setTimeout(() => {
      drawInterval = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= totalPoints) {
          currentIndex = totalPoints;
          if (drawInterval) clearInterval(drawInterval);
        }
        setVisibleCoords(coordinates.slice(0, currentIndex));
      }, intervalTime);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (drawInterval) clearInterval(drawInterval);
    };
  }, [coordinates, delay]);

  if (visibleCoords.length < 2) return null;

  return (
    <MapRoute
      coordinates={visibleCoords}
      color={color}
      width={ROUTE_WIDTH}
      opacity={ROUTE_OPACITY}
      interactive={false}
    />
  );
}
