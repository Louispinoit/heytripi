"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Map as MapIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import MapLibreGL from "maplibre-gl";
import { ChatContainer } from "@/components/chat";
import { Map as MapComponent, MapControls, useMap } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayActivity, WalkingSegment, Itinerary } from "./types";
import { MAP_CONFIG, MAP_CONFIG_COMPACT, POST_GENERATION_QUICK_ACTIONS } from "./data";
import { fetchWalkingRoute, calculateTotalWalking } from "./lib/walking-routes";
import { useItineraryBuilder } from "./lib/use-itinerary-builder";
import {
  DayNavigator,
  TripMapHeader,
  WalkingInfoBar,
  ActivityDetailPanel,
  ActivityMarker,
  AnimatedRoute,
  TripLoadingAnimation,
  QuickActionsBar,
  CitySlider,
  MapCityController,
  TripOverview,
} from "./components";

// Map zoom controller for legacy single-day view
function MapZoomController({
  activities,
  selectedActivityId,
}: {
  activities: DayActivity[];
  selectedActivityId: string | null;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || activities.length === 0) return;

    if (selectedActivityId) {
      const activity = activities.find((a) => a.id === selectedActivityId);
      if (activity) {
        map.flyTo({
          center: [activity.longitude, activity.latitude],
          zoom: 15,
          duration: 800,
        });
        return;
      }
    }

    if (activities.length === 1) {
      const activity = activities[0]!;
      map.flyTo({
        center: [activity.longitude, activity.latitude],
        zoom: 14,
        duration: 800,
      });
    } else {
      const bounds = new MapLibreGL.LngLatBounds();
      activities.forEach((a) => bounds.extend([a.longitude, a.latitude]));
      map.fitBounds(bounds, {
        padding: MAP_CONFIG.fitBoundsOptions.padding,
        maxZoom: MAP_CONFIG.fitBoundsOptions.maxZoom,
        duration: 800,
      });
    }
  }, [map, isLoaded, activities, selectedActivityId]);

  return null;
}

export default function NewTripPage() {
  const [input, setInput] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary>({
    destination: "",
    days: [],
  });
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [walkingSegments, setWalkingSegments] = useState<Map<string, WalkingSegment>>(new Map());
  const [mobileTab, setMobileTab] = useState<"chat" | "trip">("chat");
  const fetchedSegmentsRef = useRef<Set<string>>(new Set());
  const lastProcessedMessagesLengthRef = useRef(0);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Multi-city itinerary builder
  const {
    multiCityItinerary,
    activeCityId,
    setActiveCityId,
    tripPhase,
    loadingSteps,
  } = useItineraryBuilder(messages, status);

  const hasTrip = tripPhase === "viewing" && multiCityItinerary;

  // Get all activities for the active city (for map markers)
  const activeCityActivities = useMemo(() => {
    if (!multiCityItinerary || !activeCityId) return [];
    const city = multiCityItinerary.cities.find((c) => c.id === activeCityId);
    return city?.days.flatMap((d) => d.activities) || [];
  }, [multiCityItinerary, activeCityId]);

  // Legacy: Get current day's activities
  const currentDay = itinerary.days[currentDayIndex];
  const currentActivities = useMemo(
    () => currentDay?.activities || [],
    [currentDay?.activities]
  );

  // Calculate total walking time for current day
  const currentDayWalkingSegments = currentActivities
    .slice(0, -1)
    .map((a, i) => {
      const nextActivity = currentActivities[i + 1];
      return nextActivity ? walkingSegments.get(`${a.id}-${nextActivity.id}`) : undefined;
    })
    .filter((s): s is WalkingSegment => s !== undefined);

  const { totalMinutes: totalWalkingMinutes } = calculateTotalWalking(currentDayWalkingSegments);

  // Fetch walking routes when activities change
  useEffect(() => {
    const fetchRoutes = async () => {
      if (currentActivities.length < 2) return;

      for (let i = 0; i < currentActivities.length - 1; i++) {
        const from = currentActivities[i]!;
        const to = currentActivities[i + 1]!;
        const segmentKey = `${from.id}-${to.id}`;

        if (fetchedSegmentsRef.current.has(segmentKey)) continue;
        fetchedSegmentsRef.current.add(segmentKey);

        const segment = await fetchWalkingRoute(
          { longitude: from.longitude, latitude: from.latitude },
          { longitude: to.longitude, latitude: to.latitude }
        );

        if (segment) {
          setWalkingSegments((prev) => {
            const newMap = new Map(prev);
            newMap.set(segmentKey, segment);
            return newMap;
          });
        }
      }
    };

    fetchRoutes();
  }, [currentActivities]);

  // Legacy: Extract itinerary from tool invocations
  useEffect(() => {
    if (messages.length === lastProcessedMessagesLengthRef.current) return;
    lastProcessedMessagesLengthRef.current = messages.length;

    let newDestination = "";
    const newDays: Map<number, DayActivity[]> = new Map();
    let activityCounter = 0;

    messages.forEach((message) => {
      message.parts.forEach((part) => {
        const toolPart = part as {
          type: string;
          toolName?: string;
          state?: string;
          output?: unknown;
        };

        const isToolWithOutput =
          toolPart.type?.startsWith("tool-") &&
          toolPart.state === "output-available";

        if (isToolWithOutput) {
          const toolName = toolPart.type.replace("tool-", "");
          const result = toolPart.output as Record<string, unknown> | undefined;

          if (toolName === "showOnMap" && result?.location) {
            const loc = result.location as {
              name: string;
              latitude: number;
              longitude: number;
              type: "destination" | "hotel" | "activity" | "restaurant" | "airport";
              description?: string;
              dayNumber?: number;
              duration?: number;
              startTime?: string;
              price?: number;
              category?: string;
            };

            const dayNumber = loc.dayNumber || 1;
            if (!newDays.has(dayNumber)) {
              newDays.set(dayNumber, []);
            }

            const dayActivities = newDays.get(dayNumber)!;

            if (!dayActivities.find((a) => a.name === loc.name)) {
              activityCounter++;
              dayActivities.push({
                id: `loc-${activityCounter}`,
                name: loc.name,
                latitude: loc.latitude,
                longitude: loc.longitude,
                type: loc.type,
                description: loc.description,
                duration: loc.duration,
                startTime: loc.startTime,
                price: loc.price,
                category: loc.category as DayActivity["category"],
              });
            }

            if (loc.type === "destination" && !newDestination) {
              newDestination = loc.name;
            }
          }

          if (toolName === "planDayItinerary" && result?.day) {
            const dayData = result.day as {
              dayNumber: number;
              destination?: string;
              activities: Array<{
                name: string;
                latitude: number;
                longitude: number;
                type: "destination" | "hotel" | "activity" | "restaurant" | "airport";
                description?: string;
                duration?: number;
                startTime?: string;
                price?: number;
                category?: string;
              }>;
            };

            if (dayData.destination) {
              newDestination = dayData.destination;
            }

            newDays.set(
              dayData.dayNumber,
              dayData.activities.map((a, i) => ({
                id: `day${dayData.dayNumber}-${i}`,
                name: a.name,
                latitude: a.latitude,
                longitude: a.longitude,
                type: a.type,
                description: a.description,
                duration: a.duration,
                startTime: a.startTime,
                price: a.price,
                category: a.category as DayActivity["category"],
              }))
            );
          }
        }
      });
    });

    if (newDays.size > 0) {
      const sortedDays = Array.from(newDays.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([dayNumber, activities]) => ({
          dayNumber,
          activities,
        }));

      setItinerary({
        destination: newDestination,
        days: sortedDays,
      });

      setCurrentDayIndex(sortedDays.length - 1);
    }
  }, [messages]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage({ text: input });
        setInput("");
      }
    },
    [input, isLoading, sendMessage]
  );

  const handleQuickReply = useCallback(
    (text: string) => {
      if (!isLoading) {
        sendMessage({ text });
      }
    },
    [isLoading, sendMessage]
  );

  const handleDayChange = useCallback((day: number) => {
    const index = itinerary.days.findIndex((d) => d.dayNumber === day);
    if (index !== -1) {
      setCurrentDayIndex(index);
      setSelectedActivityId(null);
    }
  }, [itinerary.days]);

  const handleActivityClick = useCallback((activityId: string) => {
    setSelectedActivityId((prev) => (prev === activityId ? null : activityId));
  }, []);

  const handleNextActivity = useCallback(() => {
    if (!selectedActivityId) return;
    const currentIndex = currentActivities.findIndex((a) => a.id === selectedActivityId);
    if (currentIndex < currentActivities.length - 1) {
      setSelectedActivityId(currentActivities[currentIndex + 1]!.id);
    }
  }, [selectedActivityId, currentActivities]);

  // Get selected activity and next walking segment
  const selectedActivity = selectedActivityId
    ? currentActivities.find((a) => a.id === selectedActivityId) || null
    : null;
  const selectedIndex = selectedActivity
    ? currentActivities.findIndex((a) => a.id === selectedActivityId)
    : -1;
  const nextActivity = selectedIndex >= 0 && selectedIndex < currentActivities.length - 1
    ? currentActivities[selectedIndex + 1]
    : undefined;
  const nextWalkingSegment = selectedActivity && nextActivity
    ? walkingSegments.get(`${selectedActivity.id}-${nextActivity.id}`)
    : undefined;

  // Which map config to use based on phase
  const mapConfig = hasTrip ? MAP_CONFIG_COMPACT : MAP_CONFIG;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar - mobile only */}
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:hidden">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="flex-1 font-semibold">Nouveau voyage</h1>

        {/* Mobile tab switcher */}
        {hasTrip && (
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            <Button
              variant={mobileTab === "chat" ? "default" : "ghost"}
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs"
              onClick={() => setMobileTab("chat")}
            >
              <MessageSquare className="size-3.5" />
              Chat
            </Button>
            <Button
              variant={mobileTab === "trip" ? "default" : "ghost"}
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs"
              onClick={() => setMobileTab("trip")}
            >
              <MapIcon className="size-3.5" />
              Voyage
            </Button>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div
          className={cn(
            "flex flex-col border-r lg:w-[450px] xl:w-[500px]",
            hasTrip && mobileTab !== "chat" ? "hidden lg:flex" : "w-full lg:w-[450px] xl:w-[500px]"
          )}
        >
          {/* Back button - desktop only */}
          <div className="hidden shrink-0 items-center gap-2 border-b px-4 py-2 lg:flex">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                Retour
              </Link>
            </Button>
          </div>
          <ChatContainer
            messages={messages}
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onQuickReply={handleQuickReply}
            actionsSlot={
              tripPhase === "viewing" ? (
                <QuickActionsBar
                  actions={POST_GENERATION_QUICK_ACTIONS}
                  onAction={handleQuickReply}
                />
              ) : undefined
            }
            className="flex-1"
          />
        </div>

        {/* Right panel - Map + Trip Overview */}
        <div
          className={cn(
            "flex-1 flex-col",
            hasTrip && mobileTab === "trip" ? "flex" : "hidden lg:flex"
          )}
        >
          {/* === CHATTING phase: full-height map === */}
          {tripPhase === "chatting" && (
            <div className="flex flex-1 flex-col">
              <TripMapHeader
                destination={itinerary.destination}
                currentDay={currentDay?.dayNumber || 1}
                activityCount={currentActivities.length}
                totalWalkingMinutes={totalWalkingMinutes}
              />

              {itinerary.days.length > 0 && (
                <DayNavigator
                  totalDays={itinerary.days.length}
                  currentDay={currentDay?.dayNumber || 1}
                  onDayChange={handleDayChange}
                />
              )}

              {currentActivities.length > 1 && (
                <WalkingInfoBar
                  activities={currentActivities}
                  walkingSegments={walkingSegments}
                  onActivityClick={handleActivityClick}
                />
              )}

              <div className="relative flex-1">
                <MapComponent
                  center={MAP_CONFIG.defaultCenter}
                  zoom={MAP_CONFIG.defaultZoom}
                >
                  <MapZoomController
                    activities={currentActivities}
                    selectedActivityId={selectedActivityId}
                  />
                  <MapControls showZoom showLocate />

                  {currentActivities.slice(0, -1).map((activity, index) => {
                    const nextAct = currentActivities[index + 1];
                    if (!nextAct) return null;
                    const segmentKey = `${activity.id}-${nextAct.id}`;
                    const segment = walkingSegments.get(segmentKey);
                    if (!segment) return null;
                    return (
                      <AnimatedRoute
                        key={segmentKey}
                        coordinates={segment.coordinates}
                        delay={index * 100}
                      />
                    );
                  })}

                  {currentActivities.map((activity, index) => (
                    <ActivityMarker
                      key={activity.id}
                      activity={activity}
                      index={index}
                      isSelected={selectedActivityId === activity.id}
                      onClick={() => handleActivityClick(activity.id)}
                    />
                  ))}
                </MapComponent>

                <ActivityDetailPanel
                  activity={selectedActivity}
                  index={selectedIndex}
                  nextWalkingSegment={nextWalkingSegment}
                  nextActivity={nextActivity}
                  onClose={() => setSelectedActivityId(null)}
                  onNextActivity={handleNextActivity}
                />
              </div>
            </div>
          )}

          {/* === BUILDING phase: map + loading overlay === */}
          {tripPhase === "building" && (
            <div className="relative flex flex-1 flex-col">
              <div className="flex-1">
                <MapComponent
                  center={mapConfig.defaultCenter}
                  zoom={mapConfig.defaultZoom}
                >
                  <MapCityController
                    itinerary={multiCityItinerary}
                    activeCityId={activeCityId}
                  />
                  <MapControls showZoom showLocate />

                  {/* Show city markers during build */}
                  {multiCityItinerary?.cities.map((city) => (
                    <ActivityMarker
                      key={city.id}
                      activity={{
                        id: city.id,
                        name: city.cityName,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        type: "destination",
                      }}
                      index={0}
                      isSelected={activeCityId === city.id}
                      onClick={() => setActiveCityId(city.id)}
                    />
                  ))}
                </MapComponent>
              </div>

              <AnimatePresence>
                <TripLoadingAnimation steps={loadingSteps} />
              </AnimatePresence>
            </div>
          )}

          {/* === VIEWING phase: Map (40%) + CitySlider + TripOverview (60%) === */}
          {tripPhase === "viewing" && multiCityItinerary && (
            <div className="flex flex-1 flex-col">
              {/* Map section - 40% height */}
              <div className="relative h-[40%] shrink-0 border-b">
                <MapComponent
                  center={mapConfig.defaultCenter}
                  zoom={mapConfig.defaultZoom}
                >
                  <MapCityController
                    itinerary={multiCityItinerary}
                    activeCityId={activeCityId}
                    selectedActivityId={selectedActivityId}
                  />
                  <MapControls showZoom showLocate />

                  {/* City markers */}
                  {multiCityItinerary.cities.map((city) => (
                    <ActivityMarker
                      key={`city-${city.id}`}
                      activity={{
                        id: city.id,
                        name: city.cityName,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        type: "destination",
                      }}
                      index={0}
                      isSelected={activeCityId === city.id}
                      onClick={() => setActiveCityId(city.id)}
                    />
                  ))}

                  {/* Activity markers for active city */}
                  {activeCityActivities.map((activity, index) => (
                    <ActivityMarker
                      key={activity.id}
                      activity={activity}
                      index={index}
                      isSelected={selectedActivityId === activity.id}
                      onClick={() => handleActivityClick(activity.id)}
                    />
                  ))}
                </MapComponent>

                <ActivityDetailPanel
                  activity={
                    selectedActivityId
                      ? activeCityActivities.find((a) => a.id === selectedActivityId) || null
                      : null
                  }
                  index={
                    selectedActivityId
                      ? activeCityActivities.findIndex((a) => a.id === selectedActivityId)
                      : -1
                  }
                  onClose={() => setSelectedActivityId(null)}
                />
              </div>

              {/* City slider */}
              <CitySlider
                itinerary={multiCityItinerary}
                activeCityId={activeCityId}
                onCitySelect={setActiveCityId}
              />

              {/* Trip overview - 60% height */}
              <div className="flex-1 overflow-hidden">
                <TripOverview
                  itinerary={multiCityItinerary}
                  activeCityId={activeCityId}
                  onActivityClick={handleActivityClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
