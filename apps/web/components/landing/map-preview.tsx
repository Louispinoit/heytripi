"use client";

import { Card } from "@/components/ui/card";
import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import { motion } from "framer-motion";
import {
  Clock,
  Footprints,
  Home,
  Landmark,
  MapIcon,
  TreePine,
} from "lucide-react";
import { useEffect, useState } from "react";

// Barcelona itinerary for the demo
const places = [
  {
    id: 0,
    name: "Mon appart",
    type: "home",
    icon: Home,
    lng: 2.1686,
    lat: 41.3874,
  },
  {
    id: 1,
    name: "Sagrada Familia",
    type: "culture",
    icon: Landmark,
    lng: 2.1744,
    lat: 41.4036,
  },
  {
    id: 2,
    name: "Park Güell",
    type: "nature",
    icon: TreePine,
    lng: 2.1527,
    lat: 41.4145,
  },
];

// Walking info between points
const walkingSegments = [
  { from: "Mon appart", to: "Sagrada Familia", duration: "25 min", distance: "2.1 km" },
  { from: "Sagrada Familia", to: "Park Güell", duration: "35 min", distance: "2.8 km" },
];

export function MapPreview() {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch real walking route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const coords = places.map((p) => `${p.lng},${p.lat}`).join(";");
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates as [number, number][];
          setRouteCoordinates(coordinates);
        }
      } catch (error) {
        // Fallback to straight lines if OSRM fails
        setRouteCoordinates(places.map((p) => [p.lng, p.lat]));
      } finally {
        setIsLoaded(true);
      }
    };

    fetchRoute();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <Card className="overflow-hidden border-2 bg-card shadow-2xl pt-0 shadow-primary/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <MapIcon className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-sm">Barcelone - Jour 1</span>
              <p className="text-xs text-muted-foreground">3 étapes • 1h de marche</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Footprints className="size-3.5" />
            <span>4.9 km</span>
          </div>
        </div>

        {/* Walking segments info */}
        <div className="flex border-b bg-muted/30 px-5 py-2 gap-4">
          {walkingSegments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3" />
                <span className="font-medium text-foreground">{segment.duration}</span>
              </div>
              <span className="text-muted-foreground">→ {segment.to.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="h-[240px]">
          <Map
            center={[2.165, 41.400]}
            zoom={13}
            theme="light"
            scrollZoom={true}
            dragPan={true}
            doubleClickZoom={true}
            touchZoomRotate={true}
          >
            {/* Walking route */}
            {isLoaded && routeCoordinates.length > 0 && (
              <MapRoute
                coordinates={routeCoordinates}
                color="#F97316"
                width={4}
                opacity={0.9}
                interactive={false}
              />
            )}

            {/* Place markers */}
            {places.map((place, index) => (
              <MapMarker
                key={place.id}
                longitude={place.lng}
                latitude={place.lat}
              >
                <MarkerContent>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.8 + index * 0.2,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="relative"
                  >
                    {/* Marker */}
                    <div
                      className={`flex size-10 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
                        place.type === "home"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      }`}
                    >
                      <place.icon
                        className={`size-5 ${
                          place.type === "home" ? "" : "text-secondary"
                        }`}
                      />
                    </div>
                    {/* Badge */}
                    {place.type !== "home" && (
                      <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {index}
                      </div>
                    )}
                  </motion.div>
                </MarkerContent>
                <MarkerTooltip>
                  <div className="flex flex-col">
                    <span className="font-medium">{place.name}</span>
                    {place.type !== "home" && index > 0 && (
                      <span className="text-[10px] opacity-70">
                        {walkingSegments[index - 1]?.duration} à pied
                      </span>
                    )}
                  </div>
                </MarkerTooltip>
              </MapMarker>
            ))}

            {/* Controls */}
            <MapControls
              position="bottom-right"
              showZoom={true}
              showCompass={false}
              showLocate={false}
              showFullscreen={false}
            />
          </Map>
        </div>
      </Card>
    </motion.div>
  );
}
