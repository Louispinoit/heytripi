"use client";

import { motion } from "framer-motion";
import { Clock, Footprints, MapIcon } from "lucide-react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
} from "@/components/ui/map";

import type { Place, RouteSegment } from "./types";
import { MAP_CONFIG } from "./data";
import { AnimatedRoute } from "./animated-route";

function getTotalWalkingTime(segmentCount: number): string {
  if (segmentCount === 1) return "25 min";
  if (segmentCount === 2) return "1h";
  return "1h20";
}

export function MapHeader({ placeCount, segmentCount }: { placeCount: number; segmentCount: number }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b bg-muted/50 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <MapIcon className="size-4" />
        </div>
        <div>
          <span className="text-sm font-semibold">Barcelone - Jour 1</span>
          <p className="text-xs text-muted-foreground">
            {placeCount === 0
              ? "En attente..."
              : `${placeCount} étape${placeCount > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      {segmentCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Footprints className="size-3.5" />
          <span>{getTotalWalkingTime(segmentCount)}</span>
        </div>
      )}
    </div>
  );
}

export function WalkingInfo({ places }: { places: Place[] }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-muted/30 px-4 py-1.5 overflow-x-auto">
      {places.map((place, i) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 text-xs whitespace-nowrap"
        >
          {i > 0 && <span className="text-muted-foreground/50 mx-1">•</span>}
          <Clock className="size-3 text-muted-foreground" />
          <span className="font-medium">{place.duration}</span>
          <span className="text-muted-foreground">→ {place.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function PlaceMarker({ place, index }: { place: Place; index: number }) {
  return (
    <MapMarker longitude={place.lng} latitude={place.lat}>
      <MarkerContent>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className="relative"
        >
          <div
            className={`flex size-10 items-center justify-center rounded-full border-2 border-white shadow-lg ${
              place.type === "home"
                ? "bg-primary text-primary-foreground"
                : "bg-card"
            }`}
          >
            <place.icon
              className={`size-5 ${place.type === "home" ? "" : "text-secondary"}`}
            />
          </div>
          {place.type !== "home" && (
            <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {index}
            </div>
          )}
        </motion.div>
      </MarkerContent>
      <MarkerTooltip>
        <span className="font-medium">{place.name}</span>
      </MarkerTooltip>
    </MapMarker>
  );
}

export function MapPanel({
  places,
  routeSegments,
}: {
  places: Place[];
  routeSegments: RouteSegment[];
}) {
  return (
    <>
      <MapHeader placeCount={places.length} segmentCount={routeSegments.length} />

      {places.length > 1 && <WalkingInfo places={places.slice(1)} />}

      <div className="flex-1">
        <Map
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          theme={MAP_CONFIG.theme}
          scrollZoom={true}
          dragPan={true}
        >
          {routeSegments.map((segment, index) => (
            <AnimatedRoute
              key={segment.id}
              coordinates={segment.coords}
              delay={index * 100}
            />
          ))}

          {places.map((place, index) => (
            <PlaceMarker key={place.id} place={place} index={index} />
          ))}

          <MapControls position="bottom-right" showZoom={true} />
        </Map>
      </div>
    </>
  );
}
