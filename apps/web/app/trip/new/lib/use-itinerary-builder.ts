import { useState, useEffect, useRef, useCallback } from "react";
import type { UIMessage } from "ai";
import type {
  MultiCityItinerary,
  CitySection,
  TripDayEnhanced,
  TripPhase,
  LoadingStep,
  DayActivity,
  CityTransport,
} from "../types";
import { LOADING_STEPS_CONFIG } from "../data";

type ToolPart = {
  type: string;
  toolName?: string;
  state?: string;
  output?: Record<string, unknown>;
};

function extractToolParts(messages: UIMessage[]) {
  const parts: { toolName: string; output: Record<string, unknown> }[] = [];

  messages.forEach((message) => {
    message.parts.forEach((part) => {
      const toolPart = part as ToolPart;
      if (
        toolPart.type?.startsWith("tool-") &&
        toolPart.state === "output-available" &&
        toolPart.output
      ) {
        const toolName = toolPart.type.replace("tool-", "");
        parts.push({ toolName, output: toolPart.output });
      }
    });
  });

  return parts;
}

export function useItineraryBuilder(messages: UIMessage[], chatStatus: string) {
  const [multiCityItinerary, setMultiCityItinerary] = useState<MultiCityItinerary | null>(null);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [tripPhase, setTripPhase] = useState<TripPhase>("chatting");
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(
    LOADING_STEPS_CONFIG.map((s) => ({ ...s, status: "pending" as const }))
  );
  const lastProcessedLengthRef = useRef(0);
  const hasInitTripRef = useRef(false);

  // Advance loading step
  const advanceLoadingStep = useCallback((stepId: string) => {
    setLoadingSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) return { ...s, status: "active" as const };
        if (s.status === "active" && s.id !== stepId) return { ...s, status: "done" as const };
        return s;
      })
    );
  }, []);

  // Complete all loading steps
  const completeAllSteps = useCallback(() => {
    setLoadingSteps((prev) => prev.map((s) => ({ ...s, status: "done" as const })));
  }, []);

  // Process messages to build itinerary
  useEffect(() => {
    if (messages.length === lastProcessedLengthRef.current) return;
    lastProcessedLengthRef.current = messages.length;

    const toolParts = extractToolParts(messages);
    if (toolParts.length === 0) return;

    let currentItinerary = multiCityItinerary;

    for (const { toolName, output } of toolParts) {
      // --- initTrip ---
      if (toolName === "initTrip" && output.trip) {
        const trip = output.trip as {
          tripName: string;
          originCity: string;
          cities: Array<{
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            startDate?: string;
            endDate?: string;
            nights: number;
          }>;
          transports: CityTransport[];
          totalBudget?: number;
        };

        hasInitTripRef.current = true;
        setTripPhase("building");
        advanceLoadingStep("init");

        const cities: CitySection[] = trip.cities.map((c) => ({
          id: c.id,
          cityName: c.name,
          latitude: c.latitude,
          longitude: c.longitude,
          startDate: c.startDate,
          endDate: c.endDate,
          imageUrls: [],
          logistics: [],
          days: [],
        }));

        currentItinerary = {
          tripName: trip.tripName,
          originCity: trip.originCity,
          cities,
          transports: trip.transports,
          totalBudget: trip.totalBudget,
        };
        setMultiCityItinerary(currentItinerary);
        if (cities.length > 0) {
          setActiveCityId(cities[0]!.id);
        }
      }

      // --- planCityOverview ---
      if (toolName === "planCityOverview" && output.cityOverview) {
        const overview = output.cityOverview as {
          cityId: string;
          cityName: string;
          description: string;
          imageUrls: string[];
          flight?: {
            fromIATA: string;
            toIATA: string;
            duration: string;
            stops: number;
            price: number;
            airline?: string;
          };
          hotel?: {
            name: string;
            stars: number;
            rating: number;
            reviews: number;
            imageUrl?: string;
            pricePerNight: number;
            aiReason?: string;
          };
          logistics?: Array<{
            type: string;
            description: string;
            price?: number;
            duration?: string;
          }>;
        };

        advanceLoadingStep("flights");

        if (currentItinerary) {
          const updatedCities = currentItinerary.cities.map((city) => {
            if (city.id === overview.cityId) {
              return {
                ...city,
                description: overview.description,
                imageUrls: overview.imageUrls,
                flight: overview.flight,
                hotel: overview.hotel,
                logistics: overview.logistics || [],
              };
            }
            return city;
          });
          currentItinerary = { ...currentItinerary, cities: updatedCities };
          setMultiCityItinerary(currentItinerary);
        }
      }

      // --- planDayItinerary ---
      if (toolName === "planDayItinerary" && output.day) {
        const dayData = output.day as {
          dayNumber: number;
          destination: string;
          dayTitle?: string;
          weatherEmoji?: string;
          temperatureHigh?: number;
          cityId?: string;
          activities: Array<{
            name: string;
            latitude: number;
            longitude: number;
            type: string;
            description?: string;
            duration?: number;
            startTime?: string;
            price?: number;
            category?: string;
          }>;
        };

        advanceLoadingStep("activities");

        const enhancedDay: TripDayEnhanced = {
          dayNumber: dayData.dayNumber,
          title: dayData.dayTitle,
          weatherEmoji: dayData.weatherEmoji,
          temperatureHigh: dayData.temperatureHigh,
          cityId: dayData.cityId,
          activities: dayData.activities.map(
            (a, i): DayActivity => ({
              id: `day${dayData.dayNumber}-${i}`,
              name: a.name,
              latitude: a.latitude,
              longitude: a.longitude,
              type: a.type as DayActivity["type"],
              description: a.description,
              duration: a.duration,
              startTime: a.startTime,
              price: a.price,
              category: a.category as DayActivity["category"],
            })
          ),
        };

        if (currentItinerary) {
          // Match city by cityId or destination name
          const targetCityId =
            dayData.cityId ||
            currentItinerary.cities.find(
              (c) => c.cityName.toLowerCase() === dayData.destination.toLowerCase()
            )?.id;

          if (targetCityId) {
            const updatedCities = currentItinerary.cities.map((city) => {
              if (city.id === targetCityId) {
                // Avoid duplicate days
                const existingDayIndex = city.days.findIndex(
                  (d) => d.dayNumber === dayData.dayNumber
                );
                const updatedDays =
                  existingDayIndex >= 0
                    ? city.days.map((d, i) => (i === existingDayIndex ? enhancedDay : d))
                    : [...city.days, enhancedDay];
                return { ...city, days: updatedDays };
              }
              return city;
            });
            currentItinerary = { ...currentItinerary, cities: updatedCities };
          } else {
            // Fallback: add to first city or create a single-city itinerary
            const updatedCities = currentItinerary.cities.length > 0
              ? currentItinerary.cities.map((city, idx) => {
                  if (idx === 0) {
                    return { ...city, days: [...city.days, enhancedDay] };
                  }
                  return city;
                })
              : [
                  {
                    id: dayData.destination.toLowerCase().replace(/\s+/g, "-"),
                    cityName: dayData.destination,
                    latitude: dayData.activities[0]?.latitude || 0,
                    longitude: dayData.activities[0]?.longitude || 0,
                    imageUrls: [],
                    logistics: [],
                    days: [enhancedDay],
                  },
                ];
            currentItinerary = { ...currentItinerary, cities: updatedCities };
          }
          setMultiCityItinerary(currentItinerary);
        } else {
          // No initTrip was called - build a single-city fallback itinerary
          currentItinerary = {
            tripName: `Voyage à ${dayData.destination}`,
            originCity: "",
            cities: [
              {
                id: dayData.destination.toLowerCase().replace(/\s+/g, "-"),
                cityName: dayData.destination,
                latitude: dayData.activities[0]?.latitude || 0,
                longitude: dayData.activities[0]?.longitude || 0,
                imageUrls: [],
                logistics: [],
                days: [enhancedDay],
              },
            ],
            transports: [],
          };
          setMultiCityItinerary(currentItinerary);
          setActiveCityId(currentItinerary.cities[0]!.id);
          setTripPhase("building");
        }
      }
    }
  }, [messages, multiCityItinerary, advanceLoadingStep]);

  // Transition from building to viewing when streaming stops
  useEffect(() => {
    if (tripPhase === "building" && chatStatus === "ready" && multiCityItinerary) {
      const hasDays = multiCityItinerary.cities.some((c) => c.days.length > 0);
      if (hasDays) {
        completeAllSteps();
        // Small delay for the final animation
        const timeout = setTimeout(() => setTripPhase("viewing"), 600);
        return () => clearTimeout(timeout);
      }
    }
  }, [tripPhase, chatStatus, multiCityItinerary, completeAllSteps]);

  return {
    multiCityItinerary,
    activeCityId,
    setActiveCityId,
    tripPhase,
    loadingSteps,
  };
}
