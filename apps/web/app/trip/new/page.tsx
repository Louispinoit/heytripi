"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MapLibreGL from "maplibre-gl";
import { ChatContainer } from "@/components/chat";
import { Map as MapComponent, MapControls, useMap } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import type { DayActivity, WalkingSegment, Itinerary } from "./types";
import { MAP_CONFIG } from "./data";
import { fetchWalkingRoute, calculateTotalWalking } from "./lib/walking-routes";
import {
  DayNavigator,
  TripMapHeader,
  WalkingInfoBar,
  ActivityDetailPanel,
  ActivityMarker,
  AnimatedRoute,
} from "./components";

// Map zoom controller component
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

    // If an activity is selected, zoom to it
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

    // Otherwise fit all activities
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
  const fetchedSegmentsRef = useRef<Set<string>>(new Set());
  const lastProcessedMessagesLengthRef = useRef(0);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Get current day's activities
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

  // Extract itinerary from tool invocations in messages
  useEffect(() => {
    // Skip if no new messages
    if (messages.length === lastProcessedMessagesLengthRef.current) {
      return;
    }
    lastProcessedMessagesLengthRef.current = messages.length;

    let newDestination = "";
    const newDays: Map<number, DayActivity[]> = new Map();
    let activityCounter = 0;

    messages.forEach((message) => {
      message.parts.forEach((part) => {
        // Handle tool invocations - AI SDK format: type is "tool-{toolName}"
        const toolPart = part as {
          type: string;
          toolName?: string;
          state?: string;
          output?: unknown;
        };

        // Check for tool parts with output-available state
        const isToolWithOutput =
          toolPart.type?.startsWith("tool-") &&
          toolPart.state === "output-available";

        if (isToolWithOutput) {
          // Get toolName from the type string (e.g., "tool-planDayItinerary" -> "planDayItinerary")
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

            // Avoid duplicates
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

            // Set destination from first location
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

    // Only update state if we found itinerary data
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

      // Auto-select the last day
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

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar - mobile only */}
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:hidden">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="font-semibold">Nouveau voyage</h1>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="flex w-full flex-col border-r lg:w-[450px] xl:w-[500px]">
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
            className="flex-1"
          />
        </div>

        {/* Map panel - hidden on mobile */}
        <div className="hidden flex-1 flex-col lg:flex">
          {/* Map header */}
          <TripMapHeader
            destination={itinerary.destination}
            currentDay={currentDay?.dayNumber || 1}
            activityCount={currentActivities.length}
            totalWalkingMinutes={totalWalkingMinutes}
          />

          {/* Day navigator */}
          {itinerary.days.length > 0 && (
            <DayNavigator
              totalDays={itinerary.days.length}
              currentDay={currentDay?.dayNumber || 1}
              onDayChange={handleDayChange}
            />
          )}

          {/* Walking info bar */}
          {currentActivities.length > 1 && (
            <WalkingInfoBar
              activities={currentActivities}
              walkingSegments={walkingSegments}
              onActivityClick={handleActivityClick}
            />
          )}

          {/* Map */}
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

              {/* Render walking routes */}
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

              {/* Render activity markers */}
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

            {/* Activity detail panel */}
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
      </div>
    </div>
  );
}
